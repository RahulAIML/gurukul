import mongoose, { Schema, type InferSchemaType } from 'mongoose';
import {
  ACTIVITY,
  DURATIONS,
  EQUIPMENT,
  GENDERS,
  GOALS,
  LEVELS,
  LOCATIONS,
  MOTIVATIONS,
  PREFERENCES,
} from '../domain/questionSchema.js';

/**
 * Current derived state of a user's personalization.
 *
 * CANONICAL UNITS ONLY: `heightCm` and `weightKg`. There is deliberately
 * nowhere to put pounds or inches — a schema that cannot represent the
 * ambiguity cannot suffer from it.
 *
 * `bmi` is derived server-side on every write and is never accepted from a
 * client.
 */
const fitnessProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    gender: { type: String, enum: GENDERS, default: null },
    age: { type: Number, default: null },
    heightCm: { type: Number, default: null },
    weightKg: { type: Number, default: null },

    bmi: {
      value: { type: Number, default: null },
      category: {
        type: String,
        enum: ['under', 'healthy', 'over', 'high'],
        default: null,
      },
    },

    primaryGoal: { type: String, enum: GOALS, default: null },
    fitnessLevel: { type: String, enum: LEVELS, default: null },
    trainingLocation: { type: String, enum: LOCATIONS, default: null },
    equipment: { type: [{ type: String, enum: EQUIPMENT }], default: [] },
    sessionDuration: { type: String, enum: DURATIONS, default: null },
    trainingDays: { type: Number, default: null },
    workoutPreferences: { type: [{ type: String, enum: PREFERENCES }], default: [] },
    motivation: { type: String, enum: MOTIVATIONS, default: null },
    activityLevel: { type: String, enum: ACTIVITY, default: null },

    locale: { type: String, default: 'en' },
  },
  { timestamps: true },
);

export type FitnessProfileDoc = InferSchemaType<typeof fitnessProfileSchema>;
export const FitnessProfile = mongoose.model('FitnessProfile', fitnessProfileSchema);
