import { createApp } from './app.js';
import { loadEnv } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

async function main() {
  // Validated before anything else: a service that boots with a missing JWT
  // secret and fails on the first login is worse than one that refuses to
  // start at all.
  const env = loadEnv();

  await connectDatabase(env.MONGODB_URI);

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info('auth service listening', { port: env.PORT, env: env.NODE_ENV });
  });

  // Finish in-flight requests before exiting, so a deploy does not drop a
  // login mid-flight.
  const shutdown = (signal: string) => {
    logger.info('shutting down', { signal });
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    // If connections refuse to drain, do not hang the container forever.
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err: unknown) => {
  logger.error('failed to start', {
    detail: err instanceof Error ? err.message : String(err),
  });
  process.exit(1);
});
