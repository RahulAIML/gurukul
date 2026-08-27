/**
 * English is the SOURCE OF TRUTH for the translation key set.
 *
 * Every other locale is typed as `Record<TranslationKey, string>`, so adding a
 * key here and forgetting it in `hi.ts` is a compile error rather than a
 * missing string discovered in production.
 *
 * Keys are flat and dotted (`onboarding.goal.title`) rather than nested. Flat
 * keys give exact autocomplete and make "is this string translated?" a
 * grep-able question.
 */
export const en = {
  /* ── brand / shell ───────────────────────────────────────────── */
  'brand.name': 'Gurukul',
  'common.continue': 'Continue',
  'common.back': 'Back',
  'common.skip': 'Skip',
  'common.startOver': 'Start over',
  'common.step': 'Step {current} of {total}',
  'common.selectAllThatApply': 'Select all that apply',
  'common.loading': 'Loading…',
  'common.or': 'or',

  /* ── language ────────────────────────────────────────────────── */
  'language.label': 'Language',
  'language.en': 'English',
  'language.hi': 'हिन्दी',

  /* ── landing ─────────────────────────────────────────────────── */
  'landing.eyebrow': 'Personalized Coaching',
  'landing.headline.line1': 'We Track.',
  'landing.headline.line2': 'We Guide.',
  'landing.headline.line3': 'You Transform.',
  'landing.body':
    'Your journey toward a better version of yourself begins here. We are building a personalized experience designed around your goals — it starts with a few questions, and no account is needed.',
  'landing.cta': 'Start Your Journey',
  'landing.reassurance.noCard': 'No card required',
  'landing.reassurance.quick': 'Two-minute setup',
  'landing.reassurance.leave': 'Leave anytime',
  'landing.footer': 'An early build — the full Gurukul experience is in development.',

  /* ── sections ────────────────────────────────────────────────── */
  'section.profile': 'About you',
  'section.goal': 'Your goal',
  'section.experience': 'Your experience',
  'section.environment': 'Where you train',
  'section.equipment': 'What you have',
  'section.time': 'Your time',
  'section.preference': 'How you like to train',
  'section.motivation': 'What success means',
  'section.lifestyle': 'Your day',
  'section.measurements': 'Your measurements',

  /* ── Q1 gender ───────────────────────────────────────────────── */
  'q.gender.title': 'Which best describes you?',
  'q.gender.helper': 'This calibrates how we set training volume and recovery.',
  'q.gender.male': 'Male',
  'q.gender.female': 'Female',

  /* ── Q2 primary goal ─────────────────────────────────────────── */
  'q.goal.title': 'What would you like to achieve?',
  'q.goal.helper': 'Pick the one that matters most. Everything after this is shaped around it.',
  'q.goal.buildMuscle': 'Build Muscle',
  'q.goal.buildMuscle.desc': 'Size and shape, built through structured work',
  'q.goal.loseFat': 'Lose Fat',
  'q.goal.loseFat.desc': 'Leaner and lighter, without extremes',
  'q.goal.getStronger': 'Get Stronger',
  'q.goal.getStronger.desc': 'Raw capability, week after week',
  'q.goal.improveFitness': 'Improve Fitness',
  'q.goal.improveFitness.desc': 'Steady all-round health and energy',
  'q.goal.buildStamina': 'Build Stamina',
  'q.goal.buildStamina.desc': 'Breath, endurance and staying power',

  /* ── Q3 fitness level ────────────────────────────────────────── */
  'q.level.title': 'Where does your training stand today?',
  'q.level.helper': 'Answer honestly — the plan adjusts either way.',
  'q.level.beginner': 'Just starting',
  'q.level.beginner.desc': 'New to training, or returning after a long break',
  'q.level.some': 'Some experience',
  'q.level.some.desc': 'Trained on and off, know the basic movements',
  'q.level.intermediate': 'Intermediate',
  'q.level.intermediate.desc': 'Training steadily for six months or more',
  'q.level.advanced': 'Advanced',
  'q.level.advanced.desc': 'Years of practice, comfortable self-directing',

  /* ── Q4 training location ────────────────────────────────────── */
  'q.location.title': 'Where do you prefer to train?',
  'q.location.helper': 'We build the plan around the room you actually have.',
  'q.location.gym': 'At the Gym',
  'q.location.gym.desc': 'Full facility, full range of equipment',
  'q.location.home': 'At Home',
  'q.location.home.desc': 'Your own space, on your own schedule',
  'q.location.outdoors': 'Outdoors',
  'q.location.outdoors.desc': 'Open air, parks and open ground',
  'q.location.mixed': 'A Mix of Places',
  'q.location.mixed.desc': 'Wherever the day allows',

  /* ── Q5 equipment ────────────────────────────────────────────── */
  'q.equipment.title': 'What equipment can you reach?',
  'q.equipment.helper': 'Select all that apply.',
  'q.equipment.fullGym': 'Full Gym',
  'q.equipment.fullGym.desc': 'Racks, machines, full weight range',
  'q.equipment.dumbbells': 'Dumbbells',
  'q.equipment.dumbbells.desc': 'A pair of adjustable or fixed weights',
  'q.equipment.basic': 'Basic Equipment',
  'q.equipment.basic.desc': 'Kettlebell, mat, bench or similar',
  'q.equipment.none': 'No Equipment',
  'q.equipment.none.desc': 'Bodyweight only — entirely workable',
  'q.equipment.mixed': 'It Varies',
  'q.equipment.mixed.desc': 'Different equipment on different days',

  /* ── Q6 session duration ─────────────────────────────────────── */
  'q.duration.title': 'How long is a realistic session?',
  'q.duration.helper': 'Consistency matters more than length.',
  'q.duration.short': '15–20 minutes',
  'q.duration.short.desc': 'Short, focused sessions',
  'q.duration.medium': '30 minutes',
  'q.duration.medium.desc': 'A steady, sustainable block',
  'q.duration.long': '45 minutes',
  'q.duration.long.desc': 'Room for a full session',
  'q.duration.extended': '60+ minutes',
  'q.duration.extended.desc': 'Unhurried, thorough practice',
  'q.duration.varies': 'It Varies',
  'q.duration.varies.desc': 'Different time on different days',

  /* ── Q7 training days ────────────────────────────────────────── */
  'q.days.title': 'How many days a week can you realistically train?',
  'q.days.helper': 'Choose what you can keep to on an ordinary week, not your best one.',
  'q.days.two': '2 days',
  'q.days.two.desc': 'Enough to make real progress',
  'q.days.three': '3 days',
  'q.days.three.desc': 'The most common sustainable rhythm',
  'q.days.four': '4 days',
  'q.days.four.desc': 'Room to split the work',
  'q.days.five': '5 days',
  'q.days.five.desc': 'A committed weekly structure',
  'q.days.sixPlus': '6+ days',
  'q.days.sixPlus.desc': 'Training is already part of your day',

  /* ── Q8 workout preference ───────────────────────────────────── */
  'q.preference.title': 'What kind of training do you enjoy?',
  'q.preference.helper': 'Select all that appeal. We weight the plan toward what you will actually do.',
  'q.preference.strength': 'Strength',
  'q.preference.strength.desc': 'Heavier work, lower reps',
  'q.preference.muscle': 'Muscle Building',
  'q.preference.muscle.desc': 'Moderate weight, higher volume',
  'q.preference.cardio': 'Cardio',
  'q.preference.cardio.desc': 'Steady running, cycling, rowing',
  'q.preference.hiit': 'HIIT',
  'q.preference.hiit.desc': 'Short bursts with brief recovery',
  'q.preference.mobility': 'Mobility',
  'q.preference.mobility.desc': 'Range of motion, stretching, control',
  'q.preference.mixed': 'A Mix',
  'q.preference.mixed.desc': 'Variety keeps it interesting',

  /* ── Q9 motivation ───────────────────────────────────────────── */
  'q.motivation.title': 'What would make you feel successful?',
  'q.motivation.helper': 'There is no wrong answer here.',
  'q.motivation.look': 'Look better',
  'q.motivation.look.desc': 'Visible change in the mirror',
  'q.motivation.strong': 'Feel stronger',
  'q.motivation.strong.desc': 'Capable in everyday life',
  'q.motivation.health': 'Improve health',
  'q.motivation.health.desc': 'Energy, sleep and long-term wellbeing',
  'q.motivation.confidence': 'Build confidence',
  'q.motivation.confidence.desc': 'How you carry yourself',
  'q.motivation.consistency': 'Become consistent',
  'q.motivation.consistency.desc': 'Showing up is the win',
  'q.motivation.stress': "Manage stress",
  'q.motivation.stress.desc': "Somewhere to put the pressure of the day",
  'q.motivation.calm': "Feel calmer",
  'q.motivation.calm.desc': "A steadier head and better sleep",
  'q.motivation.wellbeingNote': "Training can support how you feel, but it is not a substitute for professional mental health care. If you are struggling, please talk to a clinician.",
  'q.motivation.performance': 'Improve performance',
  'q.motivation.performance.desc': 'Sport or specific ability',

  /* ── Q10 activity level ──────────────────────────────────────── */
  'q.activity.title': 'How active is an ordinary day for you?',
  'q.activity.helper': 'Outside training. This shapes how much recovery we build in.',
  'q.activity.sedentary': 'Mostly seated',
  'q.activity.sedentary.desc': 'Desk work, little walking',
  'q.activity.light': 'Lightly active',
  'q.activity.light.desc': 'Some walking through the day',
  'q.activity.moderate': 'Moderately active',
  'q.activity.moderate.desc': 'On your feet regularly',
  'q.activity.veryActive': 'Very active',
  'q.activity.veryActive.desc': 'Physical work or constant movement',

  /* ── Q11–13 measurements ─────────────────────────────────────── */
  'q.age.title': 'How old are you?',
  'q.age.helper': 'Recovery capacity changes with age — this keeps the plan realistic.',
  'q.height.title': 'How tall are you?',
  'q.height.helper': 'Used with your weight to calculate BMI, and to set movement ranges.',
  'q.weight.title': 'What is your current weight?',
  'q.weight.helper': 'A starting point, not a judgement. It sets your load baseline.',

  'measure.range': 'Between {min} and {max} {unit}',
  'measure.outOfRange': 'Enter a value between {min} and {max} {unit}',
  'measure.heightHint': 'Feet and inches. Switching units keeps your measurement.',
  'validation.inchesRange': 'Inches must be between 0 and {max}',
  'measure.unit': 'Unit',
  'measure.unit.years': 'yrs',
  'measure.unit.cm': 'cm',
  'measure.unit.ftin': 'ft/in',
  'measure.unit.kg': 'kg',
  'measure.unit.lb': 'lb',
  'measure.feet': 'ft',
  'measure.inches': 'in',

  /* ── validation ──────────────────────────────────────────────── */
  'validation.required': 'Please choose an option to continue',
  'validation.chooseAtLeast': 'Choose at least {count} to continue',
  'validation.chooseAtLeastOne': 'Choose at least one option to continue',
  'validation.integerOnly': 'Please enter a whole number',
  'validation.invalidNumber': 'Please enter a number',

  /* ── analysis ────────────────────────────────────────────────── */
  'analysis.preparing.title': 'Understanding your answers…',
  'analysis.preparing.body': 'We are putting together your starting direction.',
  'analysis.eyebrow': 'Your analysis',
  'analysis.title': "Here's what we understand about you",
  'analysis.summary.goal': 'Goal',
  'analysis.summary.level': 'Experience',
  'analysis.summary.location': 'Environment',
  'analysis.summary.equipment': 'Equipment',
  'analysis.summary.time': 'Session length',
  'analysis.summary.days': 'Days per week',
  'analysis.summary.activity': 'Daily activity',
  'analysis.summary.age': 'Age',
  'analysis.summary.height': 'Height',
  'analysis.summary.weight': 'Weight',

  'bmi.title': 'Your BMI',
  'bmi.calculated': 'Your calculated BMI is {value}',
  'bmi.range.label': 'Commonly used healthy range',
  'bmi.range.value': '18.5 – 24.9',
  'bmi.category.under': 'Your result falls below the commonly used healthy-weight BMI range.',
  'bmi.category.healthy': 'Your result falls within the commonly used healthy-weight BMI range.',
  'bmi.category.over': 'Your result falls above the commonly used healthy-weight BMI range.',
  'bmi.category.high': 'Your result falls well above the commonly used healthy-weight BMI range.',
  'bmi.disclaimer':
    'BMI is a general screening measure. It does not account for muscle mass, body composition, frame size or distribution, so it describes populations better than individuals. It is not a diagnosis — talk to a clinician about your own health.',

  'plan.eyebrow': 'Your starting direction',
  'plan.title': '{focus}',
  'plan.rationale':
    'Based on your goal, your experience and the time you have, we have shaped your starting direction around {focusLower}.',
  'plan.focus': 'Focus',
  'plan.frequency': 'Frequency',
  'plan.frequency.value': '{days} days / week',
  'plan.session': 'Session length',
  'plan.session.value': '{minutes} minutes',
  'plan.difficulty': 'Starting difficulty',
  'plan.environment': 'Environment',
  'plan.equipment': 'Equipment',
  'plan.adjusted.frequency':
    'You told us {asked} days. We have set the plan to {given} to leave recovery room at your current stage — you can raise it once the work feels easy.',
  'plan.notMedical':
    'These are training recommendations, not medical advice.',
  'plan.previewNote':
    'This is your starting direction. The session-by-session programme is the next thing we are building — it is not ready yet, and we would rather show you nothing than invent it.',
  'plan.cta': 'Save my plan',
  'plan.ctaHelper': 'Create an account so your answers and plan are kept.',

  /* ── focus labels (recommendation output) ────────────────────── */
  'focus.beginnerFoundation': 'Beginner Foundation',
  'focus.strengthMuscle': 'Strength & Muscle Building',
  'focus.hypertrophy': 'Hypertrophy',
  'focus.strength': 'Strength',
  'focus.leanConditioning': 'Lean Conditioning',
  'focus.enduranceBase': 'Endurance Base',
  'focus.generalFitness': 'General Fitness',
  'focus.mobilityFoundation': 'Mobility & Foundation',

  'difficulty.gentle': 'Gentle',
  'difficulty.beginner': 'Beginner',
  'difficulty.moderate': 'Moderate',
  'difficulty.challenging': 'Challenging',

  /* ── auth ────────────────────────────────────────────────────── */
  'auth.signup.title': 'Create your account',
  'auth.signup.subtitle': 'So your answers and your plan are saved.',
  'auth.login.title': 'Welcome back',
  'auth.login.subtitle': 'Log in to pick up where you left off.',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.confirmPassword': 'Confirm password',
  'auth.createAccount': 'Create Account',
  'auth.logIn': 'Log In',
  'auth.logOut': 'Log out',
  'auth.forgotPassword': 'Forgot password?',
  'auth.haveAccount': 'Already have an account?',
  'auth.noAccount': "Don't have an account?",
  'auth.continueWithGoogle': 'Continue with Google',
  'auth.passwordHint': 'At least 8 characters',
  'auth.error.emailRequired': 'Please enter your email',
  'auth.error.emailInvalid': 'Please enter a valid email address',
  'auth.error.passwordRequired': 'Please enter a password',
  'auth.error.passwordTooShort': 'Password must be at least 8 characters',
  'auth.error.passwordMismatch': 'Passwords do not match',
  'auth.error.emailTaken': 'An account with this email already exists',
  'auth.error.invalidCredentials': 'That email and password combination did not match',
  'auth.error.network': 'We could not reach the server. Check your connection and try again.',
  'auth.error.sessionExpired': 'Your session has expired. Please log in again.',
  'auth.error.unknown': 'Something went wrong on our side. Please try again.',
  'auth.error.notConfigured':
    'Accounts are not available in this build yet — the authentication backend is still being built. Your answers are saved on this device in the meantime.',
  'auth.notConfigured.badge': 'Not yet available',
} as const;

export type TranslationKey = keyof typeof en;
