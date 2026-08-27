import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { loadEnv } from './config/env.js';
import { errorHandler, notFound } from './middleware/index.js';
import { router } from './routes/index.js';

export const API_PREFIX = '/api/v1';

/**
 * Builds the Express app without starting a listener or touching the database,
 * so tests can drive it directly.
 */
export function createApp(): Express {
  const env = loadEnv();
  const app = express();

  // Behind a proxy (Render, Fly, nginx) `req.ip` is the proxy's address unless
  // this is set, which would make every rate limit share one bucket.
  app.set('trust proxy', 1);

  app.disable('x-powered-by');
  app.use(helmet());

  app.use(
    cors({
      // Explicit origin, never '*' — credentialed CORS forbids the wildcard,
      // and the refresh cookie makes every auth request credentialed.
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  );

  // Bounded body: the largest legitimate request is an onboarding batch of ~60
  // short answers, so anything approaching a megabyte is abuse.
  app.use(express.json({ limit: '64kb' }));
  app.use(cookieParser());

  app.use(API_PREFIX, router);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
