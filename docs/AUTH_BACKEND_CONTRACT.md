# Authentication Backend Contract

**Status**: NOT BUILT. This document specifies what the frontend already expects, so the backend can be written against it.

The frontend auth layer is complete and shipped. It talks to an `AuthAdapter`, and two adapters exist:

| Adapter | When active | Behaviour |
|---|---|---|
| `notConfiguredAdapter` | **Default** — no `VITE_API_URL` | Refuses cleanly with `not_configured`; the UI explains that accounts are not available yet |
| `httpApiAdapter` | `VITE_API_URL` is set | Calls the endpoints below |

**Why there is no mock auth.** The alternative would be storing emails and passwords in `localStorage` and issuing a fake session. That is insecure, teaches users their account exists when it does not, and has to be torn out later. The brief asked for architecture plus documented backend work rather than insecure mock authentication, and that is what this is.

---

## 1. Endpoints

Base: `${VITE_API_URL}` — e.g. `https://api.gurukul.app/api/v1`

### `POST /auth/signup`

```jsonc
// request
{ "email": "user@example.com", "password": "at-least-8-chars" }

// 201
{
  "user": { "id": "…", "email": "user@example.com", "createdAt": "2026-01-01T00:00:00.000Z" },
  "accessToken": "<short-lived JWT>"
}
```

Also sets the refresh cookie (§3).

### `POST /auth/login`

Same request and response shape as signup. `200` on success.

### `POST /auth/refresh`

No body. Reads the refresh cookie, returns the same shape. Used on app boot to restore a session. Must return `401` when the cookie is absent, expired or revoked — the frontend treats any failure as "anonymous" and does not retry.

### `POST /auth/logout`

No body. Revokes the refresh token server-side (not just clearing the cookie — a cookie the client discards is still valid to anyone who copied it) and clears the cookie. Returns `204`.

### `POST /auth/password-reset`

```jsonc
{ "email": "user@example.com" }
```

Returns `204` **whether or not the address exists**. Revealing which emails have accounts is an enumeration vector.

---

## 2. Error contract

Non-2xx responses must carry a stable machine code. The frontend maps codes to translated messages and **never renders a server-provided string**.

```jsonc
{ "code": "INVALID_CREDENTIALS", "message": "for logs, not for users" }
```

| Code | HTTP | Frontend message |
|---|---|---|
| `INVALID_CREDENTIALS` | 401 | "That email and password combination did not match" |
| `EMAIL_TAKEN` | 409 | "An account with this email already exists" |
| `WEAK_PASSWORD` | 422 | "Password must be at least 8 characters" |
| `INVALID_EMAIL` | 422 | "Please enter a valid email address" |
| `SESSION_EXPIRED` | 401 | "Your session has expired. Please log in again." |
| anything else | any | "Something went wrong on our side. Please try again." |

`INVALID_CREDENTIALS` must be returned for both "no such user" and "wrong password" — distinguishing them leaks which emails are registered.

---

## 3. Session strategy

**Refresh token** — httpOnly, `Secure`, `SameSite=Lax` cookie, ~30 days, rotated on every refresh, revocable server-side.

**Access token** — short-lived (~15 min) JWT returned in the response body. The frontend holds it **in memory only**; `httpApiAdapter` never writes it to `localStorage` or `sessionStorage`, both of which any XSS payload can read.

CORS must send `Access-Control-Allow-Credentials: true` and an explicit origin (not `*`), since the cookie rides on cross-origin requests.

---

## 4. Password storage

- **bcrypt** (cost ≥ 12) or **argon2id**. Never SHA-family, never unsalted, never reversible.
- Minimum 8 characters, enforced server-side. The client check is a courtesy, not a control.
- Never log, never return, never include in any response.

---

## 5. What must be re-validated server-side

Everything the client sends, on the principle that the client is not trustworthy:

| Field | Server-side rule |
|---|---|
| `email` | Format, normalised to lowercase, uniqueness |
| `password` | Length, and hashed before storage |
| `age` | Integer, 14–100 |
| `heightCm` | 120–230 |
| `weightKg` | 35–250 |
| every answer id | Must be a member of the enum in the question schema — reject unknown ids rather than storing them |
| `bmi` | **Recalculated from canonical height and weight. The client-sent value is ignored.** |

BMI is computed on the client for instant feedback; it is a *display* value. The stored value must be derived server-side from `heightCm` and `weightKg` using the same formula (`kg / m²`), because a client can send anything.

---

## 6. Data model

Identity is kept separate from fitness data, so the personalization profile can be rewritten without touching credentials.

```
User            _id, email (unique, lowercase), passwordHash, createdAt, updatedAt,
                emailVerifiedAt?
Session         _id, userId, refreshTokenHash, expiresAt, revokedAt?, userAgent?, ip?
Profile         userId, gender, age, heightCm, weightKg          ← canonical units only
FitnessProfile  userId, primaryGoal, fitnessLevel, trainingLocation, equipment[],
                sessionDuration, trainingDays, workoutPreferences[], motivation,
                activityLevel, bmi (derived), updatedAt
OnboardingResponse
                userId, questionId, section, type, value[], canonicalUnit?, answeredAt
```

`OnboardingResponse` is an append-friendly log of what was actually answered, keyed by the stable question ids. `FitnessProfile` is the current derived state. Keeping both means a schema change does not lose history, and analytics can ask "what did people answer at step 4" without reverse-engineering a profile.

Store refresh tokens **hashed**. A stolen database should not yield usable sessions.

---

## 7. Onboarding sync

Answers currently live in `localStorage` under `gurukul.onboarding.fitness.v2`.

On first authentication the client should `POST` the accumulated answers:

### `PUT /me/onboarding`

```jsonc
{
  "locale": "en",
  "responses": [
    { "questionId": "primary_goal", "section": "goal", "type": "single", "value": ["build_muscle"] },
    { "questionId": "height", "section": "measurements", "type": "measure",
      "value": ["180.3"], "canonicalUnit": "cm" }
  ]
}
```

The server validates every id and value against the schema, writes `OnboardingResponse` rows, derives `Profile` / `FitnessProfile`, recalculates BMI, and returns the derived profile. Local storage then becomes a cache rather than the source of truth.

**Conflict rule to decide before building**: if a user onboards anonymously on two devices and then logs in on both, the second sync overwrites the first. Last-write-wins is acceptable for a first release but should be a deliberate choice, not a discovery.

---

## 8. Google OAuth

`supportsGoogle` is `false` and the button is **not rendered**. An inert social button that does nothing is worse than its absence.

To enable: implement the authorization-code flow with PKCE server-side, add `POST /auth/google` accepting the code, and flip `supportsGoogle` in `httpApiAdapter`. The client secret stays server-side — never in frontend code or `VITE_` variables, all of which ship to the browser.

---

## 9. Environment variables

Frontend (`VITE_`-prefixed, **public — these ship in the bundle**):

```
VITE_API_URL=https://api.gurukul.app/api/v1
```

Backend (**never `VITE_`-prefixed**):

```
MONGODB_URI=…
JWT_ACCESS_SECRET=…
JWT_REFRESH_SECRET=…
BCRYPT_COST=12
CORS_ORIGIN=https://gurukul.app
GOOGLE_CLIENT_ID=…        # when OAuth lands
GOOGLE_CLIENT_SECRET=…
```

No secret belongs in any `VITE_` variable. Anything so prefixed is readable by every visitor.

---

## 10. Also required, not yet specified

- Rate limiting on `/auth/*` (credential stuffing).
- Email verification before treating an address as confirmed.
- Audit logging of auth events.
- Account deletion, and what happens to `OnboardingResponse` rows on deletion.

---

## 11. Status as of the header-auth phase

The service in `src/backend` now implements sections 1–9 of this contract and
passes 44 integration tests. The frontend auth module talks to it through
`AuthAdapter`, and the whole flow — sign up, log in, log out, password reset,
session restore, onboarding association — has been verified end to end against
the running service (53 browser assertions).

### What is wired

| Piece | Endpoint | Status |
|---|---|---|
| Sign up (with optional display name) | `POST /auth/signup` | implemented |
| Log in | `POST /auth/login` | implemented |
| Session restore / rotation | `POST /auth/refresh` | implemented |
| Log out | `POST /auth/logout` | implemented |
| Password reset request | `POST /auth/password-reset` | endpoint implemented, **no mail transport** |
| Onboarding association | `PUT /me/onboarding` | implemented |
| Derived profile | `GET /me/onboarding` | implemented |

### What still has to be connected

1. **`VITE_API_URL` is not set in the Vercel project.** Until it is, the app
   selects `notConfiguredAdapter`: the header, both forms and all validation
   render, and submitting says plainly that accounts are not available yet.
   Setting the variable is the entire switch-over — no code change.
2. **A mail transport.** `requestPasswordReset` currently revokes the user's
   sessions and returns success without sending anything. It must not be
   advertised as working until a transport exists.
3. **A MongoDB instance.** `MONGODB_URI` has to point at a real cluster; the
   test suite and the local harness use an in-memory server.
4. **Google OAuth.** `supportsGoogle` is `false`, so the button does not
   render at all. Flip it only when the callback actually exists.

### Two constraints discovered while wiring this up

**Refresh must be single-flight on the client.** The backend rotates the
refresh token on every use and treats reuse of a rotated token as theft,
revoking every session for that user. That is correct, and it means two
concurrent refreshes log the user out of everywhere. React StrictMode's double
effect invocation triggered exactly this. `httpApi.ts` therefore shares one
in-flight refresh promise across all callers. Any future client must do the
same.

**The sync payload carries the question type and canonical unit.** A stored
answer is only strings — `['180.3', 'cm']` and `['dumbbells', 'basic']` are
indistinguishable without the schema. The client sends `type` and
`canonicalUnit` so the server can confirm it is storing centimetres rather
than silently treating an inch value as one. Only the canonical value is ever
sent; the unit the user happened to type in is not part of their profile.
