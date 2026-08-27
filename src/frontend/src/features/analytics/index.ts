/**
 * Analytics event abstraction.
 *
 * No third-party service is wired (none is configured), so the default sink is
 * a no-op that logs in development. The point of shipping this now is that
 * call sites are correct from the start: when PostHog or similar lands it is
 * one `setAnalyticsSink` call, not a hunt through every component.
 *
 * PRIVACY: events carry ANSWER IDS, never free text, and never height, weight,
 * age or email. Those are personal data with no analytics value at this stage,
 * and keeping them out by construction is easier than scrubbing them later.
 */

export type AnalyticsEvent =
  | { name: 'onboarding_started'; locale: string }
  | { name: 'question_viewed'; questionId: string; section: string; index: number }
  | { name: 'question_answered'; questionId: string; section: string; valueIds: string[] }
  | { name: 'question_back'; questionId: string; fromIndex: number }
  | { name: 'onboarding_completed'; questionCount: number }
  | { name: 'language_changed'; from: string; to: string }
  | { name: 'recommendation_viewed'; focus: string; frequency: number; difficulty: string }
  | { name: 'bmi_viewed'; category: string }
  | { name: 'signup_started' }
  | { name: 'signup_completed' }
  | { name: 'login_completed' }
  | { name: 'auth_unavailable_shown' }
  // Worth counting separately from a real sign-up: a preview entry is a
  // demo, and mixing the two would inflate the conversion figures.
  | { name: 'preview_entered' };

export interface AnalyticsSink {
  track(event: AnalyticsEvent): void;
}

/** Development sink: visible, and obviously not a real integration. */
const consoleSink: AnalyticsSink = {
  track(event) {
    if (import.meta.env.DEV) {
      const { name, ...rest } = event;
      console.info(`[analytics] ${name}`, rest);
    }
  },
};

let sink: AnalyticsSink = consoleSink;

export function setAnalyticsSink(next: AnalyticsSink) {
  sink = next;
}

export function track(event: AnalyticsEvent) {
  try {
    sink.track(event);
  } catch {
    // Analytics must never break the product.
  }
}
