import type { MeasureUnit, Question } from '../types/onboarding.types';

/**
 * The Gym onboarding questionnaire.
 *
 * THIRTEEN questions. Every one carries a `rationale` explaining what it
 * changes downstream — if a question cannot justify itself there, it should be
 * cut rather than asked. Order follows the funnel principle of asking the
 * cheap, identity-shaping questions first and the personal measurements last,
 * once the user is invested and can see why they are needed.
 *
 * Copy lives in translation keys (`src/i18n/locales/`), never inline.
 */

/* ── measurement units, with canonical conversion ─────────────────── */

const YEARS: MeasureUnit = {
  id: 'years',
  labelKey: 'measure.unit.years',
  min: 14,
  max: 100,
  placeholder: '28',
  toCanonical: (v) => v,
  fromCanonical: (v) => v,
};

const CM: MeasureUnit = {
  id: 'cm',
  labelKey: 'measure.unit.cm',
  min: 120,
  max: 230,
  placeholder: '175',
  toCanonical: (v) => v,
  fromCanonical: (v) => v,
};

/** Height in feet+inches. The composite input supplies TOTAL INCHES here. */
const FT_IN: MeasureUnit = {
  id: 'ftin',
  labelKey: 'measure.unit.ftin',
  min: 47, // 3'11"
  max: 91, // 7'7"
  placeholder: '69',
  toCanonical: (totalInches) => totalInches * 2.54,
  fromCanonical: (cm) => cm / 2.54,
};

const KG: MeasureUnit = {
  id: 'kg',
  labelKey: 'measure.unit.kg',
  min: 35,
  max: 250,
  placeholder: '72',
  toCanonical: (v) => v,
  fromCanonical: (v) => v,
};

const LB: MeasureUnit = {
  id: 'lb',
  labelKey: 'measure.unit.lb',
  min: 77,
  max: 550,
  placeholder: '158',
  toCanonical: (v) => v * 0.45359237,
  fromCanonical: (kg) => kg / 0.45359237,
};

/* ── the questionnaire ────────────────────────────────────────────── */

export const fitnessQuestions: Question[] = [
  /* ─── SECTION A: profile ─── */
  {
    id: 'gender',
    section: 'profile',
    titleKey: 'q.gender.title',
    helperKey: 'q.gender.helper',
    type: 'single',
    columns: 2,
    rationale:
      'Sex-linked differences in lean mass and recovery capacity affect starting training volume and the rate at which load is added. Asked first because it calibrates everything after it.',
    options: [
      { id: 'male', labelKey: 'q.gender.male', illustration: 'people-male' },
      { id: 'female', labelKey: 'q.gender.female', illustration: 'people-female' },
    ],
  },

  /* ─── SECTION B: goal ─── */
  {
    id: 'primary_goal',
    section: 'goal',
    titleKey: 'q.goal.title',
    helperKey: 'q.goal.helper',
    type: 'single',
    columns: 3,
    rationale:
      'The single strongest input to the recommendation. Determines training focus, rep ranges and whether the plan biases toward load, volume or conditioning.',
    options: [
      {
        id: 'build_muscle',
        labelKey: 'q.goal.buildMuscle',
        descriptionKey: 'q.goal.buildMuscle.desc',
        illustration: 'goal-build-muscle',
      },
      {
        id: 'lose_fat',
        labelKey: 'q.goal.loseFat',
        descriptionKey: 'q.goal.loseFat.desc',
        illustration: 'goal-lose-fat',
      },
      {
        id: 'get_stronger',
        labelKey: 'q.goal.getStronger',
        descriptionKey: 'q.goal.getStronger.desc',
        illustration: 'goal-get-stronger',
      },
      {
        id: 'improve_fitness',
        labelKey: 'q.goal.improveFitness',
        descriptionKey: 'q.goal.improveFitness.desc',
        illustration: 'goal-improve-fitness',
      },
      {
        id: 'build_stamina',
        labelKey: 'q.goal.buildStamina',
        descriptionKey: 'q.goal.buildStamina.desc',
        illustration: 'goal-build-stamina',
      },
    ],
  },

  /* ─── SECTION C: experience ─── */
  {
    id: 'fitness_level',
    section: 'experience',
    titleKey: 'q.level.title',
    helperKey: 'q.level.helper',
    type: 'single',
    columns: 2,
    rationale:
      'Sets starting difficulty and progression rate. A beginner and an advanced trainee with the same goal need materially different starting volume, which is the main way plans injure people when it is guessed.',
    options: [
      {
        id: 'beginner',
        labelKey: 'q.level.beginner',
        descriptionKey: 'q.level.beginner.desc',
        illustration: 'level-beginner',
      },
      {
        id: 'some',
        labelKey: 'q.level.some',
        descriptionKey: 'q.level.some.desc',
        illustration: 'level-some',
      },
      {
        id: 'intermediate',
        labelKey: 'q.level.intermediate',
        descriptionKey: 'q.level.intermediate.desc',
        illustration: 'level-experienced',
      },
      {
        id: 'advanced',
        labelKey: 'q.level.advanced',
        descriptionKey: 'q.level.advanced.desc',
        illustration: 'level-advanced',
      },
    ],
  },

  /* ─── SECTION D: environment ─── */
  {
    id: 'training_location',
    section: 'environment',
    titleKey: 'q.location.title',
    helperKey: 'q.location.helper',
    type: 'single',
    columns: 2,
    rationale:
      'Constrains which movements are possible at all. A plan built around a squat rack is useless to someone training in a bedroom.',
    options: [
      {
        id: 'gym',
        labelKey: 'q.location.gym',
        descriptionKey: 'q.location.gym.desc',
        illustration: 'location-gym',
      },
      {
        id: 'home',
        labelKey: 'q.location.home',
        descriptionKey: 'q.location.home.desc',
        illustration: 'location-home',
      },
      {
        id: 'outdoors',
        labelKey: 'q.location.outdoors',
        descriptionKey: 'q.location.outdoors.desc',
        illustration: 'location-outdoor',
      },
      {
        id: 'mixed',
        labelKey: 'q.location.mixed',
        descriptionKey: 'q.location.mixed.desc',
        illustration: 'location-mix',
      },
    ],
  },

  /* ─── SECTION E: equipment ─── */
  {
    id: 'equipment',
    section: 'equipment',
    titleKey: 'q.equipment.title',
    helperKey: 'q.equipment.helper',
    type: 'multiple',
    minSelections: 1,
    columns: 2,
    rationale:
      'Narrows the exercise pool within the chosen location. Multi-select because "dumbbells and a mat" is a real and common answer that a single choice would force the user to misreport.',
    options: [
      {
        id: 'full_gym',
        labelKey: 'q.equipment.fullGym',
        descriptionKey: 'q.equipment.fullGym.desc',
        illustration: 'equipment-full-gym',
      },
      {
        id: 'dumbbells',
        labelKey: 'q.equipment.dumbbells',
        descriptionKey: 'q.equipment.dumbbells.desc',
        illustration: 'equipment-dumbbells',
      },
      {
        id: 'basic',
        labelKey: 'q.equipment.basic',
        descriptionKey: 'q.equipment.basic.desc',
        illustration: 'equipment-basic',
      },
      {
        id: 'none',
        labelKey: 'q.equipment.none',
        descriptionKey: 'q.equipment.none.desc',
        illustration: 'equipment-none',
        exclusive: true,
      },
      {
        id: 'mixed',
        labelKey: 'q.equipment.mixed',
        descriptionKey: 'q.equipment.mixed.desc',
        illustration: 'equipment-mix',
        exclusive: true,
      },
    ],
  },

  /* ─── SECTION F: session length ─── */
  {
    id: 'session_duration',
    section: 'time',
    titleKey: 'q.duration.title',
    helperKey: 'q.duration.helper',
    type: 'single',
    columns: 3,
    rationale:
      'Caps how much work fits in a session, which decides exercise count and set totals. Combined with frequency it gives weekly volume — the number the plan is actually built from.',
    options: [
      {
        id: 'short',
        labelKey: 'q.duration.short',
        descriptionKey: 'q.duration.short.desc',
        illustration: 'time-20-min',
      },
      {
        id: 'medium',
        labelKey: 'q.duration.medium',
        descriptionKey: 'q.duration.medium.desc',
        illustration: 'time-30-min',
      },
      {
        id: 'long',
        labelKey: 'q.duration.long',
        descriptionKey: 'q.duration.long.desc',
        illustration: 'time-45-min',
      },
      {
        id: 'extended',
        labelKey: 'q.duration.extended',
        descriptionKey: 'q.duration.extended.desc',
        illustration: 'time-60-min',
      },
      {
        id: 'varies',
        labelKey: 'q.duration.varies',
        descriptionKey: 'q.duration.varies.desc',
        illustration: 'time-varies',
      },
    ],
  },

  /* ─── SECTION G: frequency ─── */
  {
    id: 'training_days',
    section: 'time',
    titleKey: 'q.days.title',
    helperKey: 'q.days.helper',
    type: 'single',
    columns: 3,
    rationale:
      'Decides the training split — a 2-day week has to be full-body, a 5-day week can be split by movement pattern. Worded around an ordinary week rather than an ideal one, because plans built on optimistic frequency are the ones people abandon.',
    options: [
      { id: '2', labelKey: 'q.days.two', descriptionKey: 'q.days.two.desc', illustration: 'frequency-2-days' },
      { id: '3', labelKey: 'q.days.three', descriptionKey: 'q.days.three.desc', illustration: 'frequency-3-days' },
      { id: '4', labelKey: 'q.days.four', descriptionKey: 'q.days.four.desc', illustration: 'frequency-4-days' },
      { id: '5', labelKey: 'q.days.five', descriptionKey: 'q.days.five.desc', illustration: 'frequency-5-days' },
      { id: '6', labelKey: 'q.days.sixPlus', descriptionKey: 'q.days.sixPlus.desc', illustration: 'frequency-6-days' },
    ],
  },

  /* ─── SECTION H: preference ─── */
  {
    id: 'workout_preference',
    section: 'preference',
    titleKey: 'q.preference.title',
    helperKey: 'q.preference.helper',
    type: 'multiple',
    minSelections: 1,
    columns: 3,
    rationale:
      'Adherence input rather than a physiological one. Two plans can be equally effective on paper; the one built from work the user enjoys is the one they keep doing. Multi-select because enjoyment is rarely singular.',
    options: [
      {
        id: 'strength',
        labelKey: 'q.preference.strength',
        descriptionKey: 'q.preference.strength.desc',
        illustration: 'style-strength',
      },
      {
        id: 'muscle',
        labelKey: 'q.preference.muscle',
        descriptionKey: 'q.preference.muscle.desc',
        illustration: 'style-muscle',
      },
      {
        id: 'cardio',
        labelKey: 'q.preference.cardio',
        descriptionKey: 'q.preference.cardio.desc',
        illustration: 'style-cardio',
      },
      {
        id: 'hiit',
        labelKey: 'q.preference.hiit',
        descriptionKey: 'q.preference.hiit.desc',
        illustration: 'style-hiit',
      },
      {
        id: 'mobility',
        labelKey: 'q.preference.mobility',
        descriptionKey: 'q.preference.mobility.desc',
        illustration: 'style-mobility',
      },
      {
        id: 'mixed',
        labelKey: 'q.preference.mixed',
        descriptionKey: 'q.preference.mixed.desc',
        illustration: 'style-mixed',
        exclusive: true,
      },
    ],
  },

  /* ─── SECTION I: motivation ─── */
  {
    id: 'motivation',
    section: 'motivation',
    titleKey: 'q.motivation.title',
    helperKey: 'q.motivation.helper',
    type: 'single',
    columns: 3,
    rationale:
      'Does not change the physical plan. It changes which progress the product surfaces first — someone chasing consistency should see streaks, someone chasing strength should see load. Kept because the wrong dashboard makes a correct plan feel irrelevant.',
    options: [
      {
        id: 'look',
        labelKey: 'q.motivation.look',
        descriptionKey: 'q.motivation.look.desc',
        illustration: 'motivation-look',
      },
      {
        id: 'strong',
        labelKey: 'q.motivation.strong',
        descriptionKey: 'q.motivation.strong.desc',
        illustration: 'motivation-strong',
      },
      {
        id: 'health',
        labelKey: 'q.motivation.health',
        descriptionKey: 'q.motivation.health.desc',
        illustration: 'motivation-health',
      },
      {
        id: 'confidence',
        labelKey: 'q.motivation.confidence',
        descriptionKey: 'q.motivation.confidence.desc',
        illustration: 'motivation-confidence',
      },
      {
        id: 'consistency',
        labelKey: 'q.motivation.consistency',
        descriptionKey: 'q.motivation.consistency.desc',
        illustration: 'motivation-consistency',
      },
      {
        id: 'performance',
        labelKey: 'q.motivation.performance',
        descriptionKey: 'q.motivation.performance.desc',
        illustration: 'motivation-performance',
      },
    ],
  },

  /* ─── SECTION J: lifestyle ─── */
  {
    id: 'activity_level',
    section: 'lifestyle',
    titleKey: 'q.activity.title',
    helperKey: 'q.activity.helper',
    type: 'single',
    columns: 2,
    rationale:
      'Non-training activity is the difference between a plan that fits a life and one that overloads it. A labourer training 5 days needs different recovery than a desk worker training 5 days. Only ONE lifestyle question is asked — sleep and stress were considered and cut for now, because we cannot yet act on them.',
    options: [
      {
        id: 'sedentary',
        labelKey: 'q.activity.sedentary',
        descriptionKey: 'q.activity.sedentary.desc',
        illustration: 'lifestyle-sedentary',
      },
      {
        id: 'light',
        labelKey: 'q.activity.light',
        descriptionKey: 'q.activity.light.desc',
        illustration: 'lifestyle-light',
      },
      {
        id: 'moderate',
        labelKey: 'q.activity.moderate',
        descriptionKey: 'q.activity.moderate.desc',
        illustration: 'lifestyle-moderate',
      },
      {
        id: 'very_active',
        labelKey: 'q.activity.veryActive',
        descriptionKey: 'q.activity.veryActive.desc',
        illustration: 'lifestyle-very',
      },
    ],
  },

  /* ─── measurements, asked last ─── */
  {
    id: 'age',
    section: 'measurements',
    titleKey: 'q.age.title',
    helperKey: 'q.age.helper',
    type: 'measure',
    rationale:
      'Recovery capacity and sensible rate-of-progression change across decades. Used to moderate volume progression only — no medical claim is made from age alone. Minimum 14 because we should not be programming for children.',
    measure: { units: [YEARS], canonicalUnit: 'years', integerOnly: true },
  },
  {
    id: 'height',
    section: 'measurements',
    titleKey: 'q.height.title',
    helperKey: 'q.height.helper',
    type: 'measure',
    rationale:
      'Needed for BMI, and later for setting movement ranges (bar path, step length, box height). Stored in centimetres regardless of the unit entered.',
    measure: {
      units: [CM, FT_IN],
      canonicalUnit: 'cm',
      compositeUnitId: 'ftin',
      integerOnly: false,
    },
  },
  {
    id: 'weight',
    section: 'measurements',
    titleKey: 'q.weight.title',
    helperKey: 'q.weight.helper',
    type: 'measure',
    rationale:
      'Needed for BMI and as the baseline for load recommendations expressed relative to bodyweight. Stored in kilograms regardless of the unit entered.',
    measure: { units: [KG, LB], canonicalUnit: 'kg', step: 0.1 },
  },
];

/** Terminal steps — not questions. */
export const ANALYSIS_STEP = 'analysis';

export const getQuestionById = (id: string): Question | undefined =>
  fitnessQuestions.find((q) => q.id === id);

export const getQuestionIndex = (id: string): number =>
  fitnessQuestions.findIndex((q) => q.id === id);

export const getUnit = (question: Question, unitId: string | undefined): MeasureUnit | undefined => {
  const units = question.measure?.units ?? [];
  return units.find((u) => u.id === unitId) ?? units[0];
};

/**
 * The unit a stored value is expressed in, regardless of what the user typed.
 *
 * Needed because a stored value must be range-checked against the CANONICAL
 * range, not the entered unit's range. Checking 180.3 (cm) against the ft/in
 * range of 47..91 rejects a perfectly valid height — which it did, and which
 * silently bounced the user back a step.
 */
export const getCanonicalUnit = (question: Question): MeasureUnit | undefined => {
  const cfg = question.measure;
  if (!cfg) return undefined;
  return cfg.units.find((u) => u.id === cfg.canonicalUnit) ?? cfg.units[0];
};
