import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from '../../../i18n';
import { getUnit } from '../data/fitnessQuestions';
import type { MeasureUnit, Question } from '../types/onboarding.types';

interface Props {
  question: Question;
  /** Stored as `[canonicalValue, unitId]`. */
  value: string[];
  onChange: (next: string[]) => void;
  onSubmit: () => void;
}

/**
 * Numeric measurement field — age, height, weight.
 *
 * CANONICAL STORAGE. What the user types is a display value in whichever unit
 * they picked; what gets stored is always the canonical value (years, cm, kg)
 * plus the unit id so the field can be redisplayed as they entered it. Nothing
 * downstream ever has to ask "is this pounds or kilos?" — the answer map does
 * not contain pounds.
 *
 * Not a slider: people know their age and weight as a number, and typing one
 * is faster and more precise than dragging, especially on a phone.
 * `inputMode="numeric"` raises the number pad without the `type="number"`
 * spinner and its scroll-wheel accidents.
 */
export function MeasureInput({ question, value, onChange, onSubmit }: Props) {
  const { t } = useTranslation();
  const units = question.measure?.units ?? [];
  const integerOnly = question.measure?.integerOnly ?? false;
  const isComposite = (unitId: string) => question.measure?.compositeUnitId === unitId;

  const storedCanonical = value[0];
  const unitId = value[1] ?? units[0]?.id ?? '';
  const unit: MeasureUnit | undefined = useMemo(() => getUnit(question, unitId), [question, unitId]);

  /**
   * Display state is local, because it must survive partial input ("17" on the
   * way to "175") without a half-typed number being converted and stored.
   */
  const [display, setDisplay] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [touched, setTouched] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Rehydrate display from the stored canonical value whenever the question or
  // unit changes (mount, resume, unit switch, back-navigation).
  useEffect(() => {
    if (!unit) return;
    if (storedCanonical === undefined || storedCanonical === '') {
      setDisplay('');
      setFeet('');
      setInches('');
      return;
    }
    const canonical = Number(storedCanonical);
    if (!Number.isFinite(canonical)) return;
    const inUnit = unit.fromCanonical(canonical);

    if (isComposite(unit.id)) {
      const totalInches = Math.round(inUnit);
      setFeet(String(Math.floor(totalInches / 12)));
      setInches(String(totalInches % 12));
    } else {
      setDisplay(String(integerOnly ? Math.round(inUnit) : Math.round(inUnit * 10) / 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, unitId]);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, [question.id]);

  /** The value in the DISPLAY unit, or null when unusable. */
  const displayValue: number | null = useMemo(() => {
    if (!unit) return null;
    if (isComposite(unit.id)) {
      if (feet.trim() === '' && inches.trim() === '') return null;
      const f = Number(feet || '0');
      const i = Number(inches || '0');
      if (!Number.isFinite(f) || !Number.isFinite(i)) return null;
      if (i >= 12) return null; // 5'14" is a typo, not a height
      return f * 12 + i;
    }
    if (display.trim() === '') return null;
    const n = Number(display);
    if (!Number.isFinite(n)) return null;
    if (integerOnly && !Number.isInteger(n)) return null;
    return n;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, feet, inches, unit, integerOnly]);

  const inRange =
    unit !== undefined &&
    displayValue !== null &&
    displayValue >= unit.min &&
    displayValue <= unit.max;

  const showError = touched && displayValue !== null && !inRange;

  /** Converts to canonical and stores. Never stores a display value. */
  const commitValue = (next: number | null) => {
    if (!unit) return;
    if (next === null) {
      onChange(['', unit.id]);
      return;
    }
    const canonical = unit.toCanonical(next);
    // One decimal is enough for cm and kg; more is false precision.
    onChange([String(Math.round(canonical * 10) / 10), unit.id]);
  };

  // Keep the stored canonical in step with what is displayed.
  useEffect(() => {
    commitValue(displayValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayValue]);

  const submit = () => {
    setTouched(true);
    if (inRange) onSubmit();
  };

  const sanitise = (raw: string) =>
    integerOnly
      ? raw.replace(/[^0-9]/g, '')
      : raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

  const switchUnit = (next: MeasureUnit) => {
    // Clearing rather than converting: silently reinterpreting 70 kg as 70 lb
    // is a data-integrity bug, and converting behind the user's back makes the
    // field feel possessed. An empty field is unambiguous.
    setDisplay('');
    setFeet('');
    setInches('');
    setTouched(false);
    onChange(['', next.id]);
    firstFieldRef.current?.focus();
  };

  const fieldClass =
    'min-w-0 flex-1 bg-transparent px-5 py-5 font-display text-[30px] font-bold text-chalk outline-none placeholder:font-body placeholder:text-[20px] placeholder:font-light placeholder:text-chalk-mute sm:text-[34px]';

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div
          className={[
            'flex items-stretch overflow-hidden rounded-lg border bg-carbon-3 transition-colors',
            showError ? 'border-ember' : 'border-white/12 focus-within:border-ember',
          ].join(' ')}
        >
          {unit && isComposite(unit.id) ? (
            <div className="flex min-w-0 flex-1 items-stretch">
              <input
                ref={firstFieldRef}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={feet}
                aria-label={t('measure.feet')}
                aria-invalid={showError}
                placeholder="5"
                onChange={(e) => setFeet(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={() => setTouched(true)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), submit())}
                className={fieldClass}
              />
              <span className="flex items-center pr-2 font-body text-[14px] text-chalk-dim">
                {t('measure.feet')}
              </span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={inches}
                aria-label={t('measure.inches')}
                aria-invalid={showError}
                placeholder="9"
                onChange={(e) => setInches(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={() => setTouched(true)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), submit())}
                className={fieldClass}
              />
              <span className="flex items-center pr-4 font-body text-[14px] text-chalk-dim">
                {t('measure.inches')}
              </span>
            </div>
          ) : (
            <input
              ref={firstFieldRef}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={display}
              aria-label={t(question.titleKey)}
              aria-invalid={showError}
              aria-describedby={`${question.id}-hint`}
              placeholder={unit?.placeholder}
              onChange={(e) => setDisplay(sanitise(e.target.value))}
              onBlur={() => setTouched(true)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), submit())}
              className={fieldClass}
            />
          )}

          {units.length > 1 && (
            <div
              role="radiogroup"
              aria-label={t('measure.unit')}
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
                    onClick={() => switchUnit(u)}
                    className={[
                      'min-w-[54px] rounded-md px-3 py-2.5 font-body text-[13px] font-semibold uppercase tracking-wide transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon',
                      active ? 'bg-ember text-white' : 'text-chalk-dim hover:bg-white/5 hover:text-chalk',
                    ].join(' ')}
                  >
                    {t(u.labelKey)}
                  </button>
                );
              })}
            </div>
          )}

          {units.length === 1 && unit && (
            <span className="flex shrink-0 items-center pr-5 font-body text-[15px] text-chalk-dim">
              {t(unit.labelKey)}
            </span>
          )}
        </div>

        <p
          id={`${question.id}-hint`}
          aria-live="polite"
          className={[
            'mt-2.5 font-body text-[12.5px]',
            showError ? 'text-ember' : 'text-chalk-mute',
          ].join(' ')}
        >
          {unit
            ? t(showError ? 'measure.outOfRange' : 'measure.range', {
                min: unit.min,
                max: unit.max,
                unit: t(unit.labelKey),
              })
            : ''}
        </p>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!inRange}
        className="w-full rounded-md bg-ember py-4 font-body text-[15px] font-semibold text-white transition-all duration-150 hover:bg-ember-lit disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-carbon"
      >
        {t('common.continue')}
      </button>
    </div>
  );
}
