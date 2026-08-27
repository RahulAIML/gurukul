import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export async function connectDatabase(uri: string): Promise<void> {
  mongoose.set('strictQuery', true);

  // Fail fast rather than queueing operations against a database that may not
  // be there — a request that hangs is harder to diagnose than one that errors.
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });

  logger.info('mongodb connected');

  mongoose.connection.on('disconnected', () => logger.warn('mongodb disconnected'));
  mongoose.connection.on('error', (err: Error) =>
    logger.error('mongodb error', { detail: err.message }),
  );
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
