import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar, ProgressIndicator } from './ProgressIndicator';

interface Props {
  step?: number;
  total?: number;
  onBack?: () => void;
  children: ReactNode;
}

/** The Gurukul mark — arch over a centred lamp. */
export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 2.5 27.5 6.5v9.2c0 6.6-4.6 12.2-11.5 13.8C9.1 27.9 4.5 22.3 4.5 15.7V6.5L16 2.5Z"
        fill="#E4262F"
      />
      <path d="M10.5 18.5 16 12.5l5.5 6" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The onboarding shell: brand, progress, back affordance, and a focused
 * content column that never goes full-bleed on desktop.
 */
export function OnboardingLayout({ step, total, onBack, children }: Props) {
  return (
    <div className="grid-faint flex min-h-[100dvh] flex-col bg-carbon">
      <header className="border-b border-white/[0.07] bg-carbon/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-focus items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
          >
            <BrandMark size={24} />
            <span className="font-display text-[15px] tracking-[0.22em] text-chalk">GURUKUL</span>
          </Link>

          {step !== undefined && total !== undefined && (
            <ProgressIndicator current={step} total={total} />
          )}
        </div>
        {step !== undefined && total !== undefined && (
          <ProgressBar current={step} total={total} />
        )}
      </header>

      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-focus flex-1 flex-col px-5 py-7 sm:px-8 sm:py-10">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-5 -ml-1 inline-flex w-fit items-center gap-2 rounded-sm px-1 py-1 font-body text-[13px] text-chalk-dim transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
