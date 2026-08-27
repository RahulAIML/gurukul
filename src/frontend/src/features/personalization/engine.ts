import { calculateBmi } from './bmi';
import {
  DEFAULT_FOCUS,
  baseDifficulty,
  baseSessionMinutes,
  difficultyRules,
  durationRules,
  focusRules,
  frequencyRules,
  softenDifficulty,
  type Rule,
} from './rules';
import type {
  ActivityLevel,
  Equipment,
  FitnessLevel,
  Gender,
  Motivation,
  PrimaryGoal,
  Recommendation,
  SessionDuration,
  TrainingLocation,
  UserProfile,
  WorkoutPreference,
} from './types';
import type { AnswerMap } from '../onboarding/types/onboarding.types';

/**
 * The personalization pipeline:
 *
 *   answers → buildProfile → validate → derive (BMI) → rules → recommendation
 *
 * `buildProfile` is the only place that knows about the answer map's shape.
 * Everything after it works on the typed profile.
 */

/** Narrow a stored answer to a known union member, or undefined. */
function pick<T extends string>(value: string | undefined, allowed: readonly T[]): T | undefined {
  return value !== undefined && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : undefined;
}

const GENDERS = ['male', 'female'] as const;
const GOALS = [
  'build_muscle',
  'lose_fat',
  'get_stronger',
  'improve_fitness',
  'build_stamina',
] as const;
const LEVELS = ['beginner', 'some', 'intermediate', 'advanced'] as const;
const LOCATIONS = ['gym', 'home', 'outdoors', 'mixed'] as const;
const EQUIPMENT = ['full_gym', 'dumbbells', 'basic', 'none', 'mixed'] as const;
const DURATIONS = ['short', 'medium', 'long', 'extended', 'varies'] as const;
const PREFERENCES = ['strength', 'muscle', 'cardio', 'hiit', 'mobility', 'mixed'] as const;
const MOTIVATIONS = ['look', 'strong', 'health', 'confidence', 'consistency', 'performance'] as const;
const ACTIVITY = ['sedentary', 'light', 'moderate', 'very_active'] as const;

/** Parses a measure answer, which is stored as `[canonicalValue, unitId]`. */
function measure(answers: AnswerMap, id: string): number | undefined {
  const raw = answers[id]?.[0];
  if (raw === undefined || raw === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Turns the raw answer map into a typed profile.
 *
 * Every field is narrowed against its union, so an answer map corrupted by a
 * schema change or hand-edited localStorage yields `undefined` rather than a
 * bad value flowing into the rules.
 */
export function buildProfile(answers: AnswerMap): UserProfile {
  const heightCm = measure(answers, 'height');
  const weightKg = measure(answers, 'weight');

  const days = answers['training_days']?.[0];
  const parsedDays = days ? Number.parseInt(days, 10) : undefined;

  return {
    gender: pick<Gender>(answers['gender']?.[0], GENDERS),
    age: measure(answers, 'age'),
    heightCm,
    weightKg,
    bmi:
      heightCm !== undefined && weightKg !== undefined
        ? calculateBmi({ heightCm, weightKg })
        : undefined,

    primaryGoal: pick<PrimaryGoal>(answers['primary_goal']?.[0], GOALS),
    fitnessLevel: pick<FitnessLevel>(answers['fitness_level']?.[0], LEVELS),
    trainingLocation: pick<TrainingLocation>(answers['training_location']?.[0], LOCATIONS),
    equipment: (answers['equipment'] ?? [])
      .map((v) => pick<Equipment>(v, EQUIPMENT))
      .filter((v): v is Equipment => v !== undefined),
    sessionDuration: pick<SessionDuration>(answers['session_duration']?.[0], DURATIONS),
    trainingDays:
      parsedDays !== undefined && Number.isFinite(parsedDays) ? parsedDays : undefined,
    workoutPreferences: (answers['workout_preference'] ?? [])
      .map((v) => pick<WorkoutPreference>(v, PREFERENCES))
      .filter((v): v is WorkoutPreference => v !== undefined),
    motivation: pick<Motivation>(answers['motivation']?.[0], MOTIVATIONS),
    activityLevel: pick<ActivityLevel>(answers['activity_level']?.[0], ACTIVITY),
  };
}

export interface ProfileValidation {
  ok: boolean;
  /** Question ids that are missing or unusable. */
  missing: string[];
}

/**
 * The fields the recommendation genuinely needs. Motivation, BMI and body
 * measurements are deliberately NOT required — the engine can produce a sound
 * training direction without them, and gating on them would mean a user who
 * declines to give a weight gets nothing.
 */
export function validateProfile(p: UserProfile): ProfileValidation {
  const missing: string[] = [];
  if (!p.primaryGoal) missing.push('primary_goal');
  if (!p.fitnessLevel) missing.push('fitness_level');
  if (!p.trainingLocation) missing.push('training_location');
  if (p.equipment.length === 0) missing.push('equipment');
  if (!p.sessionDuration) missing.push('session_duration');
  if (p.trainingDays === undefined) missing.push('training_days');
  return { ok: missing.length === 0, missing };
}

function applyRules(rules: Rule[], profile: UserProfile) {
  const merged: Partial<Recommendation> = {};
  const applied: string[] = [];
  for (const rule of rules) {
    if (!rule.when(profile)) continue;
    applied.push(rule.id);
    Object.assign(merged, rule.then);
  }
  return { merged, applied };
}

/**
 * Produces the recommendation. Pure and total: given a profile it always
 * returns something sensible, because a half-finished onboarding should still
 * be able to render a preview.
 */
export function recommend(profile: UserProfile): Recommendation {
  const appliedRules: string[] = [];

  // 1. focus — later matching rules win, so the table is ordered
  //    general → specific.
  const focusPass = applyRules(focusRules, profile);
  appliedRules.push(...focusPass.applied);
  const focus = focusPass.merged.focus ?? DEFAULT_FOCUS;

  // 2. frequency — start from what the user said, then apply caps.
  const freqPass = applyRules(frequencyRules, profile);
  appliedRules.push(...freqPass.applied);
  const statedDays = profile.trainingDays ?? 3;
  const frequency = freqPass.merged.frequency ?? statedDays;

  // 3. session length
  const durPass = applyRules(durationRules, profile);
  appliedRules.push(...durPass.applied);
  const sessionMinutes = durPass.merged.sessionMinutes ?? baseSessionMinutes(profile);

  // 4. difficulty — from level, softened where a rule says so.
  const diffPass = applyRules(difficultyRules, profile);
  appliedRules.push(...diffPass.applied);
  let difficulty = focusPass.merged.difficulty ?? baseDifficulty(profile);
  if (diffPass.applied.includes('difficulty.soften-for-age-and-inactivity')) {
    difficulty = softenDifficulty(difficulty);
  }

  // A focus rule may also have overridden focus for a duration reason.
  const finalFocus = durPass.merged.focus ?? focus;

  return {
    focus: finalFocus,
    frequency,
    sessionMinutes,
    difficulty,
    location: profile.trainingLocation ?? 'mixed',
    equipment: profile.equipment.length ? profile.equipment : ['none'],
    appliedRules,
  };
}

/** One call from answers to recommendation, for consumers that do not need
 *  the intermediate profile. */
export function personalize(answers: AnswerMap) {
  const profile = buildProfile(answers);
  const validation = validateProfile(profile);
  return { profile, validation, recommendation: recommend(profile) };
}
