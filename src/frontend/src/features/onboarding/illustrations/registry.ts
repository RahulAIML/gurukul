import type { FunctionComponent, SVGProps } from 'react';


/* people */
import PeopleMale from '../../../assets/illustrations/onboarding/people/people-male.svg?react';
import PeopleFemale from '../../../assets/illustrations/onboarding/people/people-female.svg?react';
import PeopleNeutral from '../../../assets/illustrations/onboarding/people/people-neutral.svg?react';

/* goals */
import GoalBuildMuscle from '../../../assets/illustrations/onboarding/goals/goal-build-muscle.svg?react';
import GoalLoseFat from '../../../assets/illustrations/onboarding/goals/goal-lose-fat.svg?react';
import GoalGetStronger from '../../../assets/illustrations/onboarding/goals/goal-get-stronger.svg?react';
import GoalImproveFitness from '../../../assets/illustrations/onboarding/goals/goal-improve-fitness.svg?react';
import GoalBuildStamina from '../../../assets/illustrations/onboarding/goals/goal-build-stamina.svg?react';
import GoalStartJourney from '../../../assets/illustrations/onboarding/goals/goal-start-journey.svg?react';

/* fitness level */
import LevelBeginner from '../../../assets/illustrations/onboarding/fitness-level/level-beginner.svg?react';
import LevelSome from '../../../assets/illustrations/onboarding/fitness-level/level-some.svg?react';
import LevelExperienced from '../../../assets/illustrations/onboarding/fitness-level/level-experienced.svg?react';
import LevelAdvanced from '../../../assets/illustrations/onboarding/fitness-level/level-advanced.svg?react';

/* locations */
import LocationGym from '../../../assets/illustrations/onboarding/locations/location-gym.svg?react';
import LocationHome from '../../../assets/illustrations/onboarding/locations/location-home.svg?react';
import LocationOutdoor from '../../../assets/illustrations/onboarding/locations/location-outdoor.svg?react';
import LocationMix from '../../../assets/illustrations/onboarding/locations/location-mix.svg?react';

/* equipment */
import EquipmentFullGym from '../../../assets/illustrations/onboarding/equipment/equipment-full-gym.svg?react';
import EquipmentBasic from '../../../assets/illustrations/onboarding/equipment/equipment-basic.svg?react';
import EquipmentDumbbells from '../../../assets/illustrations/onboarding/equipment/equipment-dumbbells.svg?react';
import EquipmentNone from '../../../assets/illustrations/onboarding/equipment/equipment-none.svg?react';
import EquipmentMix from '../../../assets/illustrations/onboarding/equipment/equipment-mix.svg?react';

/* time */
import Time20 from '../../../assets/illustrations/onboarding/time/time-20-min.svg?react';
import Time30 from '../../../assets/illustrations/onboarding/time/time-30-min.svg?react';
import Time45 from '../../../assets/illustrations/onboarding/time/time-45-min.svg?react';
import Time60 from '../../../assets/illustrations/onboarding/time/time-60-min.svg?react';
import TimeVaries from '../../../assets/illustrations/onboarding/time/time-varies.svg?react';

export type IllustrationComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

/**
 * THE ILLUSTRATION SWAP POINT.
 *
 * Keys are `{category-singular}-{slug}`, identical to the filenames, so a key
 * tells you exactly which file to open. Question data references keys only —
 * it never knows a path, a format, or whether an illustration is a person, a
 * place, an object or a duration.
 *
 * Adding one: drop the `.svg` into its category folder per
 * `docs/ILLUSTRATION_SYSTEM.md`, then add one import and one line here.
 * Figure-based assets are generated — see `scripts/generate-illustrations.mjs`.
 */
export const ILLUSTRATIONS = {
  'people-male': PeopleMale,
  'people-female': PeopleFemale,
  'people-neutral': PeopleNeutral,

  'goal-build-muscle': GoalBuildMuscle,
  'goal-lose-fat': GoalLoseFat,
  'goal-get-stronger': GoalGetStronger,
  'goal-improve-fitness': GoalImproveFitness,
  'goal-build-stamina': GoalBuildStamina,
  'goal-start-journey': GoalStartJourney,

  'level-beginner': LevelBeginner,
  'level-some': LevelSome,
  'level-experienced': LevelExperienced,
  'level-advanced': LevelAdvanced,

  'location-gym': LocationGym,
  'location-home': LocationHome,
  'location-outdoor': LocationOutdoor,
  'location-mix': LocationMix,

  'equipment-full-gym': EquipmentFullGym,
  'equipment-basic': EquipmentBasic,
  'equipment-dumbbells': EquipmentDumbbells,
  'equipment-none': EquipmentNone,
  'equipment-mix': EquipmentMix,

  'time-20-min': Time20,
  'time-30-min': Time30,
  'time-45-min': Time45,
  'time-60-min': Time60,
  'time-varies': TimeVaries,
} satisfies Record<string, IllustrationComponent>;

export type IllustrationKey = keyof typeof ILLUSTRATIONS;

/** Categories the system covers. Folders exist for all of them; the last three
 *  are intentionally empty until their questions are designed. */
export const ILLUSTRATION_CATEGORIES = [
  'people',
  'goals',
  'fitness-level',
  'locations',
  'equipment',
  'time',
  'training-style',
  'motivation',
  'lifestyle',
] as const;

