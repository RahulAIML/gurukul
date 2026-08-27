import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation, type TranslationKey } from '../i18n';
import { track } from '../features/analytics';
import { BmiResultCard } from '../features/onboarding/components/BmiResultCard';
import { OnboardingLayout } from '../features/onboarding/components/OnboardingLayout';
import { fitnessQuestions } from '../features/onboarding/data/fitnessQuestions';
import { useFitnessOnboarding } from '../features/onboarding/hooks/useFitnessOnboarding';
import { useReducedMotion } from '../features/onboarding/hooks/useReducedMotion';
import { personalize } from '../features/personalization/engine';
import type { Difficulty, TrainingFocus } from '../features/personalization/types';

const FOCUS_KEY: Record<TrainingFocus, TranslationKey> = {
  beginnerFoundation: 'focus.beginnerFoundation',
  strengthMuscle: 'focus.strengthMuscle',
  hypertrophy: 'focus.hypertrophy',
  strength: 'focus.strength',
  leanConditioning: 'focus.leanConditioning',
  enduranceBase: 'focus.enduranceBase',
  generalFitness: 'focus.generalFitness',
  mobilityFoundation: 'focus.mobilityFoundation',
};

const DIFFICULTY_KEY: Record<Difficulty, TranslationKey> = {
  gentle: 'difficulty.gentle',
  beginner: 'difficulty.beginner',
  moderate: 'difficulty.moderate',
  challenging: 'difficulty.challenging',
};

/** Looks up an option's label key from the schema, so the summary shows the
 *  same wording the user chose rather than a re-derived string. */
function optionLabelKey(questionId: string, optionId: string): TranslationKey | undefined {
  const q = fitnessQuestions.find((x) => x.id === questionId);
  return q?.options?.find((o) => o.id === optionId)?.labelKey;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-3 last:border-0">
      <dt className="font-body text-[13px] text-chalk-mute">{label}</dt>
      <dd className="text-right font-body text-[14px] font-medium text-chalk">{value}</dd>
    </div>
  );
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/[0.08] bg-carbon-3 p-4">
      <p className="font-body text-[10.5px] uppercase tracking-[0.16em] text-chalk-mute">{label}</p>
      <p className="mt-1.5 font-display text-[17px] font-bold text-chalk">{value}</p>
    </div>
  );
}

/**
 * The payoff screen: what we understood, then the direction that follows.
 *
 * Deliberately does NOT invent a session-by-session programme. The workout
 * engine does not exist, and inventing "Bench press 4×12" here would be the
 * single most misleading thing this product could do — it would look like a
 * plan and be a hallucination.
 */
export function Analysis() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const { answers, firstUnansweredId } = useFitnessOnboarding();

  const { profile, validation, recommendation } = useMemo(() => personalize(answers), [answers]);

  const [revealed, setRevealed] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => setRevealed(true), 1900);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  useEffect(() => {
    if (!revealed) return;
    track({
      name: 'recommendation_viewed',
      focus: recommendation.focus,
      frequency: recommendation.frequency,
      difficulty: recommendation.difficulty,
    });
    if (profile.bmi) track({ name: 'bmi_viewed', category: profile.bmi.category });
  }, [revealed, recommendation, profile.bmi]);

  // Someone who deep-links here without finishing gets sent back rather than
  // shown a recommendation built from nothing.
  useEffect(() => {
    if (!validation.ok && firstUnansweredId) {
      navigate(`/gym/onboarding/${firstUnansweredId}`, { replace: true });
    }
  }, [validation.ok, firstUnansweredId, navigate]);

  const focusLabel = t(FOCUS_KEY[recommendation.focus]);

  const summary: { label: string; value: string }[] = [];
  const push = (labelKey: TranslationKey, questionId: string) => {
    const id = answers[questionId]?.[0];
    const key = id ? optionLabelKey(questionId, id) : undefined;
    if (key) summary.push({ label: t(labelKey), value: t(key) });
  };
  push('analysis.summary.goal', 'primary_goal');
  push('analysis.summary.level', 'fitness_level');
  push('analysis.summary.location', 'training_location');
  const equipmentLabels = (answers['equipment'] ?? [])
    .map((id) => optionLabelKey('equipment', id))
    .filter((k): k is TranslationKey => Boolean(k))
    .map((k) => t(k));
  if (equipmentLabels.length) {
    summary.push({ label: t('analysis.summary.equipment'), value: equipmentLabels.join(' · ') });
  }
  push('analysis.summary.time', 'session_duration');
  push('analysis.summary.days', 'training_days');
  push('analysis.summary.activity', 'activity_level');
  if (profile.age !== undefined) {
    summary.push({
      label: t('analysis.summary.age'),
      value: `${profile.age} ${t('measure.unit.years')}`,
    });
  }
  if (profile.heightCm !== undefined) {
    summary.push({
      label: t('analysis.summary.height'),
      value: `${profile.heightCm} ${t('measure.unit.cm')}`,
    });
  }
  if (profile.weightKg !== undefined) {
    summary.push({
      label: t('analysis.summary.weight'),
      value: `${profile.weightKg} ${t('measure.unit.kg')}`,
    });
  }

  if (!revealed) {
    return (
      <OnboardingLayout>
        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-9 h-[92px] w-[92px]">
            <svg viewBox="0 0 92 92" className="h-full w-full" aria-hidden="true">
              <circle cx="46" cy="46" r="42" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="3" />
              <motion.circle
                cx="46"
                cy="46"
                r="42"
                fill="none"
                stroke="#E4262F"
                strokeWidth="3.4"
                strokeLinecap="round"
                strokeDasharray="263.9"
                initial={{ strokeDashoffset: 263.9 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
                transform="rotate(-90 46 46)"
              />
              <circle cx="46" cy="46" r="11" fill="#E4262F" />
            </svg>
          </div>
          <h1 className="display-tight text-[25px] text-chalk sm:text-[29px]" aria-live="polite">
            {t('analysis.preparing.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-[360px] font-body text-[14.5px] font-light text-chalk-dim">
            {t('analysis.preparing.body')}
          </p>
        </section>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout>
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        className="pb-10"
      >
        <p className="mb-2.5 font-body text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ember">
          {t('analysis.eyebrow')}
        </p>
        <h1 className="display-tight text-[27px] text-chalk sm:text-[34px]">{t('analysis.title')}</h1>

        {/* what we understood */}
        <dl className="mt-7 rounded-lg border border-white/10 bg-carbon-2 px-5 py-2 sm:px-6">
          {summary.map((row) => (
            <SummaryRow key={row.label} label={row.label} value={row.value} />
          ))}
        </dl>

        {/* BMI, when both measurements are usable */}
        {profile.bmi && (
          <div className="mt-5">
            <BmiResultCard bmi={profile.bmi} />
          </div>
        )}

        {/* the direction */}
        <div className="mt-10">
          <p className="mb-2.5 font-body text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ember">
            {t('plan.eyebrow')}
          </p>
          <h2 className="display-tight text-[25px] text-chalk sm:text-[31px]">{focusLabel}</h2>
          <p className="mt-3.5 max-w-[560px] font-body text-[14.5px] font-light leading-relaxed text-chalk-dim">
            {t('plan.rationale', { focus: focusLabel, focusLower: focusLabel.toLowerCase() })}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <PlanRow label={t('plan.focus')} value={focusLabel} />
            <PlanRow
              label={t('plan.frequency')}
              value={t('plan.frequency.value', { days: recommendation.frequency })}
            />
            <PlanRow
              label={t('plan.session')}
              value={t('plan.session.value', { minutes: recommendation.sessionMinutes })}
            />
            <PlanRow
              label={t('plan.difficulty')}
              value={t(DIFFICULTY_KEY[recommendation.difficulty])}
            />
            <PlanRow
              label={t('plan.environment')}
              value={
                optionLabelKey('training_location', recommendation.location)
                  ? t(optionLabelKey('training_location', recommendation.location)!)
                  : recommendation.location
              }
            />
            <PlanRow
              label={t('plan.equipment')}
              value={equipmentLabels.join(' · ') || '—'}
            />
          </div>

          {profile.trainingDays !== undefined &&
            recommendation.frequency !== profile.trainingDays && (
              <p className="mt-5 rounded-md border border-ember/25 bg-ember/[0.06] p-4 font-body text-[13px] font-light leading-relaxed text-chalk">
                {t('plan.adjusted.frequency', {
                  asked: profile.trainingDays,
                  given: recommendation.frequency,
                })}
              </p>
            )}

          <p className="mt-5 rounded-md border border-white/[0.08] bg-carbon-2 p-4 font-body text-[12.5px] font-light leading-relaxed text-chalk-mute">
            {t('plan.previewNote')}
          </p>
          <p className="mt-3 font-body text-[12px] text-chalk-mute">{t('plan.notMedical')}</p>

          {import.meta.env.DEV && (
            <details className="mt-5">
              <summary className="cursor-pointer font-body text-[12px] text-chalk-mute">
                Rules applied ({recommendation.appliedRules.length}) — dev only
              </summary>
              <ul className="mt-2 space-y-1">
                {recommendation.appliedRules.map((r) => (
                  <li key={r} className="font-mono text-[11px] text-chalk-dim">
                    {r}
                  </li>
                ))}
              </ul>
            </details>
          )}

          <div className="mt-9">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="w-full rounded-md bg-ember py-4 font-body text-[15px] font-semibold text-white transition-colors hover:bg-ember-lit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon sm:w-auto sm:px-10"
            >
              {t('plan.cta')}
            </button>
            <p className="mt-3 font-body text-[12.5px] text-chalk-mute">{t('plan.ctaHelper')}</p>
          </div>
        </div>
      </motion.div>
    </OnboardingLayout>
  );
}
