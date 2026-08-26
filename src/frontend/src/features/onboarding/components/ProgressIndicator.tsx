interface Props {
  current: number; // 1-based
  total: number;
}

/**
 * Quiet progress. Present enough to reassure, small enough not to compete with
 * the question.
 *
 * The segment rail only renders from `sm` up: at nine questions it needs more
 * width than a 360px header has left after the wordmark, so on mobile the
 * worded count carries the meaning and `ProgressBar` (rendered full-width just
 * under the header) carries the shape.
 */
export function ProgressIndicator({ current, total }: Props) {
  return (
    <div className="flex shrink-0 items-center gap-3 sm:gap-4">
      <span className="whitespace-nowrap font-body text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ember sm:text-[11px] sm:tracking-[0.18em]">
        Step {current} of {total}
      </span>

      <span className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={[
              'h-[3px] rounded-full transition-all duration-[240ms] ease-out',
              i < current ? 'w-5 bg-ember' : 'w-2.5 bg-white/15',
            ].join(' ')}
          />
        ))}
      </span>
    </div>
  );
}

/** Full-width mobile companion to the rail above. */
export function ProgressBar({ current, total }: Props) {
  return (
    <div className="h-[2px] w-full bg-white/[0.07] sm:hidden" aria-hidden="true">
      <div
        className="h-full bg-ember transition-all duration-[240ms] ease-out"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  );
}
