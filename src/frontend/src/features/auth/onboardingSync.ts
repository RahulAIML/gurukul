import { fitnessQuestions, getCanonicalUnit } from '../onboarding/data/fitnessQuestions';
import { loadAnswers } from '../onboarding/utils/onboardingStorage';
import type { AuthAdapter, OnboardingResponsePayload, OnboardingSyncResult } from './types';

/**
 * Carries anonymously-collected onboarding answers onto a real account.
 *
 * The flow the brief asks for — browse, onboard, calculate BMI, see results,
 * and only then sign up — means answers exist before the account does. They
 * live in localStorage until an account exists to own them.
 *
 * TWO RULES, both about not losing the user's work:
 *
 * 1. The local copy is NEVER cleared here. It is cleared only once the server
 *    has confirmed the answers are stored, and even then the caller decides.
 *    A sync that fails on a flaky connection must not cost the user twelve
 *    questions.
 *
 * 2. Failure is non-fatal. Sign-up succeeded even if the sync did not; the
 *    user is logged in and the answers are still on their device, so the next
 *    successful sync picks them up. Blocking the account on the sync would
 *    turn a recoverable network blip into a dead end.
 *
 * The server re-validates every answer and recalculates BMI from what it
 * stored — nothing derived is trusted from here.
 */

const QUESTION_BY_ID = new Map(fitnessQuestions.map((q) => [q.id, q]));

/**
 * Shapes the stored answer map for the wire, dropping anything that is not a
 * question we know about. An unknown key would be rejected server-side anyway;
 * filtering here keeps the request honest.
 *
 * The question type and canonical unit are read from the schema rather than
 * inferred from the stored value, because the stored value is just strings —
 * ['180.3', 'cm'] and ['dumbbells', 'barbell'] are indistinguishable without
 * it. Sending the unit lets the server confirm it is storing centimetres and
 * not silently treating an inch measurement as one.
 */
export function buildOnboardingPayload(): OnboardingResponsePayload[] {
  const answers = loadAnswers();
  const payload: OnboardingResponsePayload[] = [];

  for (const [questionId, value] of Object.entries(answers)) {
    const question = QUESTION_BY_ID.get(questionId);
    if (!question) continue;
    if (!Array.isArray(value) || value.length === 0) continue;

    payload.push({
      questionId,
      section: question.section,
      type: question.type,
      // Only the canonical value is ever stored, so only the canonical unit is
      // ever reported. The unit the user happened to type in is not part of
      // their profile.
      value: question.type === 'measure' ? [value[0]] : value,
      canonicalUnit: question.type === 'measure' ? getCanonicalUnit(question)?.id ?? null : null,
    });
  }

  return payload;
}

export type SyncOutcome =
  | { status: 'nothing-to-sync' }
  | { status: 'synced'; result: OnboardingSyncResult }
  | { status: 'deferred'; reason: 'not-configured' | 'failed' };

/**
 * Attempts the association. Never throws — the caller is on a success path
 * (just signed up or logged in) and must not be derailed.
 */
export async function syncPendingOnboarding(adapter: AuthAdapter): Promise<SyncOutcome> {
  const responses = buildOnboardingPayload();
  if (responses.length === 0) return { status: 'nothing-to-sync' };

  if (!adapter.isConfigured) {
    // Expected, not an error: there is no backend wired yet. The answers stay
    // on the device and sync the first time one is.
    return { status: 'deferred', reason: 'not-configured' };
  }

  try {
    // I18nProvider keeps documentElement.lang in step with the chosen locale,
    // so reading it here avoids a second copy of the storage key.
    const locale = document.documentElement.lang || 'en';
    const result = await adapter.syncOnboarding(responses, locale);
    return { status: 'synced', result };
  } catch {
    return { status: 'deferred', reason: 'failed' };
  }
}
