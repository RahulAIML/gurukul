import type { AnswerMap, OnboardingSession } from '../types/onboarding.types';

const STORAGE_KEY = 'gurukul.onboarding.fitness.v2';

/**
 * Bumped to v2: measure answers changed from `[rawValue, unitId]` to
 * `[canonicalValue, unitId]`, so a v1 payload would be misread as canonical
 * when it is not. Version-guarding means a stale payload is discarded rather
 * than silently producing a wrong BMI.
 */
const SCHEMA_VERSION = 2;

/**
 * Every access is guarded: localStorage throws in private mode on some
 * browsers, and can be disabled entirely. Onboarding must still work.
 */
export function loadAnswers(): AnswerMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Partial<OnboardingSession>;
    if (
      parsed.version !== SCHEMA_VERSION ||
      typeof parsed.answers !== 'object' ||
      parsed.answers === null
    ) {
      return {};
    }

    const clean: AnswerMap = {};
    for (const [key, value] of Object.entries(parsed.answers)) {
      if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
        clean[key] = value;
      }
    }
    return clean;
  } catch {
    return {};
  }
}

export function saveAnswers(answers: AnswerMap, locale?: string): void {
  try {
    const session: OnboardingSession = {
      version: SCHEMA_VERSION,
      answers,
      updatedAt: new Date().toISOString(),
      locale,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage unavailable — the in-memory session still works for this visit.
  }
}

export function clearAnswers(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do.
  }
}
