import { useTranslation } from '../../../i18n';

interface Props {
  current: number; // 1-based
  total: number;
}

/**
 * Quiet progress: a worded step count in the header, and a thin full-width bar
 * directly beneath it.
 *
 * The segment rail this replaced worked at five questions and broke at
 * thirteen — thirteen segments need more header width than a 360px screen has
 * after the wordmark and language toggle, and it would break again at the next
 * question added. A single bar is indifferent to question count, which is the
 * property that matters in a growing questionnaire.
 */
export function ProgressIndicator({ current, total }: Props) {
  const { t } = useTranslation();
  return (
    <span className="whitespace-nowrap font-body text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ember sm:text-[11px] sm:tracking-[0.18em]">
      {t('common.step', { current, total })}
    </span>
  );
}

export function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  return (
    <div
      className="h-[2px] w-full bg-white/[0.07]"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={current}
    >
      <div
        className="h-full bg-ember transition-all duration-[240ms] ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
