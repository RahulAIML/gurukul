import type {
  Difficulty,
  Recommendation,
  TrainingFocus,
  UserProfile,
} from '../types';

/**
 * DETERMINISTIC RULES. No AI, no randomness, no network.
 *
 * A rule is a named predicate plus a partial recommendation. The engine walks
 * them in order and merges what matches, so:
 *
 *   - every recommendation is explainable (`appliedRules` says which fired),
 *   - the same profile always yields the same plan,
 *   - a rule can be unit-tested in isolation, and
 *   - adding a rule never means touching a component.
 *
 * This is deliberately a rules table rather than scattered `if` statements in
 * React. When an LLM layer eventually lands it should *propose* rules or
 * override the output here, not replace the determinism — a user must be able
 * to be told why they got the plan they got.
 */

export interface Rule {
  id: string;
  /** Human-readable reason this rule exists. Not user-facing. */
  because: string;
  when: (p: UserProfile) => boolean;
  then: Partial<Omit<Recommendation, 'appliedRules'>>;
}

/* ── focus: what the training is actually for ─────────────────────── */

export const focusRules: Rule[] = [
  {
    id: 'focus.beginner-any-goal',
    because:
      'A true beginner needs movement competence and a base before goal-specific specialisation. Specialising first is how beginners get hurt and plateau.',
    when: (p) => p.fitnessLevel === 'beginner',
    then: { focus: 'beginnerFoundation', difficulty: 'gentle' },
  },
  {
    id: 'focus.muscle-experienced',
    because: 'Hypertrophy work is appropriate once movement patterns are established.',
    when: (p) =>
      p.primaryGoal === 'build_muscle' &&
      (p.fitnessLevel === 'intermediate' || p.fitnessLevel === 'advanced'),
    then: { focus: 'hypertrophy' },
  },
  {
    id: 'focus.muscle-some',
    because: 'Some experience plus a muscle goal sits between foundation and pure hypertrophy.',
    when: (p) => p.primaryGoal === 'build_muscle' && p.fitnessLevel === 'some',
    then: { focus: 'strengthMuscle' },
  },
  {
    id: 'focus.strength',
    because: 'A strength goal above beginner level means heavier work in lower rep ranges.',
    when: (p) => p.primaryGoal === 'get_stronger' && p.fitnessLevel !== 'beginner',
    then: { focus: 'strength' },
  },
  {
    id: 'focus.fat-loss',
    because:
      'Fat loss is driven mostly by diet, so the training brief is to retain muscle while raising energy expenditure — not to grind conditioning.',
    when: (p) => p.primaryGoal === 'lose_fat' && p.fitnessLevel !== 'beginner',
    then: { focus: 'leanConditioning' },
  },
  {
    id: 'focus.stamina',
    because: 'An endurance goal needs an aerobic base before intensity.',
    when: (p) => p.primaryGoal === 'build_stamina' && p.fitnessLevel !== 'beginner',
    then: { focus: 'enduranceBase' },
  },
  {
    id: 'focus.general-fitness',
    because: 'A general fitness goal is best served by balanced full-body work.',
    when: (p) => p.primaryGoal === 'improve_fitness' && p.fitnessLevel !== 'beginner',
    then: { focus: 'generalFitness' },
  },
  {
    id: 'focus.mobility-led',
    because:
      'When mobility is the only preference selected, leading with it respects what the user will actually do.',
    when: (p) => p.workoutPreferences.length === 1 && p.workoutPreferences[0] === 'mobility',
    then: { focus: 'mobilityFoundation' },
  },
];

/* ── frequency: days per week ─────────────────────────────────────── */

export const frequencyRules: Rule[] = [
  {
    id: 'freq.respect-stated',
    because:
      'The user told us what an ordinary week allows. Recommending more than that is how plans get abandoned in week three.',
    when: (p) => typeof p.trainingDays === 'number',
    then: {},
  },
  {
    id: 'freq.cap-beginner',
    because:
      'A beginner training six days has no recovery headroom. Cap at four and let frequency rise as capacity does.',
    when: (p) => p.fitnessLevel === 'beginner' && (p.trainingDays ?? 0) > 4,
    then: { frequency: 4 },
  },
  {
    id: 'freq.cap-very-active-lifestyle',
    because:
      'Someone already on their feet all day is accumulating fatigue outside the gym. Five sessions on top of physical work is a recipe for burnout.',
    when: (p) => p.activityLevel === 'very_active' && (p.trainingDays ?? 0) > 5,
    then: { frequency: 5 },
  },
  {
    id: 'freq.floor-two',
    because: 'Below two sessions a week there is not enough stimulus to build a plan around.',
    when: (p) => (p.trainingDays ?? 0) < 2,
    then: { frequency: 2 },
  },
];

/* ── session length ───────────────────────────────────────────────── */

const DURATION_MINUTES: Record<string, number> = {
  short: 20,
  medium: 30,
  long: 45,
  extended: 60,
  varies: 30,
};

export const durationRules: Rule[] = [
  {
    id: 'duration.from-stated',
    because: 'Session length is taken from what the user said they have.',
    when: (p) => !!p.sessionDuration,
    then: {},
  },
  {
    id: 'duration.varies-defaults-to-30',
    because:
      'When time varies, planning for the shorter realistic case means the session always finishes. A 30-minute plan can be extended; a 60-minute plan cannot be compressed.',
    when: (p) => p.sessionDuration === 'varies',
    then: { sessionMinutes: 30 },
  },
  {
    id: 'duration.strength-needs-time',
    because:
      'Heavy strength work needs warm-up and inter-set rest. In under 30 minutes the focus shifts rather than the session being rushed.',
    when: (p) =>
      p.primaryGoal === 'get_stronger' && (p.sessionDuration === 'short'),
    then: { focus: 'generalFitness' },
  },
];

/* ── difficulty ───────────────────────────────────────────────────── */

const LEVEL_DIFFICULTY: Record<string, Difficulty> = {
  beginner: 'gentle',
  some: 'beginner',
  intermediate: 'moderate',
  advanced: 'challenging',
};

export const difficultyRules: Rule[] = [
  {
    id: 'difficulty.from-level',
    because: 'Starting difficulty tracks stated experience.',
    when: (p) => !!p.fitnessLevel,
    then: {},
  },
  {
    id: 'difficulty.soften-for-age-and-inactivity',
    because:
      'Age plus a sedentary day means less recovery headroom, so the entry point is softened by one step. This moderates volume only — no health claim is made from age.',
    when: (p) => (p.age ?? 0) >= 55 && p.activityLevel === 'sedentary',
    then: {},
  },
];

/* ── helpers the engine uses ──────────────────────────────────────── */

export function baseDifficulty(p: UserProfile): Difficulty {
  return LEVEL_DIFFICULTY[p.fitnessLevel ?? 'beginner'] ?? 'gentle';
}

export function softenDifficulty(d: Difficulty): Difficulty {
  const order: Difficulty[] = ['gentle', 'beginner', 'moderate', 'challenging'];
  const i = order.indexOf(d);
  return order[Math.max(0, i - 1)];
}

export function baseSessionMinutes(p: UserProfile): number {
  return DURATION_MINUTES[p.sessionDuration ?? 'medium'] ?? 30;
}

export const DEFAULT_FOCUS: TrainingFocus = 'generalFitness';
