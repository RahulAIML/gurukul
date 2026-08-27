import { useTranslation, type TranslationKey } from '../../../i18n';
import type { BmiResult } from '../../personalization/bmi';

const CATEGORY_KEY: Record<BmiResult['category'], TranslationKey> = {
  under: 'bmi.category.under',
  healthy: 'bmi.category.healthy',
  over: 'bmi.category.over',
  high: 'bmi.category.high',
};

/**
 * BMI presentation.
 *
 * DESIGN CONSTRAINTS, deliberately:
 *
 * - No colour coding by category. Red/amber/green on a body measurement turns
 *   a screening number into a verdict, and the categories are the same neutral
 *   ember for all four.
 * - No word for the category ("overweight", "obese"). The result is described
 *   by its relationship to a published range, not by a label applied to the
 *   person.
 * - The disclaimer is not fine print. BMI ignores muscle mass and body
 *   composition, which matters especially in a fitness product where a trained
 *   user can read "above the range" while being lean.
 * - No diagnosis, and no advice derived from BMI alone.
 */
export function BmiResultCard({ bmi }: { bmi: BmiResult }) {
  const { t } = useTranslation();

  return (
    <section className="rounded-lg border border-white/10 bg-carbon-2 p-6 sm:p-7">
      <p className="mb-4 font-body text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ember">
        {t('bmi.title')}
      </p>

      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <p className="display-tight text-[46px] leading-none text-chalk sm:text-[56px]">
          {bmi.value.toFixed(1)}
        </p>
        <div className="pb-1">
          <p className="font-body text-[11px] uppercase tracking-[0.14em] text-chalk-mute">
            {t('bmi.range.label')}
          </p>
          <p className="font-body text-[15px] font-medium text-chalk-dim">{t('bmi.range.value')}</p>
        </div>
      </div>

      <p className="mt-5 font-body text-[14.5px] leading-relaxed text-chalk">
        {t(CATEGORY_KEY[bmi.category])}
      </p>

      <p className="mt-4 border-t border-white/[0.08] pt-4 font-body text-[12.5px] font-light leading-relaxed text-chalk-mute">
        {t('bmi.disclaimer')}
      </p>
    </section>
  );
}
