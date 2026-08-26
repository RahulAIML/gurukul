import { ILLUSTRATIONS, type IllustrationKey } from '../illustrations/registry';

export interface IllustrationOptionProps {
  illustration: IllustrationKey;
  label: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  /** 'radio' for single-choice, 'checkbox' for multi-select. */
  role?: 'radio' | 'checkbox';
  onSelect?: () => void;
  tabIndex?: number;
  registerRef?: (el: HTMLButtonElement | null) => void;
}

/**
 * One visual answer option.
 *
 * Deliberately agnostic: it does not know or care whether the illustration is
 * a person, a place, a piece of equipment, a duration or a lifestyle. That is
 * what lets one component carry every question type in the onboarding.
 *
 * STATE LIVES HERE, NOT IN THE ARTWORK. The `.svg` files draw with
 * `currentColor` and `var(--ill-neutral)` only; this component sets those two
 * values per state, plus the glow and contact shadow. So a single illustration
 * renders correctly muted, hovered and selected without any baked-in colour —
 * and re-theming the accent is a token change, not an asset rewrite.
 */
export function IllustrationOption({
  illustration,
  label,
  description,
  selected = false,
  disabled = false,
  role = 'radio',
  onSelect,
  tabIndex = 0,
  registerRef,
}: IllustrationOptionProps) {
  const Illustration = ILLUSTRATIONS[illustration];

  return (
    <button
      ref={registerRef}
      type="button"
      role={role}
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      tabIndex={tabIndex}
      onClick={disabled ? undefined : onSelect}
      className={[
        'group relative flex w-full items-center gap-4 rounded-lg border p-3.5 text-left',
        'min-h-[92px] transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon',
        'sm:flex-col sm:items-center sm:gap-3 sm:p-5 sm:text-center',
        disabled
          ? 'cursor-not-allowed border-white/[0.06] bg-carbon-2 opacity-45'
          : selected
            ? 'border-ember bg-ember/[0.09]'
            : 'border-white/10 bg-carbon-3 hover:border-white/25 hover:bg-carbon-4',
      ].join(' ')}
    >
      {/* selection marker */}
      <span
        aria-hidden="true"
        className={[
          'absolute right-3 top-3 flex h-5 w-5 items-center justify-center border transition-all duration-150',
          role === 'checkbox' ? 'rounded-[4px]' : 'rounded-full',
          selected ? 'border-ember bg-ember' : 'border-white/25 bg-transparent',
        ].join(' ')}
      >
        {selected && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.6">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>

      {/* illustration well: glow + contact shadow + artwork */}
      <span className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center sm:h-[104px] sm:w-[104px]">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-200"
          style={{
            background:
              'radial-gradient(circle at 50% 46%, rgba(228,38,47,0.30) 0%, rgba(228,38,47,0.08) 46%, rgba(228,38,47,0) 72%)',
            opacity: selected ? 1 : 0.4,
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[9%] left-1/2 h-[6px] w-[52%] -translate-x-1/2 rounded-[50%] bg-black transition-opacity duration-200"
          style={{ opacity: selected ? 0.5 : 0.34 }}
        />
        <Illustration
          className="relative h-full w-full transition-colors duration-200"
          style={
            {
              // accent (currentColor inside the artwork)
              color: selected ? '#FF4A52' : disabled ? '#5A5A66' : '#C9202A',
              // secondary structure inside the artwork
              '--ill-neutral': selected ? '#FFFFFF' : '#9A9AA8',
            } as React.CSSProperties
          }
        />
      </span>

      <span className="min-w-0 flex-1 sm:flex-none">
        <span
          className={[
            'block font-display text-[15px] font-bold uppercase leading-snug tracking-[0.02em] transition-colors duration-150 sm:text-[16px]',
            selected ? 'text-ember' : 'text-chalk',
          ].join(' ')}
        >
          {label}
        </span>
        {description && (
          <span className="mt-1 block font-body text-[12.5px] font-light leading-relaxed text-chalk-dim sm:text-[13px]">
            {description}
          </span>
        )}
      </span>
    </button>
  );
}
