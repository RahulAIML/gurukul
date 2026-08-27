import type { BmiResult } from './bmi';

/**
 * The structured user profile.
 *
 * This is the boundary between "answers the user gave" and "things the system
 * reasons about". Everything downstream — the rules engine, the analysis
 * screen, and eventually the backend — reads this shape and never the raw
 * answer map.
 *
 * Fields are optional because a profile can be built from a partially
 * completed onboarding; `isProfileComplete` is the gate.
 */

export type Gender = 'male' | 'female';
export type PrimaryGoal =
  | 'build_muscle'
  | 'lose_fat'
  | 'get_stronger'
  | 'improve_fitness'
  | 'build_stamina';
export type FitnessLevel = 'beginner' | 'some' | 'intermediate' | 'advanced';
export type TrainingLocation = 'gym' | 'home' | 'outdoors' | 'mixed';
export type Equipment = 'full_gym' | 'dumbbells' | 'basic' | 'none' | 'mixed';
export type SessionDuration = 'short' | 'medium' | 'long' | 'extended' | 'varies';
export type WorkoutPreference = 'strength' | 'muscle' | 'cardio' | 'hiit' | 'mobility' | 'mixed';
export type Motivation =
  | 'look'
  | 'strong'
  | 'health'
  | 'confidence'
  | 'consistency'
  | 'performance';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';

export interface UserProfile {
  gender?: Gender;
  age?: number;
  /** CANONICAL. Always centimetres, whatever the user typed. */
  heightCm?: number;
  /** CANONICAL. Always kilograms, whatever the user typed. */
  weightKg?: number;
  /** Derived, never entered. Null when height/weight are unusable. */
  bmi?: BmiResult | null;

  primaryGoal?: PrimaryGoal;
  fitnessLevel?: FitnessLevel;
  trainingLocation?: TrainingLocation;
  equipment: Equipment[];
  sessionDuration?: SessionDuration;
  /** Days per week, as a number. */
  trainingDays?: number;
  workoutPreferences: WorkoutPreference[];
  motivation?: Motivation;
  activityLevel?: ActivityLevel;
}

export type TrainingFocus =
  | 'beginnerFoundation'
  | 'strengthMuscle'
  | 'hypertrophy'
  | 'strength'
  | 'leanConditioning'
  | 'enduranceBase'
  | 'generalFitness'
  | 'mobilityFoundation';

export type Difficulty = 'gentle' | 'beginner' | 'moderate' | 'challenging';

export interface Recommendation {
  focus: TrainingFocus;
  /** Days per week the plan is built around. */
  frequency: number;
  /** Minutes per session. */
  sessionMinutes: number;
  difficulty: Difficulty;
  location: TrainingLocation;
  equipment: Equipment[];
  /** Ids of the rules that fired, in order. Surfaced in dev and useful for
   *  debugging why a user got a given recommendation. */
  appliedRules: string[];
}
