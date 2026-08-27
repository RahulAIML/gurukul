import { Router, type RequestHandler } from 'express';
import {
  credentialsSchema,
  emailOnlySchema,
  getMe,
  postLogIn,
  postLogOut,
  postPasswordReset,
  postRefresh,
  postSignUp,
} from '../controllers/authController.js';
import {
  getOnboardingProfile,
  putOnboarding,
  syncSchema,
} from '../controllers/onboardingController.js';
import { authLimiter, requireAuth, resetLimiter, validateBody } from '../middleware/index.js';

/**
 * Wraps an async handler so a rejected promise reaches the error middleware.
 *
 * Express 4 does not await handlers: an async function that throws produces an
 * unhandled rejection and a request that hangs forever rather than a 500.
 */
const wrap =
  (handler: (...args: Parameters<RequestHandler>) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    handler(req, res, next).catch(next);
  };

export const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

/* ── auth ────────────────────────────────────────────────────────── */
router.post('/auth/signup', authLimiter, validateBody(credentialsSchema), wrap(postSignUp));
router.post('/auth/login', authLimiter, validateBody(credentialsSchema), wrap(postLogIn));
// No body to validate and no rate limit keyed on email — refresh is driven by
// the cookie, and limiting it would log out active users under load.
router.post('/auth/refresh', wrap(postRefresh));
router.post('/auth/logout', wrap(postLogOut));
router.post(
  '/auth/password-reset',
  resetLimiter,
  validateBody(emailOnlySchema),
  wrap(postPasswordReset),
);
router.get('/auth/me', requireAuth, wrap(getMe));

/* ── onboarding ──────────────────────────────────────────────────── */
router.put('/me/onboarding', requireAuth, validateBody(syncSchema), wrap(putOnboarding));
router.get('/me/onboarding', requireAuth, wrap(getOnboardingProfile));
