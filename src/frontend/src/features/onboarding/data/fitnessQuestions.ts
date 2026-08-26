import type { Question } from '../types/onboarding.types';

/**
 * The Gym personalization questions.
 *
 * Copy principle: no option is worded so that another looks like the better
 * answer. Question 2 in particular frames "just starting" as a beginning,
 * never as a deficit.
 */
export const fitnessQuestions: Question[] = [
  {
    id: 'gender',
    question: 'Which best describes you?',
    helper: 'This shapes how we calibrate volume and recovery.',
    type: 'single',
    columns: 3,
    options: [
      {
        id: 'male',
        title: 'Male',
        description: '',
        avatar: 'gender-male',
      },
      {
        id: 'female',
        title: 'Female',
        description: '',
        avatar: 'gender-female',
      },
      {
        id: 'unspecified',
        title: 'Prefer not to say',
        description: '',
        avatar: 'gender-unspecified',
      },
    ],
  },
  {
    id: 'goal',
    question: 'What would you like to achieve?',
    helper: 'Your guru shapes every session around this.',
    type: 'single',
    columns: 3,
    options: [
      {
        id: 'build-muscle',
        title: 'Build Muscle',
        description: 'Size and shape, built through structured work',
        avatar: 'goal-build-muscle',
      },
      {
        id: 'lose-fat',
        title: 'Lose Fat',
        description: 'Leaner and lighter, without extremes',
        avatar: 'goal-lose-fat',
      },
      {
        id: 'get-stronger',
        title: 'Get Stronger',
        description: 'Raw capability, week after week',
        avatar: 'goal-get-stronger',
      },
      {
        id: 'improve-fitness',
        title: 'Improve Fitness',
        description: 'Steady all-round health and energy',
        avatar: 'goal-improve-fitness',
      },
      {
        id: 'build-stamina',
        title: 'Build Stamina',
        description: 'Breath, endurance and staying power',
        avatar: 'goal-build-stamina',
      },
      {
        id: 'start-journey',
        title: 'Start My Journey',
        description: 'Beginning from the beginning, guided',
        avatar: 'goal-start-journey',
      },
    ],
  },
  {
    id: 'level',
    question: 'Where does your practice stand today?',
    helper: 'Answer honestly — the path adjusts either way.',
    type: 'single',
    columns: 2,
    options: [
      {
        id: 'beginner',
        title: "I'm just starting",
        description: 'Ready to build a strong foundation',
        avatar: 'level-beginner',
      },
      {
        id: 'some',
        title: "I've trained a little",
        description: 'Some experience, returning or on and off',
        avatar: 'level-some',
      },
      {
        id: 'experienced',
        title: "I'm fairly experienced",
        description: 'Training steadily, the basics are known',
        avatar: 'level-experienced',
      },
      {
        id: 'advanced',
        title: "I'm highly experienced",
        description: 'Years of practice, comfortable self-directing',
        avatar: 'level-advanced',
      },
    ],
  },
  {
    id: 'location',
    question: 'Where do you prefer to train?',
    helper: 'The guru adapts to the room, not the other way round.',
    type: 'single',
    columns: 2,
    options: [
      {
        id: 'gym',
        title: 'At the Gym',
        description: 'Full facility, full range of equipment',
        avatar: 'location-gym',
      },
      {
        id: 'home',
        title: 'At Home',
        description: 'Your own space, on your own schedule',
        avatar: 'location-home',
      },
      {
        id: 'outdoors',
        title: 'Outdoors',
        description: 'Open air, parks and open ground',
        avatar: 'location-outdoors',
      },
      {
        id: 'mix',
        title: 'A Mix of Places',
        description: 'Wherever the day allows',
        avatar: 'location-mix',
      },
    ],
  },
  {
    id: 'equipment',
    question: 'What equipment can you reach?',
    helper: 'Select all that apply.',
    type: 'multiple',
    minSelections: 1,
    columns: 2,
    options: [
      {
        id: 'full-gym',
        title: 'Full Gym',
        description: 'Racks, machines, full weight range',
        avatar: 'equipment-full-gym',
      },
      {
        id: 'basic',
        title: 'Basic Equipment',
        description: 'Bands, mat, bench or similar',
        avatar: 'equipment-basic',
      },
      {
        id: 'dumbbells',
        title: 'Dumbbells',
        description: 'A pair of adjustable or fixed weights',
        avatar: 'equipment-dumbbells',
      },
      {
        id: 'none',
        title: 'No Equipment',
        description: 'Bodyweight only — entirely workable',
        avatar: 'equipment-none',
        exclusive: true,
      },
      {
        id: 'mix',
        title: 'It Varies',
        description: 'Different equipment on different days',
        avatar: 'equipment-mix',
        exclusive: true,
      },
    ],
  },
  {
    id: 'time',
    question: 'How much time can you realistically give?',
    helper: 'Consistency matters more than length.',
    type: 'single',
    columns: 3,
    options: [
      {
        id: 'short',
        title: '15–20 minutes',
        description: 'Short, focused sessions',
        avatar: 'time-short',
      },
      {
        id: 'medium',
        title: '30 minutes',
        description: 'A steady, sustainable block',
        avatar: 'time-medium',
      },
      {
        id: 'long',
        title: '45 minutes',
        description: 'Room for a full session',
        avatar: 'time-long',
      },
      {
        id: 'extended',
        title: '60+ minutes',
        description: 'Unhurried, thorough practice',
        avatar: 'time-extended',
      },
      {
        id: 'varies',
        title: 'It Varies',
        description: 'Different time on different days',
        avatar: 'time-varies',
      },
    ],
  },
  {
    id: 'age',
    question: 'How old are you?',
    helper: 'Recovery needs change with age — this keeps the plan realistic.',
    type: 'measure',
    measure: {
      units: [{ id: 'years', label: 'yrs', min: 14, max: 100, placeholder: '28' }],
    },
  },
  {
    id: 'height',
    question: 'How tall are you?',
    helper: 'Used to set movement ranges and load recommendations.',
    type: 'measure',
    measure: {
      units: [
        { id: 'cm', label: 'cm', min: 120, max: 230, placeholder: '175' },
        { id: 'in', label: 'in', min: 47, max: 91, placeholder: '69' },
      ],
    },
  },
  {
    id: 'weight',
    question: 'What is your current weight?',
    helper: 'A starting point, not a judgement — it sets your load baseline.',
    type: 'measure',
    measure: {
      step: 0.1,
      units: [
        { id: 'kg', label: 'kg', min: 35, max: 250, placeholder: '72' },
        { id: 'lb', label: 'lb', min: 77, max: 550, placeholder: '158' },
      ],
    },
  },
];

/** Terminal step id — not a question, the temporary synthesis screen. */
export const PREPARING_STEP = 'preparing';

export const getQuestionById = (id: string): Question | undefined =>
  fitnessQuestions.find((q) => q.id === id);

export const getQuestionIndex = (id: string): number =>
  fitnessQuestions.findIndex((q) => q.id === id);
