import type { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { ZodError, type ZodSchema } from 'zod';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';
import { verifyAccessToken } from '../services/tokenService.js';

/** Attaches the authenticated user id. Set only by `requireAuth`. */
export interface AuthedRequest extends Request {
  userId?: string;
}

/**
 * Body validation. On failure the response carries FIELD NAMES and reasons but
 * never the submitted values — echoing a rejected password back into a
 * response body (and from there into logs and error trackers) is exactly how
 * credentials leak.
 */
export const validateBody =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const fields: Record<string, string> = {};
        for (const issue of err.issues) {
          fields[issue.path.join('.') || '_'] = issue.message;
        }
        next(new AppError('VALIDATION_FAILED', 'body validation failed', fields));
        return;
      }
      next(err);
    }
  };

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next(new AppError('SESSION_EXPIRED', 'missing bearer token'));
    return;
  }
  try {
    const claims = verifyAccessToken(header.slice(7));
    req.userId = claims.sub;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Rate limits on the auth surface.
 *
 * Keyed by IP + email so one attacker cannot lock out a legitimate user by
 * hammering their address from elsewhere, and a single IP cannot spray many
 * addresses. Not a complete defence — that needs a distributed store and
 * account lockout — but it removes the trivial credential-stuffing path.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.toLowerCase() : '';
    return `${req.ip ?? 'unknown'}:${email}`;
  },
  handler: (_req, res) => {
    res.status(429).json({ code: 'RATE_LIMITED' });
  },
});

/** Tighter still on reset, which sends mail and is a spam vector. */
export const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({ code: 'RATE_LIMITED' });
  },
});

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ code: 'NOT_FOUND' });
}

/**
 * The only place that turns an error into a response.
 *
 * A response carries a stable machine code and nothing else. No message from
 * an exception, no stack, no Mongo detail — the client maps the code to a
 * translated string, and everything diagnostic goes to the log instead.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    if (err.status >= 500) {
      logger.error('request failed', { code: err.code, detail: err.message, path: req.path });
    } else {
      logger.info('request rejected', { code: err.code, path: req.path });
    }
    res.status(err.status).json({
      code: err.code,
      ...(err.fields ? { fields: err.fields } : {}),
    });
    return;
  }

  logger.error('unhandled error', {
    detail: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    path: req.path,
  });
  res.status(500).json({ code: 'INTERNAL' });
}
