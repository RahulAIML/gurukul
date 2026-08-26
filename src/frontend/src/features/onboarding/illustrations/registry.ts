import type { FunctionComponent, SVGProps } from 'react';

import PeopleNeutral from '../../../assets/illustrations/onboarding/people/people-neutral.svg?react';
import GoalBuildMuscle from '../../../assets/illustrations/onboarding/goals/goal-build-muscle.svg?react';
import LocationGym from '../../../assets/illustrations/onboarding/locations/location-gym.svg?react';
import EquipmentDumbbells from '../../../assets/illustrations/onboarding/equipment/equipment-dumbbells.svg?react';
import Time30Min from '../../../assets/illustrations/onboarding/time/time-30-min.svg?react';

export type IllustrationComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

/**
 * THE ILLUSTRATION SWAP POINT.
 *
 * Keys are `{category}-{slug}`, matching the filenames one-to-one, so a key
 * tells you exactly which file to open. Question data references keys only —
 * it never knows a path, a format, or whether an illustration is a person, a
 * place or an object.
 *
 * Adding an illustration is two steps: drop the `.svg` into its category
 * folder following `docs/ILLUSTRATION_SYSTEM.md`, then add one line here.
 */
export const ILLUSTRATIONS = {
  'people-neutral': PeopleNeutral,
  'goal-build-muscle': GoalBuildMuscle,
  'location-gym': LocationGym,
  'equipment-dumbbells': EquipmentDumbbells,
  'time-30-min': Time30Min,
} satisfies Record<string, IllustrationComponent>;

export type IllustrationKey = keyof typeof ILLUSTRATIONS;

/** Categories the system covers. Folders exist for all of them; the later
 *  ones are intentionally empty until their questions are designed. */
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
