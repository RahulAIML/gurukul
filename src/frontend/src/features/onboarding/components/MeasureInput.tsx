import { useEffect, useMemo, useRef, useState } from 'react';
import type { MeasureUnit, Question } from '../types/onboarding.types';

interface Props {
  question: Question;
  /** Stored as [value, unitId] so measure shares one storage shape with the
   *  choice questions. */
  value: string[];
  onChange: (next: string[]) => void;
  onSubmit: () => void;
}

/**
 * A numeric field with an optional unit toggle — age, height, weight.
 *
 * Deliberately not a slider: people know their age and weight as a number and
 * typing it is faster and more precise than dragging, especially on a phone.
 * `inputMode="numeric"` brings up the number pad without the `type="number"`
 * spinner and its scroll-wheel accidents.
 */
export function MeasureInput({ question, value, onChange, onSubmit }: Props) {
  const units = question.measure?.units ?? [];
  const step = question.measure?.step ?? 1;
  const inputRef = useRef<HTMLInputElement>(null);

  const [raw, unitId] = [value[0] ?? '', value[1] ?? units[0]?.id ?? ''];
  const unit: MeasureUnit | undefined = useMemo(
    () => units.find((u) => u.id === unitId) ?? units[0],
    [units, unitId],
  );

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [question.id]);

  const numeric = Number(raw);
  const hasValue = raw.trim() !== '' && Number.isFinite(numeric);
  const inRange = !!unit && hasValue && numeric >= unit.min && numeric <= unit.max;
  const showError = touched && hasValue && !inRange;

  const commit = () => {
    setTouched(true);
    if (inRange) onSubmit();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div
          className={[
            'flex items-stretch overflow-hidden rounded-lg border bg-carbon-3 transition-colors',
            showError ? 'border-ember' : 'border-white/12 focus-within:border-ember',
          ].join(' ')}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={raw}
            step={step}
            aria-label={question.question}
            aria-invalid={showError}
            aria-describedby={`${question.id}-hint`}
            placeholder={unit?.placeholder}
            onChange={(e) => {
              // digits and at most one decimal point
              const cleaned = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
              onChange([cleaned, unitId]);
            }}
            onBlur={() => setTouched(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commit();
              }
            }}
            className="min-w-0 flex-1 bg-transparent px-5 py-5 font-display text-[30px] font-bold text-chalk outline-none placeholder:font-body placeholder:text-[20px] placeholder:font-light placeholder:text-chalk-mute sm:text-[34px]"
          />

          {units.length > 1 && (
            <div
              role="radiogroup"
              aria-label="Unit"
              className="flex shrink-0 items-center gap-1 border-l border-white/10 p-2"
            >
              {units.map((u) => {
                const active = u.id === unitId;
                return (
                  <button
                    key={u.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      // Switching units clears the figure rather than silently
                      // reinterpreting 70 kg as 70 lb.
                      onChange(['', u.id]);
                      setTouched(false);
                      inputRef.current?.focus();
                    }}
                    className={[
                      'min-w-[54px] rounded-md px-3 py-2.5 font-body text-[13px] font-semibold uppercase tracking-wide transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon',
                      active ? 'bg-ember text-white' : 'text-chalk-dim hover:bg-white/5 hover:text-chalk',
                    ].join(' ')}
                  >
                    {u.label}
                  </button>
                );
              })}
            </div>
          )}

          {units.length === 1 && unit && (
            <span className="flex shrink-0 items-center pr-5 font-body text-[15px] text-chalk-dim">
              {unit.label}
            </span>
          )}
        </div>

        <p
          id={`${question.id}-hint`}
          className={[
            'mt-2.5 font-body text-[12.5px]',
            showError ? 'text-ember' : 'text-chalk-mute',
          ].join(' ')}
          aria-live="polite"
        >
          {showError && unit
            ? `Enter a value between ${unit.min} and ${unit.max} ${unit.label}`
            : unit
              ? `Between ${unit.min} and ${unit.max} ${unit.label}`
              : ''}
        </p>
      </div>

      <button
        type="button"
        onClick={commit}
        disabled={!inRange}
        className="w-full rounded-md bg-ember py-4 font-body text-[15px] font-semibold text-white transition-all duration-150 hover:bg-ember-lit disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
      >
        Continue
      </button>
    </div>
  );
}
