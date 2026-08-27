import { calculateBmi } from '../domain/bmi.js';
import {
  ANSWER_VALIDATORS,
  isKnownQuestion,
  type AnswerType,
  type Section,
} from '../domain/questionSchema.js';
import { FitnessProfile } from '../models/FitnessProfile.js';
import { OnboardingResponse } from '../models/OnboardingResponse.js';
import { AppError } from '../utils/AppError.js';

export interface IncomingResponse {
  questionId: string;
  section: Section;
  type: AnswerType;
  value: string[];
  canonicalUnit?: string | null;
}

export interface SyncResult {
  accepted: string[];
  /** questionId → why it was rejected. Field names and reasons only. */
  rejected: Record<string, string>;
  profile: Record<string, unknown>;
}

/**
 * Accepts a batch of onboarding answers from a client and derives the profile.
 *
 * TRUST MODEL: nothing here believes the client. Every questionId must be
 * known, every value must satisfy that question's validator, and BMI is
 * recalculated from the canonical height and weight rather than read from the
 * payload. A rejected answer is reported back rather than silently dropped, so
 * a client bug surfaces instead of quietly losing data.
 */
export async function syncOnboarding(
  userId: string,
  responses: IncomingResponse[],
  locale = 'en',
): Promise<SyncResult> {
  const accepted: string[] = [];
  const rejected: Record<string, string> = {};
  const clean: IncomingResponse[] = [];

  for (const response of responses) {
    if (!isKnownQuestion(response.questionId)) {
      rejected[response.questionId] = 'unknown question';
      continue;
    }
    const parsed = ANSWER_VALIDATORS[response.questionId].safeParse(response.value);
    if (!parsed.success) {
      rejected[response.questionId] = parsed.error.issues[0]?.message ?? 'invalid value';
      continue;
    }
    clean.push(response);
    accepted.push(response.questionId);
  }

  if (clean.length > 0) {
    await OnboardingResponse.bulkWrite(
      clean.map((r) => ({
        updateOne: {
          filter: { userId, questionId: r.questionId },
          update: {
            $set: {
              section: r.section,
              type: r.type,
              value: r.value,
              canonicalUnit: r.canonicalUnit ?? null,
              answeredAt: new Date(),
            },
          },
          upsert: true,
        },
      })),
    );
  }

  const profile = await deriveProfile(userId, locale);
  return { accepted, rejected, profile };
}

const first = (map: Map<string, string[]>, id: string): string | null => map.get(id)?.[0] ?? null;

const num = (map: Map<string, string[]>, id: string): number | null => {
  const raw = first(map, id);
  if (raw === null || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

/**
 * Rebuilds `FitnessProfile` from the stored responses.
 *
 * Deriving from the log rather than from the request means the profile is
 * always consistent with what was actually accepted — a partially-rejected
 * batch cannot leave a profile half-updated from values that failed validation.
 */
export async function deriveProfile(userId: string, locale = 'en') {
  const rows = await OnboardingResponse.find({ userId }).lean();
  const map = new Map<string, string[]>(rows.map((r) => [r.questionId, r.value]));

  const heightCm = num(map, 'height');
  const weightKg = num(map, 'weight');

  // Authoritative BMI. The client's figure never reaches this.
  const bmi = heightCm !== null && weightKg !== null ? calculateBmi(heightCm, weightKg) : null;

  const days = first(map, 'training_days');

  const update = {
    gender: first(map, 'gender'),
    age: num(map, 'age'),
    heightCm,
    weightKg,
    bmi: { value: bmi?.value ?? null, category: bmi?.category ?? null },
    primaryGoal: first(map, 'primary_goal'),
    fitnessLevel: first(map, 'fitness_level'),
    trainingLocation: first(map, 'training_location'),
    equipment: map.get('equipment') ?? [],
    sessionDuration: first(map, 'session_duration'),
    trainingDays: days !== null ? Number.parseInt(days, 10) : null,
    workoutPreferences: map.get('workout_preference') ?? [],
    motivation: first(map, 'motivation'),
    activityLevel: first(map, 'activity_level'),
    locale,
  };

  const doc = await FitnessProfile.findOneAndUpdate(
    { userId },
    { $set: update },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();

  if (!doc) throw new AppError('INTERNAL', 'profile upsert returned nothing');
  const { __v, ...rest } = doc as Record<string, unknown>;
  void __v;
  return rest;
}

export async function getProfile(userId: string) {
  const doc = await FitnessProfile.findOne({ userId }).lean();
  if (!doc) return null;
  const { __v, ...rest } = doc as Record<string, unknown>;
  void __v;
  return rest;
}
