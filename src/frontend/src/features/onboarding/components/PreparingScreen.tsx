import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * TEMPORARY (plan §25). Not the real recommendation engine — a synthesis beat
 * that makes the answers feel received, then hands off to "coming next".
 * Replace this component's terminus when the personalization engine lands.
 */
export function PreparingScreen({ onRestart }: { onRestart: () => void }) {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => setRevealed(true), 2400);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  return (
    <section className="flex flex-1 flex-col items-center justify-center py-12 text-center">
      {/* ember ring sweep */}
      <div className="relative mb-9 h-[104px] w-[104px]">
        <svg viewBox="0 0 104 104" className="h-full w-full" aria-hidden="true">
          <circle cx="52" cy="52" r="48" fill="none" stroke="#fff" strokeOpacity="0.12" strokeWidth="3" />
          {!revealed ? (
            <motion.circle
              cx="52"
              cy="52"
              r="48"
              fill="none"
              stroke="#E4262F"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeDasharray="301.6"
              initial={{ strokeDashoffset: 301.6 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2.3, ease: 'easeInOut' }}
              transform="rotate(-90 52 52)"
            />
          ) : (
            <circle
              cx="52"
              cy="52"
              r="48"
              fill="none"
              stroke="#E4262F"
              strokeWidth="3.4"
              opacity="0.9"
            />
          )}
          {/* lamp at centre */}
          <circle cx="52" cy="52" r="13" fill="#E4262F" />
        </svg>
      </div>

      {!revealed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          aria-live="polite"
        >
          <h1 className="display-tight text-[26px] text-chalk sm:text-[30px]">
            Understanding your goals…
          </h1>
          <p className="mx-auto mt-4 max-w-[380px] font-body text-[15px] font-light leading-relaxed text-chalk-dim">
            Your answers are helping us prepare your starting journey.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 0.61, 0.36, 1] }}
          aria-live="polite"
        >
          <p className="mb-4 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-ember">
            Your path is being prepared
          </p>
          <h1 className="display-tight text-[27px] text-chalk sm:text-[33px]">
            Your personalized journey
            <br />
            is coming next.
          </h1>
          <p className="mx-auto mt-5 max-w-[400px] font-body text-[14px] font-light leading-relaxed text-chalk-dim">
            We are building the next part of the experience — your recommended programme,
            your schedule, and your guru.
          </p>

          <button
            type="button"
            onClick={onRestart}
            className="mt-9 rounded-sm border border-white/15 px-7 py-3.5 font-body text-[14px] font-medium text-ember transition-colors hover:border-ember hover:bg-ember/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
          >
            Start over
          </button>
        </motion.div>
      )}
    </section>
  );
}
