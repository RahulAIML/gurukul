import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../../i18n';
import { IllustrationOption } from './IllustrationOption';
import { MeasureInput } from './MeasureInput';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { Question, QuestionSection } from '../types/onboarding.types';
import type { TranslationKey } from '../../../i18n';

interface Props {
  question: Question;
  selectedIds: string[];
  stepIndex: number;
  total: number;
  direction: 1 | -1;
  onSelect: (optionId: string) => void;
  onMeasureChange: (next: string[]) => void;
  onContinue: () => void;
}

const COLUMN_CLASS: Record<2 | 3, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
};

const SECTION_KEY: Record<QuestionSection, TranslationKey> = {
  profile: 'section.profile',
  goal: 'section.goal',
  experience: 'section.experience',
  environment: 'section.environment',
  equipment: 'section.equipment',
  time: 'section.time',
  preference: 'section.preference',
  motivation: 'section.motivation',
  lifestyle: 'section.lifestyle',
  measurements: 'section.measurements',
};

/**
 * Renders any question from the schema. This is the whole engine — adding a
 * question to `fitnessQuestions.ts` needs no change here; adding a new
 * question *type* means one more branch.
 */
export function QuestionCard({
  question,
  selectedIds,
  stepIndex,
  total,
  direction,
  onSelect,
  onMeasureChange,
  onContinue,
}: Props) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isMulti = question.type === 'multiple';
  const isMeasure = question.type === 'measure';
  const options = question.options ?? [];
  const minSelections = question.minSelections ?? 1;
  const canContinue = selectedIds.length >= minSelections;

  // Move focus to the new question so keyboard and screen-reader users are
  // carried forward with the visual transition. MeasureInput focuses its own
  // field, which is the more useful target there.
  useEffect(() => {
    if (!isMeasure) headingRef.current?.focus();
  }, [question.id, isMeasure]);

  /** Arrow-key navigation within the radiogroup, per WAI-ARIA. */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isMulti) return;
      const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();

      const count = options.length;
      const activeIdx = optionRefs.current.findIndex((el) => el === document.activeElement);
      const currentIndex =
        activeIdx >= 0
          ? activeIdx
          : Math.max(0, options.findIndex((o) => selectedIds.includes(o.id)));

      const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
      const nextIndex = (currentIndex + (forward ? 1 : -1) + count) % count;
      optionRefs.current[nextIndex]?.focus();
    },
    [isMulti, options, selectedIds],
  );

  // Roving tabindex: the selected option (or the first) is the single tab stop.
  const activeIndex = Math.max(0, options.findIndex((o) => selectedIds.includes(o.id)));

  const enter = reduced ? { opacity: 0 } : { opacity: 0, y: direction === 1 ? 12 : -12 };
  const exit = reduced ? { opacity: 0 } : { opacity: 0, y: direction === 1 ? -8 : 8 };

  return (
    <motion.section
      key={question.id}
      initial={enter}
      animate={{ opacity: 1, y: 0 }}
      exit={exit}
      transition={{ duration: reduced ? 0.12 : 0.28, ease: [0.22, 0.61, 0.36, 1] }}
      className="flex flex-1 flex-col"
    >
      <p className="sr-only" aria-live="polite">
        {t('common.step', { current: stepIndex + 1, total })}
      </p>

      <header className="mb-7">
        <p className="mb-2.5 font-body text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ember">
          {t(SECTION_KEY[question.section])}
        </p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="display-tight text-[27px] text-chalk outline-none sm:text-[34px]"
        >
          {t(question.titleKey)}
        </h1>
        {question.helperKey && (
          <p className="mt-3.5 font-body text-[14.5px] font-light leading-relaxed text-chalk-dim sm:text-[15.5px]">
            {t(question.helperKey)}
          </p>
        )}
      </header>

      {isMeasure ? (
        <MeasureInput
          question={question}
          value={selectedIds}
          onChange={onMeasureChange}
          onSubmit={onContinue}
        />
      ) : (
        <div
          role={isMulti ? 'group' : 'radiogroup'}
          aria-label={t(question.titleKey)}
          onKeyDown={handleKeyDown}
          className={`grid grid-cols-1 gap-3 ${COLUMN_CLASS[question.columns ?? 2]}`}
        >
          {options.map((option, i) => (
            <IllustrationOption
              key={option.id}
              illustration={option.illustration}
              label={t(option.labelKey)}
              description={option.descriptionKey ? t(option.descriptionKey) : undefined}
              role={isMulti ? 'checkbox' : 'radio'}
              selected={selectedIds.includes(option.id)}
              onSelect={() => onSelect(option.id)}
              tabIndex={isMulti ? 0 : i === activeIndex ? 0 : -1}
              registerRef={(el) => {
                optionRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      )}

      {question.footnoteKey && (
        <p className="mt-5 rounded-md border border-white/[0.08] bg-carbon-2 p-3.5 font-body text-[12px] font-light leading-relaxed text-chalk-mute">
          {t(question.footnoteKey)}
        </p>
      )}

      {/* Multi-select needs an explicit commit; single-choice auto-advances. */}
      {isMulti && (
        <div className="sticky bottom-0 mt-7 -mx-5 border-t border-white/[0.08] bg-carbon/92 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className="w-full rounded-md bg-ember py-4 font-body text-[15px] font-semibold tracking-[0.01em] text-white transition-all duration-150 hover:bg-ember-lit disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
          >
            {t('common.continue')}
          </button>
          {!canContinue && (
            <p className="mt-2.5 text-center font-body text-[12px] text-chalk-dim">
              {minSelections === 1
                ? t('validation.chooseAtLeastOne')
                : t('validation.chooseAtLeast', { count: minSelections })}
            </p>
          )}
        </div>
      )}
    </motion.section>
  );
}
