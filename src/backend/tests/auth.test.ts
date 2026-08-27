import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { Express } from 'express';

/**
 * Real integration tests: a real MongoDB (in-memory) behind the real Express
 * app. Not mocks — the point is to prove the endpoints, the unique indexes,
 * the cookie flags and the validation actually behave, because "the code looks
 * right" is not evidence.
 */

let app: Express;
let mongo: MongoMemoryServer;

const PASSWORD = 'correct-horse-battery';

/**
 * A fresh email per test.
 *
 * The rate limiter is keyed on IP + email and every test shares one IP.
 * Reusing a single address made the suite exhaust its own bucket and start
 * receiving 429s that looked like auth failures — the limiter was right and
 * the tests were wrong. Unique addresses keep each test in its own bucket; the
 * limiter gets its own dedicated test below.
 */
let emailCounter = 0;
const uniqueEmail = () => `rider${++emailCounter}@Example.com`;

const creds = (email = uniqueEmail()) => ({ email, password: PASSWORD });

function setCookies(res: request.Response): string[] {
  const raw = res.headers['set-cookie'];
  return Array.isArray(raw) ? raw : raw ? [raw] : [];
}

const refreshCookie = (res: request.Response): string | undefined =>
  setCookies(res)
    .find((c) => c.startsWith('gurukul_rt='))
    ?.split(';')[0]
    ?.split('=')[1];

const cookieAttrs = (res: request.Response): string =>
  setCookies(res).find((c) => c.startsWith('gurukul_rt=')) ?? '';

async function signUp(c = creds()) {
  const res = await request(app).post('/api/v1/auth/signup').send(c);
  return { res, creds: c, token: res.body.accessToken as string };
}

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();

  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = mongo.getUri();
  process.env.JWT_ACCESS_SECRET = 'a'.repeat(48);
  process.env.JWT_REFRESH_SECRET = 'b'.repeat(48);
  // Lowest legal cost: this suite hashes a lot and correctness does not depend
  // on the work factor.
  process.env.BCRYPT_COST = '10';
  process.env.COOKIE_SECURE = 'false';

  const { createApp } = await import('../src/app.js');
  app = createApp();

  await mongoose.connect(mongo.getUri());
  // Unique indexes are what actually enforce uniqueness; without building them
  // the duplicate-email test would pass for the wrong reason.
  await mongoose.connection.syncIndexes();
}, 180_000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (const c of collections) await c.deleteMany({});
});

describe('health', () => {
  it('responds', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('signup', () => {
  it('creates an account and returns a user plus an access token', async () => {
    const { res, creds: c } = await signUp();
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(c.email.toLowerCase()); // normalised
    expect(typeof res.body.accessToken).toBe('string');
    expect(res.body.user).not.toHaveProperty('passwordHash');
    expect(JSON.stringify(res.body)).not.toContain(PASSWORD);
  });

  it('sets an httpOnly, SameSite=Lax refresh cookie scoped to /auth', async () => {
    const { res } = await signUp();
    const attrs = cookieAttrs(res);
    expect(attrs).toContain('HttpOnly');
    expect(attrs).toContain('SameSite=Lax');
    expect(attrs).toContain('Path=/api/v1/auth');
    // COOKIE_SECURE=false here, so Secure must be absent — with it set the
    // browser would drop the cookie over plain http locally.
    expect(attrs).not.toContain('Secure');
  });

  it('never returns the refresh token in the body', async () => {
    const { res } = await signUp();
    expect(res.body).not.toHaveProperty('refreshToken');
  });

  it('stores only a bcrypt hash, never the password', async () => {
    await signUp();
    const doc = await mongoose.connection.db!.collection('users').findOne({});
    expect(doc?.passwordHash).toBeTypeOf('string');
    expect(doc?.passwordHash).toMatch(/^\$2[aby]\$/);
    expect(doc?.passwordHash).not.toContain(PASSWORD);
    expect(doc).not.toHaveProperty('password');
  });

  it('stores the refresh token hashed, not raw', async () => {
    const { res } = await signUp();
    const raw = refreshCookie(res)!;
    const session = await mongoose.connection.db!.collection('sessions').findOne({});
    expect(session?.tokenHash).toBeTypeOf('string');
    expect(session?.tokenHash).not.toBe(raw);
    expect(session?.tokenHash).toHaveLength(64); // sha256 hex
  });

  it('rejects a duplicate email with EMAIL_TAKEN', async () => {
    const c = creds();
    await signUp(c);
    const { res } = await signUp(c);
    expect(res.status).toBe(409);
    expect(res.body.code).toBe('EMAIL_TAKEN');
  });

  it('treats email case as insensitive for uniqueness', async () => {
    const c = creds();
    await signUp(c);
    const { res } = await signUp({ ...c, email: c.email.toUpperCase() });
    expect(res.body.code).toBe('EMAIL_TAKEN');
  });

  it('rejects a short password without echoing it back', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: uniqueEmail(), password: 'short' });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('VALIDATION_FAILED');
    expect(res.body.fields).toHaveProperty('password');
    expect(JSON.stringify(res.body)).not.toContain('short');
  });

  it('rejects a malformed email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'not-an-email', password: PASSWORD });
    expect(res.status).toBe(422);
    expect(res.body.fields).toHaveProperty('email');
  });
});

describe('login', () => {
  it('succeeds with the right password', async () => {
    const { creds: c } = await signUp();
    const res = await request(app).post('/api/v1/auth/login').send(c);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(c.email.toLowerCase());
  });

  it('returns the SAME response for a wrong password and an unknown user', async () => {
    const { creds: c } = await signUp();

    const wrongPassword = await request(app)
      .post('/api/v1/auth/login')
      .send({ ...c, password: 'wrong-but-long-enough' });

    const unknownUser = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: uniqueEmail(), password: 'wrong-but-long-enough' });

    // Distinguishing these turns login into an account-enumeration oracle, so
    // status and body must be identical.
    expect(wrongPassword.status).toBe(401);
    expect(unknownUser.status).toBe(401);
    expect(wrongPassword.body).toEqual(unknownUser.body);
    expect(wrongPassword.body.code).toBe('INVALID_CREDENTIALS');
  });
});

describe('refresh and rotation', () => {
  it('exchanges the cookie for a new access token and rotates the refresh token', async () => {
    const { res: signup } = await signUp();
    const first = refreshCookie(signup)!;

    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', `gurukul_rt=${first}`);

    expect(res.status).toBe(200);
    expect(typeof res.body.accessToken).toBe('string');
    const second = refreshCookie(res)!;
    expect(second).toBeDefined();
    expect(second).not.toBe(first); // rotated
  });

  it('rejects a reused refresh token AND kills every session for that user', async () => {
    const { res: signup } = await signUp();
    const first = refreshCookie(signup)!;

    const rotated = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', `gurukul_rt=${first}`);
    const second = refreshCookie(rotated)!;

    // Replaying a consumed token is the signature of a stolen cookie.
    const replay = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', `gurukul_rt=${first}`);
    expect(replay.status).toBe(401);
    expect(replay.body.code).toBe('SESSION_EXPIRED');

    // The legitimate chain is torn down too: safer to log the real user out
    // than to leave a thief holding a live session.
    const afterBreach = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', `gurukul_rt=${second}`);
    expect(afterBreach.status).toBe(401);
  });

  it('rejects refresh with no cookie', async () => {
    const res = await request(app).post('/api/v1/auth/refresh');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('SESSION_EXPIRED');
  });

  it('rejects a forged refresh token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', 'gurukul_rt=totally-made-up-value');
    expect(res.status).toBe(401);
  });
});

describe('logout', () => {
  it('revokes the session server-side, not just in the browser', async () => {
    const { res: signup } = await signUp();
    const token = refreshCookie(signup)!;

    const out = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', `gurukul_rt=${token}`);
    expect(out.status).toBe(204);

    // A copied cookie must be dead too, which only server-side revocation
    // achieves.
    const reuse = await request(app)
      .post('/api/v1/auth/refresh')
      .set('Cookie', `gurukul_rt=${token}`);
    expect(reuse.status).toBe(401);
  });
});

describe('protected routes', () => {
  it('rejects a missing bearer token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects a garbage bearer token', async () => {
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', 'Bearer nope');
    expect(res.status).toBe(401);
  });

  it('rejects an access token signed with the wrong secret', async () => {
    const jwt = await import('jsonwebtoken');
    const forged = jwt.default.sign({ sub: 'abc', type: 'access' }, 'z'.repeat(48));
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${forged}`);
    expect(res.status).toBe(401);
  });

  it('rejects a refresh-shaped token used as a bearer', async () => {
    const jwt = await import('jsonwebtoken');
    // Right secret, wrong `type` claim — must still be refused.
    const wrongType = jwt.default.sign({ sub: 'abc', type: 'refresh' }, 'a'.repeat(48));
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${wrongType}`);
    expect(res.status).toBe(401);
  });

  it('accepts a valid access token', async () => {
    const { token, creds: c } = await signUp();
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(c.email.toLowerCase());
  });
});

describe('password reset', () => {
  it('returns 204 for an unknown address, so it cannot enumerate accounts', async () => {
    const res = await request(app)
      .post('/api/v1/auth/password-reset')
      .send({ email: uniqueEmail() });
    expect(res.status).toBe(204);
  });

  it('returns the same 204 for a known address', async () => {
    const { creds: c } = await signUp();
    const res = await request(app).post('/api/v1/auth/password-reset').send({ email: c.email });
    expect(res.status).toBe(204);
  });
});

describe('rate limiting', () => {
  it('starts refusing after the window budget is spent', async () => {
    // Its own email, so this test cannot starve any other.
    const email = uniqueEmail();
    const attempt = () =>
      request(app).post('/api/v1/auth/login').send({ email, password: 'wrong-but-long-enough' });

    let limited = false;
    for (let i = 0; i < 24; i++) {
      const res = await attempt();
      if (res.status === 429) {
        expect(res.body.code).toBe('RATE_LIMITED');
        limited = true;
        break;
      }
    }
    expect(limited).toBe(true);
  });
});

describe('onboarding sync', () => {
  const valid = [
    { questionId: 'gender', section: 'profile', type: 'single', value: ['male'] },
    { questionId: 'primary_goal', section: 'goal', type: 'single', value: ['build_muscle'] },
    { questionId: 'fitness_level', section: 'experience', type: 'single', value: ['beginner'] },
    { questionId: 'training_days', section: 'time', type: 'single', value: ['4'] },
    {
      questionId: 'height',
      section: 'measurements',
      type: 'measure',
      value: ['180.3'],
      canonicalUnit: 'cm',
    },
    {
      questionId: 'weight',
      section: 'measurements',
      type: 'measure',
      value: ['79.8'],
      canonicalUnit: 'kg',
    },
  ];

  const put = (token: string, body: Record<string, unknown>) =>
    request(app).put('/api/v1/me/onboarding').set('Authorization', `Bearer ${token}`).send(body);

  it('requires authentication', async () => {
    const res = await request(app).put('/api/v1/me/onboarding').send({ responses: valid });
    expect(res.status).toBe(401);
  });

  it('stores valid answers and derives the profile', async () => {
    const { token } = await signUp();
    const res = await put(token, { locale: 'en', responses: valid });

    expect(res.status).toBe(200);
    expect(res.body.accepted).toHaveLength(6);
    expect(res.body.rejected).toEqual({});
    expect(res.body.profile.primaryGoal).toBe('build_muscle');
    expect(res.body.profile.heightCm).toBe(180.3);
    expect(res.body.profile.trainingDays).toBe(4);
  });

  it('RECALCULATES BMI server-side and ignores any client-sent value', async () => {
    const { token } = await signUp();
    const res = await put(token, {
      locale: 'en',
      responses: valid,
      // A client claiming an absurd BMI must have no effect whatsoever.
      bmi: { value: 1, category: 'under' },
    });

    // 180.3cm / 79.8kg ≈ 24.55
    expect(res.body.profile.bmi.value).toBeGreaterThan(24);
    expect(res.body.profile.bmi.value).toBeLessThan(25);
    expect(res.body.profile.bmi.category).toBe('healthy');
  });

  it('rejects an unknown questionId instead of storing it', async () => {
    const { token } = await signUp();
    const res = await put(token, {
      responses: [
        ...valid,
        { questionId: 'favourite_colour', section: 'profile', type: 'single', value: ['red'] },
      ],
    });

    expect(res.status).toBe(200);
    expect(res.body.rejected).toHaveProperty('favourite_colour');
    expect(res.body.accepted).not.toContain('favourite_colour');

    const rows = await mongoose.connection
      .db!.collection('onboardingresponses')
      .find({ questionId: 'favourite_colour' })
      .toArray();
    expect(rows).toHaveLength(0);
  });

  it('rejects an answer id that is not in the question enum', async () => {
    const { token } = await signUp();
    const res = await put(token, {
      responses: [
        { questionId: 'primary_goal', section: 'goal', type: 'single', value: ['become_a_bird'] },
      ],
    });
    expect(res.body.rejected).toHaveProperty('primary_goal');
  });

  it('rejects an out-of-range measurement', async () => {
    const { token } = await signUp();
    const res = await put(token, {
      responses: [
        { questionId: 'height', section: 'measurements', type: 'measure', value: ['420'] },
      ],
    });
    expect(res.body.rejected).toHaveProperty('height');
    expect(res.body.profile.heightCm).toBeNull();
  });

  it('rejects a non-integer age', async () => {
    const { token } = await signUp();
    const res = await put(token, {
      responses: [
        { questionId: 'age', section: 'measurements', type: 'measure', value: ['30.5'] },
      ],
    });
    expect(res.body.rejected).toHaveProperty('age');
  });

  it('keeps good answers when one in the batch is bad', async () => {
    const { token } = await signUp();
    const res = await put(token, {
      responses: [
        { questionId: 'primary_goal', section: 'goal', type: 'single', value: ['lose_fat'] },
        { questionId: 'height', section: 'measurements', type: 'measure', value: ['999'] },
      ],
    });
    expect(res.body.accepted).toContain('primary_goal');
    expect(res.body.rejected).toHaveProperty('height');
    expect(res.body.profile.primaryGoal).toBe('lose_fat');
  });

  it('updates in place when a question is re-answered', async () => {
    const { token } = await signUp();
    const send = (goal: string) =>
      put(token, {
        responses: [{ questionId: 'primary_goal', section: 'goal', type: 'single', value: [goal] }],
      });

    await send('build_muscle');
    const res = await send('lose_fat');
    expect(res.body.profile.primaryGoal).toBe('lose_fat');

    const rows = await mongoose.connection
      .db!.collection('onboardingresponses')
      .find({ questionId: 'primary_goal' })
      .toArray();
    expect(rows).toHaveLength(1);
  });

  it('scopes answers to the authenticated user', async () => {
    const { token } = await signUp();
    await put(token, { responses: valid });

    const { token: otherToken } = await signUp();
    const res = await request(app)
      .get('/api/v1/me/onboarding')
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(200);
    expect(res.body.profile).toBeNull();
  });

  it('rejects an oversized batch', async () => {
    const { token } = await signUp();
    const res = await put(token, {
      responses: Array.from({ length: 61 }, () => ({
        questionId: 'gender',
        section: 'profile',
        type: 'single',
        value: ['male'],
      })),
    });
    expect(res.status).toBe(422);
  });
});

describe('error responses', () => {
  it('never leaks internal detail, stacks or Mongo errors', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: uniqueEmail(), password: 'wrong-but-long-enough' });

    expect(Object.keys(res.body)).toEqual(['code']);
    expect(JSON.stringify(res.body)).not.toMatch(/mongo|stack|at Object|E11000/i);
  });

  it('returns NOT_FOUND for an unknown route', async () => {
    const res = await request(app).get('/api/v1/nope');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('NOT_FOUND');
  });

  it('does not advertise the server framework', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers).not.toHaveProperty('x-powered-by');
  });
});
