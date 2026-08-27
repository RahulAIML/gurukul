import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import { SECTIONS } from '../domain/questionSchema.js';

/**
 * A durable log of what the user actually answered.
 *
 * `FitnessProfile` holds current state; this holds the answers themselves.
 * Keeping both means a change to the profile shape does not destroy what users
 * told us, and analytics can ask "what did people answer at step 7" without
 * reverse-engineering it from a derived profile.
 *
 * One row per (user, question) — re-answering updates in place, which is what
 * onboarding actually does.
 */
const onboardingResponseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    questionId: { type: String, required: true },
    section: { type: String, enum: SECTIONS, required: true },
    type: { type: String, enum: ['single', 'multiple', 'measure'], required: true },
    /** Option ids, or a single canonical numeric string for measures. */
    value: { type: [String], required: true },
    /** Measures only: the unit `value[0]` is expressed in. */
    canonicalUnit: { type: String, default: null },
    answeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

onboardingResponseSchema.index({ userId: 1, questionId: 1 }, { unique: true });

export type OnboardingResponseDoc = InferSchemaType<typeof onboardingResponseSchema>;
export const OnboardingResponse = mongoose.model('OnboardingResponse', onboardingResponseSchema);
