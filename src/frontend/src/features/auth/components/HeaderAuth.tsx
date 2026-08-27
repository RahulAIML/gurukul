import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../../i18n';
import { useAuth } from '../AuthProvider';
import { UserMenu } from './UserMenu';

/**
 * The single header auth control, mounted by every page shell.
 *
 * Three states, and the third one matters:
 *
 *   restoring     → nothing but a reserved-width placeholder
 *   anonymous     → [ Log In ] [ Sign Up ]
 *   authenticated → the account menu
 *
 * The restoring state exists because the session is resolved by an async
 * refresh call. Rendering "Log In" during that window and swapping it for the
 * user's name a moment later tells a returning user they are signed out when
 * they are not, and shifts the header as it corrects itself. A placeholder of
 * the same height holds the space instead.
 *
 * Responsive treatment (brief §1 and §9): at 360px two filled buttons plus the
 * brand and the language selector do not fit, so Log In collapses to a plain
 * text link and only Sign Up keeps its fill. That preserves one obvious
 * primary action on a narrow header instead of two competing ones.
 */
export function HeaderAuth() {
  const { t } = useTranslation();
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'restoring') {
    // Reserves roughly the width of the resolved control so the header does
    // not jump. aria-hidden: there is nothing here worth announcing.
    return <div aria-hidden="true" className="h-[38px] w-[92px] sm:w-[168px]" />;
  }

  if (status === 'authenticated') return <UserMenu />;

  // Where to return after authenticating. Without this, a user who signs up
  // from question 9 is dropped on the analysis screen having lost their place.
  const from = location.pathname + location.search;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        to="/login"
        state={{ from }}
        data-auth-login=""
        className="rounded-md px-2 py-2 font-body text-[12.5px] font-semibold text-chalk-dim transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon sm:border sm:border-white/12 sm:bg-carbon-2 sm:px-3.5 sm:text-chalk sm:hover:border-white/25"
      >
        {t('auth.logIn')}
      </Link>
      <Link
        to="/signup"
        state={{ from }}
        data-auth-signup=""
        className="rounded-md bg-ember px-3 py-2 font-body text-[12.5px] font-semibold text-white transition-colors hover:bg-ember-lit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon sm:px-3.5"
      >
        {t('auth.signUp')}
      </Link>
    </div>
  );
}
