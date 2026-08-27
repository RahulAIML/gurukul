import mongoose, { Schema, type InferSchemaType } from 'mongoose';

/**
 * Refresh sessions, stored HASHED.
 *
 * Storing the raw refresh token would mean a database dump yields a usable
 * session for every logged-in user. Storing a hash means it does not.
 *
 * Revoked rows are kept rather than deleted so that presenting a revoked
 * token can be detected — that is a signal the token leaked, not just an
 * expired login.
 */
const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, index: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    /** Diagnostics for a future "your sessions" screen. Never used for auth. */
    userAgent: { type: String, default: null },
  },
  { timestamps: true },
);

// Mongo reclaims expired rows itself; nothing else has to sweep them.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type SessionDoc = InferSchemaType<typeof sessionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Session = mongoose.model('Session', sessionSchema);
