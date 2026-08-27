/**
 * Runs the real auth service against a self-contained MongoDB, so the whole
 * JWT flow works with no database to install and no cloud account to create.
 *
 *   npm run dev:demo
 *
 * This is a DEMO/DEVELOPMENT entry point, not a deployment path. It is the
 * real service — real bcrypt hashing, real signed JWTs, real rotating refresh
 * tokens — only the storage is local. Nothing here is mocked or faked; the
 * only difference from production is where the data lives and that the secrets
 * are throwaway.
 *
 * Data persists in `.demo-data/` between restarts, so an account created for a
 * demo is still there tomorrow. Delete that folder to start clean.
 *
 * It refuses to run with NODE_ENV=production: the generated secrets are
 * predictable by design, and a real deployment must supply its own.
 */
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { MongoMemoryServer } from 'mongodb-memory-server';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

if (process.env.NODE_ENV === 'production') {
  console.error(
    'dev:demo refuses to run with NODE_ENV=production.\n' +
      'It generates throwaway secrets and stores data on local disk.\n' +
      'Use `npm start` with a real MONGODB_URI and real JWT secrets instead.',
  );
  process.exit(1);
}

const dbPath = resolve(root, '.demo-data');
mkdirSync(dbPath, { recursive: true });

console.log('starting a local MongoDB (first run downloads a binary, ~90MB)…');
const mongo = await MongoMemoryServer.create({
  instance: {
    dbName: 'gurukul',
    // With a dbPath and wiredTiger, the "memory" server keeps its data on
    // disk, so demo accounts survive a restart.
    dbPath,
    storageEngine: 'wiredTiger',
  },
});

/**
 * Secrets are generated per run rather than hardcoded. A hardcoded secret in a
 * repo is a real secret the moment someone copies this file into production.
 * Regenerating them means existing access tokens stop verifying on restart —
 * the refresh cookie is opaque and DB-backed, so a demo user is simply asked
 * to log in again, which is the correct behaviour anyway.
 */
const secret = () => randomBytes(48).toString('hex');

process.env.NODE_ENV ??= 'development';
process.env.MONGODB_URI = mongo.getUri('gurukul');
process.env.JWT_ACCESS_SECRET = secret();
process.env.JWT_REFRESH_SECRET = secret();
// Lowest cost the validator allows. Real deployments use the default of 12;
// 10 keeps a demo signup snappy without dropping below a defensible factor.
process.env.BCRYPT_COST ??= '10';
process.env.COOKIE_SECURE ??= 'false';
process.env.CORS_ORIGIN ??= 'http://localhost:5173';
process.env.PORT ??= '4000';

console.log(`local MongoDB ready, data in ${dbPath}`);
console.log(`CORS origin: ${process.env.CORS_ORIGIN}`);
console.log('');
console.log('Point the frontend at this service by creating');
console.log('  src/frontend/.env.local');
console.log(`with  VITE_API_URL=http://localhost:${process.env.PORT}/api/v1`);
console.log('');

// Imported only after the environment is in place — `loadEnv()` validates once
// and caches, so it has to see the finished environment.
await import('../src/server.ts');

const stop = async () => {
  await mongo.stop();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
