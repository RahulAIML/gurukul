import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../../i18n';
import { track } from '../../analytics';
import { useAuth } from '../AuthProvider';

/**
 * The way into the signed-in screens while the backend is not yet hosted.
 *
 * It renders only when `previewAvailable` — that is, only when there is no real
 * backend to log into. It is therefore impossible for this to sit alongside a
 * working login, which is what keeps it from becoming an auth bypass.
 *
 * The label says what it is. It does not say "Log in", it is not styled as the
 * primary action on the auth pages, and it is nowhere near the password field.
 */
export function PreviewEntry({ variant = 'inline' }: { variant?: 'inline' | 'quiet' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { previewAvailable, enterPreview } = useAuth();

  if (!previewAvailable) return null;

  const enter = () => {
    track({ name: 'preview_entered' });
    enterPreview();
    navigate('/account/profile');
  };

  if (variant === 'quiet') {
    return (
      <button
        type="button"
        onClick={enter}
        data-preview-entry=""
        className="font-body text-[12.5px] font-medium text-chalk-dim underline decoration-white/25 underline-offset-4 transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
      >
        {t('preview.enter')}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={enter}
      data-preview-entry=""
      className="w-full rounded-md border border-white/20 bg-white/[0.04] py-3.5 font-body text-[14px] font-semibold text-chalk transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
    >
      {t('preview.enter')}
    </button>
  );
}

/**
 * Visible on every screen for as long as a preview session is active.
 *
 * Not dismissible, on purpose. The whole risk of a demo mode is someone —
 * a client, a stakeholder, a future developer — mistaking it for the real
 * product state. A banner they can close is a banner that is closed.
 */
export function PreviewBanner() {
  const { t } = useTranslation();
  const { isPreview, logOut } = useAuth();

  if (!isPreview) return null;

  return (
    <div
      role="status"
      data-preview-banner=""
      className="relative z-40 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-b border-ember/30 bg-ember/[0.12] px-4 py-2 text-center"
    >
      <span className="font-body text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ember">
        {t('preview.badge')}
      </span>
      <span className="font-body text-[12px] font-light text-chalk-dim">
        {t('preview.explain')}
      </span>
      <button
        type="button"
        onClick={() => void logOut()}
        className="font-body text-[12px] font-semibold text-chalk underline decoration-white/30 underline-offset-2 transition-colors hover:text-ember"
      >
        {t('preview.exit')}
      </button>
    </div>
  );
}
