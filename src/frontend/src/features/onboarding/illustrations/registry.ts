import type { FunctionComponent, SVGProps } from 'react';

/* people */
import PeopleFemale from '../../../assets/illustrations/onboarding/people/people-female.svg?react';
import PeopleMale from '../../../assets/illustrations/onboarding/people/people-male.svg?react';
import PeopleNeutral from '../../../assets/illustrations/onboarding/people/people-neutral.svg?react';

/* goals */
import GoalBuildMuscle from '../../../assets/illustrations/onboarding/goals/goal-build-muscle.svg?react';
import GoalBuildStamina from '../../../assets/illustrations/onboarding/goals/goal-build-stamina.svg?react';
import GoalGetStronger from '../../../assets/illustrations/onboarding/goals/goal-get-stronger.svg?react';
import GoalImproveFitness from '../../../assets/illustrations/onboarding/goals/goal-improve-fitness.svg?react';
import GoalLoseFat from '../../../assets/illustrations/onboarding/goals/goal-lose-fat.svg?react';
import GoalStartJourney from '../../../assets/illustrations/onboarding/goals/goal-start-journey.svg?react';

/* fitness-level */
import LevelAdvanced from '../../../assets/illustrations/onboarding/fitness-level/level-advanced.svg?react';
import LevelBeginner from '../../../assets/illustrations/onboarding/fitness-level/level-beginner.svg?react';
import LevelExperienced from '../../../assets/illustrations/onboarding/fitness-level/level-experienced.svg?react';
import LevelSome from '../../../assets/illustrations/onboarding/fitness-level/level-some.svg?react';

/* locations */
import LocationGym from '../../../assets/illustrations/onboarding/locations/location-gym.svg?react';
import LocationHome from '../../../assets/illustrations/onboarding/locations/location-home.svg?react';
import LocationMix from '../../../assets/illustrations/onboarding/locations/location-mix.svg?react';
import LocationOutdoor from '../../../assets/illustrations/onboarding/locations/location-outdoor.svg?react';

/* equipment */
import EquipmentBasic from '../../../assets/illustrations/onboarding/equipment/equipment-basic.svg?react';
import EquipmentDumbbells from '../../../assets/illustrations/onboarding/equipment/equipment-dumbbells.svg?react';
import EquipmentFullGym from '../../../assets/illustrations/onboarding/equipment/equipment-full-gym.svg?react';
import EquipmentMix from '../../../assets/illustrations/onboarding/equipment/equipment-mix.svg?react';
import EquipmentNone from '../../../assets/illustrations/onboarding/equipment/equipment-none.svg?react';

/* time */
import Time20Min from '../../../assets/illustrations/onboarding/time/time-20-min.svg?react';
import Time30Min from '../../../assets/illustrations/onboarding/time/time-30-min.svg?react';
import Time45Min from '../../../assets/illustrations/onboarding/time/time-45-min.svg?react';
import Time60Min from '../../../assets/illustrations/onboarding/time/time-60-min.svg?react';
import TimeVaries from '../../../assets/illustrations/onboarding/time/time-varies.svg?react';

/* frequency */
import Frequency2Days from '../../../assets/illustrations/onboarding/frequency/frequency-2-days.svg?react';
import Frequency3Days from '../../../assets/illustrations/onboarding/frequency/frequency-3-days.svg?react';
import Frequency4Days from '../../../assets/illustrations/onboarding/frequency/frequency-4-days.svg?react';
import Frequency5Days from '../../../assets/illustrations/onboarding/frequency/frequency-5-days.svg?react';
import Frequency6Days from '../../../assets/illustrations/onboarding/frequency/frequency-6-days.svg?react';

/* training-style */
import StyleCardio from '../../../assets/illustrations/onboarding/training-style/style-cardio.svg?react';
import StyleHiit from '../../../assets/illustrations/onboarding/training-style/style-hiit.svg?react';
import StyleMixed from '../../../assets/illustrations/onboarding/training-style/style-mixed.svg?react';
import StyleMobility from '../../../assets/illustrations/onboarding/training-style/style-mobility.svg?react';
import StyleMuscle from '../../../assets/illustrations/onboarding/training-style/style-muscle.svg?react';
import StyleStrength from '../../../assets/illustrations/onboarding/training-style/style-strength.svg?react';

/* motivation */
import MotivationCalm from '../../../assets/illustrations/onboarding/motivation/motivation-calm.svg?react';
import MotivationStress from '../../../assets/illustrations/onboarding/motivation/motivation-stress.svg?react';
import MotivationConfidence from '../../../assets/illustrations/onboarding/motivation/motivation-confidence.svg?react';
import MotivationConsistency from '../../../assets/illustrations/onboarding/motivation/motivation-consistency.svg?react';
import MotivationHealth from '../../../assets/illustrations/onboarding/motivation/motivation-health.svg?react';
import MotivationLook from '../../../assets/illustrations/onboarding/motivation/motivation-look.svg?react';
import MotivationPerformance from '../../../assets/illustrations/onboarding/motivation/motivation-performance.svg?react';
import MotivationStrong from '../../../assets/illustrations/onboarding/motivation/motivation-strong.svg?react';

/* lifestyle */
import LifestyleLight from '../../../assets/illustrations/onboarding/lifestyle/lifestyle-light.svg?react';
import LifestyleModerate from '../../../assets/illustrations/onboarding/lifestyle/lifestyle-moderate.svg?react';
import LifestyleSedentary from '../../../assets/illustrations/onboarding/lifestyle/lifestyle-sedentary.svg?react';
import LifestyleVery from '../../../assets/illustrations/onboarding/lifestyle/lifestyle-very.svg?react';

export type IllustrationComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

/**
 * THE ILLUSTRATION SWAP POINT.
 *
 * Keys are `{category-singular}-{slug}`, identical to the filenames, so a key
 * tells you exactly which file to open. Question data references keys only —
 * it never knows a path, a format, or whether an illustration is a person, a
 * place, an object, a duration or an abstract quantity.
 *
 * Adding one: drop the `.svg` into its category folder per
 * `docs/ILLUSTRATION_SYSTEM.md`, then add one import and one line here.
 * Figure-based, duration and frequency assets are generated — see
 * `scripts/generate-illustrations.mjs`. Abstract subjects are hand-authored.
 */
export const ILLUSTRATIONS = {
  /* people */
  'people-female': PeopleFemale,
  'people-male': PeopleMale,
  'people-neutral': PeopleNeutral,

  /* goals */
  'goal-build-muscle': GoalBuildMuscle,
  'goal-build-stamina': GoalBuildStamina,
  'goal-get-stronger': GoalGetStronger,
  'goal-improve-fitness': GoalImproveFitness,
  'goal-lose-fat': GoalLoseFat,
  'goal-start-journey': GoalStartJourney,

  /* fitness-level */
  'level-advanced': LevelAdvanced,
  'level-beginner': LevelBeginner,
  'level-experienced': LevelExperienced,
  'level-some': LevelSome,

  /* locations */
  'location-gym': LocationGym,
  'location-home': LocationHome,
  'location-mix': LocationMix,
  'location-outdoor': LocationOutdoor,

  /* equipment */
  'equipment-basic': EquipmentBasic,
  'equipment-dumbbells': EquipmentDumbbells,
  'equipment-full-gym': EquipmentFullGym,
  'equipment-mix': EquipmentMix,
  'equipment-none': EquipmentNone,

  /* time */
  'time-20-min': Time20Min,
  'time-30-min': Time30Min,
  'time-45-min': Time45Min,
  'time-60-min': Time60Min,
  'time-varies': TimeVaries,

  /* frequency */
  'frequency-2-days': Frequency2Days,
  'frequency-3-days': Frequency3Days,
  'frequency-4-days': Frequency4Days,
  'frequency-5-days': Frequency5Days,
  'frequency-6-days': Frequency6Days,

  /* training-style */
  'style-cardio': StyleCardio,
  'style-hiit': StyleHiit,
  'style-mixed': StyleMixed,
  'style-mobility': StyleMobility,
  'style-muscle': StyleMuscle,
  'style-strength': StyleStrength,

  /* motivation */
  'motivation-calm': MotivationCalm,
  'motivation-confidence': MotivationConfidence,
  'motivation-stress': MotivationStress,
  'motivation-consistency': MotivationConsistency,
  'motivation-health': MotivationHealth,
  'motivation-look': MotivationLook,
  'motivation-performance': MotivationPerformance,
  'motivation-strong': MotivationStrong,

  /* lifestyle */
  'lifestyle-light': LifestyleLight,
  'lifestyle-moderate': LifestyleModerate,
  'lifestyle-sedentary': LifestyleSedentary,
  'lifestyle-very': LifestyleVery,
} satisfies Record<string, IllustrationComponent>;

export type IllustrationKey = keyof typeof ILLUSTRATIONS;

/** Categories the system covers. All ten are now populated. */
export const ILLUSTRATION_CATEGORIES = [
  'people',
  'goals',
  'fitness-level',
  'locations',
  'equipment',
  'time',
  'frequency',
  'training-style',
  'motivation',
  'lifestyle',
] as const;
