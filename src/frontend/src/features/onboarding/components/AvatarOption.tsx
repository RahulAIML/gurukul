import { Avatar } from '../avatars/registry';
import type { QuestionOption, QuestionType } from '../types/onboarding.types';

interface Props {
  option: QuestionOption;
  selected: boolean;
  questionType: QuestionType;
  onSelect: () => void;
  /** Roving tabindex: only the active option is tab-reachable in a radiogroup. */
  tabIndex: number;
  registerRef?: (el: HTMLButtonElement | null) => void;
}

/**
 * One option card: avatar + title + description.
 *
 * Layout is horizontal on mobile (avatar left, text right) so more options fit
 * above the fold, and flips to vertical from `sm` up where there is width for a
 * grid. The entire card is the hit target.
 *
 * Selected state carries three independent signals — ember border, filled arch
 * ground inside the avatar, and an explicit check glyph — so it never depends
 * on colour alone.
 */
export function AvatarOption({
  option,
  selected,
  questionType,
  onSelect,
  tabIndex,
  registerRef,
}: Props) {
  const isMulti = questionType === 'multiple';

  return (
    <button
      ref={registerRef}
      type="button"
      role={isMulti ? 'checkbox' : 'radio'}
      aria-checked={selected}
      tabIndex={tabIndex}
      onClick={onSelect}
      className={[
        'group relative flex w-full items-center gap-4 rounded-sm border p-4 text-left',
        'min-h-[88px] transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon',
        'sm:flex-col sm:items-center sm:gap-3 sm:p-5 sm:text-center',
        selected
          ? 'border-ember bg-ember/[0.10]'
          : 'border-white/10 bg-carbon-3 hover:border-ember/50 hover:bg-carbon-4',
      ].join(' ')}
    >
      {/* selection marker */}
      <span
        aria-hidden="true"
        className={[
          'absolute right-3 top-3 flex items-center justify-center border transition-all duration-150',
          isMulti ? 'h-5 w-5 rounded-[3px]' : 'h-5 w-5 rounded-full',
          selected ? 'border-ember bg-ember' : 'border-white/25 bg-transparent',
        ].join(' ')}
      >
        {selected && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.6">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>

      <span className="shrink-0">
        <Avatar
          avatarKey={option.avatar}
          selected={selected}
          size={76}
          className="sm:h-[96px] sm:w-[96px]"
        />
      </span>

      <span className="min-w-0 flex-1 sm:flex-none">
        <span
          className={[
            'block font-display text-[15px] font-bold uppercase tracking-[0.02em] leading-snug transition-colors duration-150 sm:text-[17px]',
            selected ? 'text-ember' : 'text-chalk',
          ].join(' ')}
        >
          {option.title}
        </span>
        <span className="mt-1 block font-body text-[12.5px] font-light leading-relaxed text-chalk-dim sm:text-[13px]">
          {option.description}
        </span>
      </span>
    </button>
  );
}
