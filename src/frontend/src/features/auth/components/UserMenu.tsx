import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, type TranslationKey } from '../../../i18n';
import { useMenuDisclosure } from '../../../hooks/useMenuDisclosure';
import { useAuth } from '../AuthProvider';
import type { AuthUser } from '../types';

/**
 * The authenticated half of the header.
 *
 * Reusable by design (brief §4): it reads the user from `useAuth()` and takes
 * no props, so every future surface of the gym app — dashboard, plan, workout
 * player — mounts the same component and gets the same menu. Nothing about it
 * is specific to onboarding or the landing page.
 *
 * `menu`/`menuitem` roles, not `listbox`/`option`: these entries perform
 * actions and navigate. A listbox would tell a screen reader the user is
 * picking a value, which is not what is happening.
 */

interface MenuEntry {
  key: TranslationKey;
  /** Absent for the sign-out entry, which acts instead of navigating. */
  to?: string;
  action?: 'logout';
  danger?: boolean;
}

const ENTRIES: MenuEntry[] = [
  { key: 'account.profile', to: '/account/profile' },
  { key: 'account.plan', to: '/account/plan' },
  { key: 'account.settings', to: '/account/settings' },
  { key: 'auth.logOut', action: 'logout', danger: true },
];

/**
 * A name is optional, so fall back to the local part of the email rather than
 * rendering an empty menu. Never falls back to the full address — a header is
 * a public surface and the domain is nobody else's business.
 */
export function displayName(user: AuthUser): string {
  const trimmed = user.name?.trim();
  if (trimmed) return trimmed;
  return user.email.split('@')[0] || user.email;
}

/** Up to two initials from the display name, for the avatar disc. */
function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const name = user ? displayName(user) : '';

  const select = useMemo(
    () => (index: number) => {
      const entry = ENTRIES[index];
      if (!entry) return;
      if (entry.action === 'logout') {
        // Navigate first so the user never sees a protected screen blank out
        // underneath them as the session clears.
        navigate('/');
        void logOut();
      } else if (entry.to) {
        navigate(entry.to);
      }
    },
    [logOut, navigate],
  );

  const menu = useMenuDisclosure<HTMLDivElement>({
    itemCount: ENTRIES.length,
    onSelect: (i) => {
      select(i);
      menu.close();
    },
  });

  if (!user) return null;

  return (
    <div ref={menu.containerRef} className="relative" data-user-menu="">
      <button
        ref={menu.triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={menu.open}
        onClick={() => menu.setOpen((v) => !v)}
        onKeyDown={menu.onTriggerKeyDown}
        className="flex items-center gap-2 rounded-md border border-white/12 bg-carbon-2 py-1.5 pl-1.5 pr-2 font-body text-[12.5px] font-semibold text-chalk transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon sm:pr-2.5"
      >
        <span
          aria-hidden="true"
          className="grid h-7 w-7 place-items-center rounded-[5px] bg-ember/15 font-body text-[11px] font-bold uppercase text-ember"
        >
          {initials(name)}
        </span>
        {/* The name is the label on wide screens; on narrow ones the disc
            carries it and the text would push the header into two lines. */}
        <span className="hidden max-w-[132px] truncate sm:inline">{name}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
          className={['transition-transform duration-150', menu.open ? 'rotate-180' : ''].join(' ')}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {menu.open && (
        <div
          ref={menu.listRef}
          role="menu"
          aria-label={t('account.menuLabel')}
          onKeyDown={menu.onListKeyDown}
          className="absolute right-0 z-30 mt-2 w-[228px] overflow-hidden rounded-lg border border-white/12 bg-carbon-2 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
        >
          {/* Which account is signed in. The full address goes here, inside a
              menu the user opened, rather than on the always-visible header. */}
          <div className="border-b border-white/[0.08] px-3.5 py-3">
            <p className="truncate font-body text-[13.5px] font-semibold text-chalk">{name}</p>
            <p className="truncate font-body text-[11.5px] font-light text-chalk-mute">
              {user.email}
            </p>
          </div>

          {ENTRIES.map((entry, i) => (
            <button
              key={entry.key}
              type="button"
              role="menuitem"
              data-menu-item=""
              tabIndex={-1}
              onClick={() => {
                select(i);
                menu.close();
              }}
              onMouseEnter={() => menu.setActiveIndex(i)}
              className={[
                'flex w-full items-center gap-2.5 px-3.5 py-3 text-left font-body text-[13.5px] font-medium transition-colors',
                'focus-visible:outline-none',
                i === menu.activeIndex ? 'bg-white/[0.07]' : '',
                entry.danger ? 'text-chalk-dim hover:text-ember' : 'text-chalk',
                // The sign-out entry is set apart so it is not fired by muscle
                // memory aimed at Settings.
                entry.danger ? 'border-t border-white/[0.08]' : '',
              ].join(' ')}
            >
              {t(entry.key)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
