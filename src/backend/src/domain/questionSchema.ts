import { z } from 'zod';

/**
 * SERVER-SIDE MIRROR of the frontend question schema.
 *
 * The client is not trusted to send valid answer ids. Every id is checked
 * against these enums, and an unknown id is rejected rather than stored — the
 * alternative is a database slowly filling with values nothing can interpret.
 *
 * This duplication is deliberate. A shared package would be DRYer but would
 * let a frontend change silently widen what the backend accepts, which is
 * exactly the coupling a trust boundary should not have.
 */
export const GENDERS = ['male', 'female'] as const;
export const GOALS = [
  'build_muscle',
  'lose_fat',
  'get_stronger',
  'improve_fitness',
  'build_stamina',
] as const;
export const LEVELS = ['beginner', 'some', 'intermediate', 'advanced'] as const;
export const LOCATIONS = ['gym', 'home', 'outdoors', 'mixed'] as const;
export const EQUIPMENT = ['full_gym', 'dumbbells', 'basic', 'none', 'mixed'] as const;
export const DURATIONS = ['short', 'medium', 'long', 'extended', 'varies'] as const;
export const TRAINING_DAYS = ['2', '3', '4', '5', '6'] as const;
export const PREFERENCES = ['strength', 'muscle', 'cardio', 'hiit', 'mobility', 'mixed'] as const;
export const MOTIVATIONS = [
  'look',
  'strong',
  'health',
  'confidence',
  'consistency',
  'performance',
  // Wellbeing motivations. Treated as motivations, never as clinical
  // conditions — no diagnosis is inferred from either.
  'stress',
  'calm',
] as const;
export const ACTIVITY = ['sedentary', 'light', 'moderate', 'very_active'] as const;

export const SECTIONS = [
  'profile',
  'goal',
  'experience',
  'environment',
  'equipment',
  'time',
  'preference',
  'motivation',
  'lifestyle',
  'measurements',
] as const;

export type Section = (typeof SECTIONS)[number];
export type AnswerType = 'single' | 'multiple' | 'measure';

/**
 * Canonical measurement bounds. These are the authoritative ones — the
 * client's own range checks are a courtesy to the user, not a control.
 */
export const MEASURE_BOUNDS = {
  age: { min: 14, max: 100, integer: true },
  height: { min: 120, max: 230, integer: false },
  weight: { min: 35, max: 250, integer: false },
} as const;

const single = <T extends readonly [string, ...string[]]>(values: T) =>
  z.array(z.enum(values)).length(1);

const multi = <T extends readonly [string, ...string[]]>(values: T) =>
  z.array(z.enum(values)).min(1).max(values.length);

const measure = (key: keyof typeof MEASURE_BOUNDS) =>
  z
    .array(z.string())
    .min(1)
    .max(2)
    .superRefine((arr, ctx) => {
      const n = Number(arr[0]);
      const bounds = MEASURE_BOUNDS[key];
      if (arr[0] === '' || !Number.isFinite(n)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'not a number' });
        return;
      }
      if (bounds.integer && !Number.isInteger(n)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'must be a whole number' });
      }
      if (n < bounds.min || n > bounds.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `out of range ${bounds.min}..${bounds.max}`,
        });
      }
    });

/**
 * questionId → validator for its value array. A response whose questionId is
 * not a key here is dropped, so a stale or spoofed client cannot invent
 * questions.
 */
export const ANSWER_VALIDATORS = {
  gender: single(GENDERS),
  primary_goal: single(GOALS),
  fitness_level: single(LEVELS),
  training_location: single(LOCATIONS),
  equipment: multi(EQUIPMENT),
  session_duration: single(DURATIONS),
  training_days: single(TRAINING_DAYS),
  workout_preference: multi(PREFERENCES),
  motivation: single(MOTIVATIONS),
  activity_level: single(ACTIVITY),
  age: measure('age'),
  height: measure('height'),
  weight: measure('weight'),
} as const;

export type KnownQuestionId = keyof typeof ANSWER_VALIDATORS;

export const isKnownQuestion = (id: string): id is KnownQuestionId =>
  Object.prototype.hasOwnProperty.call(ANSWER_VALIDATORS, id);
