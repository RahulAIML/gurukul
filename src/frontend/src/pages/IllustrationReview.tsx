import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IllustrationOption } from '../features/onboarding/components/IllustrationOption';
import { BrandMark } from '../features/onboarding/components/OnboardingLayout';
import type { IllustrationKey } from '../features/onboarding/illustrations/registry';

/**
 * DESIGN REVIEW SURFACE — not part of the user-facing funnel.
 *
 * Exists so the illustration language can be judged across categories on one
 * screen before the remaining assets are produced. Each block below is one
 * question type using the SAME `IllustrationOption` component and the SAME
 * five sample illustrations, which is the whole point: if a person, a rack, a
 * dumbbell and a duration ring do not sit together here, they will not sit
 * together in the funnel either.
 */

interface Row {
  question: string;
  helper: string;
  category: string;
  multi?: boolean;
  options: { id: string; illustration: IllustrationKey; label: string; description: string; disabled?: boolean }[];
}

const ROWS: Row[] = [
  {
    question: 'What would you like to achieve?',
    helper: 'Goals — pose plus at most one abstract cue. Never an icon bolted on.',
    category: 'goals',
    options: [
      { id: 'muscle', illustration: 'goal-build-muscle', label: 'Build Muscle', description: 'Broad frame, arms flexed, rising chevrons' },
      { id: 'fat', illustration: 'goal-lose-fat', label: 'Lose Fat', description: 'Fuller midsection in motion' },
      { id: 'strong', illustration: 'goal-get-stronger', label: 'Get Stronger', description: 'Overhead press with a loaded bar' },
      { id: 'fit', illustration: 'goal-improve-fitness', label: 'Improve Fitness', description: 'Balanced frame, vitality pulse' },
      { id: 'stam', illustration: 'goal-build-stamina', label: 'Build Stamina', description: 'Lean runner, speed marks' },
      { id: 'start', illustration: 'goal-start-journey', label: 'Start My Journey', description: 'Average build, rising steps' },
    ],
  },
  {
    question: 'Which best describes you?',
    helper: 'People — frames differ only in shoulder-to-hip ratio. No faces anywhere.',
    category: 'people',
    options: [
      { id: 'm', illustration: 'people-male', label: 'Male', description: 'V-tapered frame' },
      { id: 'f', illustration: 'people-female', label: 'Female', description: 'Hip-dominant frame' },
      { id: 'n', illustration: 'people-neutral', label: 'Prefer not to say', description: 'Between the other two' },
    ],
  },
  {
    question: 'Where does your practice stand today?',
    helper: 'Fitness level — one progression. The beginner is a healthy average frame, never weak.',
    category: 'fitness-level',
    options: [
      { id: 'b', illustration: 'level-beginner', label: 'Just starting', description: 'Healthy average frame' },
      { id: 's', illustration: 'level-some', label: 'Trained a little', description: 'Broader, flatter midsection' },
      { id: 'e', illustration: 'level-experienced', label: 'Fairly experienced', description: 'Definition appears' },
      { id: 'a', illustration: 'level-advanced', label: 'Highly experienced', description: 'Most developed frame' },
    ],
  },
  {
    question: 'Where do you prefer to train?',
    helper: 'Environments — structure stroked in neutral, the training implement filled in accent.',
    category: 'locations',
    options: [
      { id: 'gym', illustration: 'location-gym', label: 'At the Gym', description: 'Rack, bar and bench' },
      { id: 'home', illustration: 'location-home', label: 'At Home', description: 'Room and mat' },
      { id: 'out', illustration: 'location-outdoor', label: 'Outdoors', description: 'Sun, horizon and an outdoor bar' },
      { id: 'mix', illustration: 'location-mix', label: 'A Mix of Places', description: 'Gym, home and open air' },
    ],
  },
  {
    question: 'What equipment can you reach?',
    helper: 'Equipment — multi-select, so the markers are square. Bodyweight is a figure, not an object.',
    category: 'equipment',
    multi: true,
    options: [
      { id: 'full', illustration: 'equipment-full-gym', label: 'Full Gym', description: 'Rack and loaded bar' },
      { id: 'basic', illustration: 'equipment-basic', label: 'Basic Equipment', description: 'Kettlebell and mat' },
      { id: 'db', illustration: 'equipment-dumbbells', label: 'Dumbbells', description: 'A pair, second behind in neutral' },
      { id: 'none', illustration: 'equipment-none', label: 'No Equipment', description: 'Bodyweight — open arms' },
      { id: 'emix', illustration: 'equipment-mix', label: 'It Varies', description: 'A dumbbell and a kettlebell' },
    ],
  },
  {
    question: 'How much time can you give?',
    helper: 'Time — duration as a proportion. One number generates the whole family.',
    category: 'time',
    options: [
      { id: '20', illustration: 'time-20-min', label: '15–20 minutes', description: 'A third of an hour' },
      { id: '30', illustration: 'time-30-min', label: '30 minutes', description: 'Half' },
      { id: '45', illustration: 'time-45-min', label: '45 minutes', description: 'Three quarters' },
      { id: '60', illustration: 'time-60-min', label: '60+ minutes', description: 'A full hour or more' },
      { id: 'var', illustration: 'time-varies', label: 'It Varies', description: 'Dashed — no fixed duration' },
    ],
  },
];

export function IllustrationReview() {
  const [picked, setPicked] = useState<Record<string, string[]>>({
    goals: ['muscle'],
    people: ['n'],
    'fitness-level': ['e'],
    locations: ['gym'],
    equipment: ['db'],
    time: ['30'],
  });

  const toggle = (row: Row, id: string) => {
    setPicked((prev) => {
      const cur = prev[row.category] ?? [];
      if (row.multi) {
        return { ...prev, [row.category]: cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id] };
      }
      return { ...prev, [row.category]: [id] };
    });
  };

  return (
    <div className="grid-faint min-h-[100dvh] overflow-x-clip bg-carbon">
      <header className="border-b border-white/[0.07] bg-carbon/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <BrandMark size={24} />
            <span className="font-display text-[15px] font-extrabold uppercase tracking-[0.22em] text-chalk">
              Gurukul
            </span>
          </Link>
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ember">
            Illustration System — Review
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-12 max-w-[620px]">
          <h1 className="display-tight text-[30px] text-chalk sm:text-[38px]">
            One illustration language
          </h1>
          <p className="mt-4 font-body text-[14.5px] font-light leading-relaxed text-chalk-dim">
            All 27 assets across six populated categories — human figures, goals, fitness level, environments, equipment and durations — every one rendered by the same {String.fromCharCode(60)}IllustrationOption{String.fromCharCode(62)} component. Nothing here is a placeholder.
          </p>
        </div>

        {ROWS.map((row) => (
          <section key={row.category} className="mb-14">
            <div className="mb-5">
              <p className="mb-2 font-body text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ember">
                {row.category}
              </p>
              <h2 className="display-tight text-[21px] text-chalk sm:text-[25px]">{row.question}</h2>
              <p className="mt-2 font-body text-[13px] font-light text-chalk-dim">{row.helper}</p>
            </div>

            <div
              role={row.multi ? 'group' : 'radiogroup'}
              aria-label={row.question}
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {row.options.map((o) => (
                <IllustrationOption
                  key={o.id}
                  illustration={o.illustration}
                  label={o.label}
                  description={o.description}
                  role={row.multi ? 'checkbox' : 'radio'}
                  selected={(picked[row.category] ?? []).includes(o.id)}
                  disabled={o.disabled}
                  onSelect={() => toggle(row, o.id)}
                />
              ))}
            </div>
          </section>
        ))}

        {/* state reference strip */}
        <section className="rounded-lg border border-white/10 bg-carbon-2 p-5 sm:p-7">
          <h2 className="display-tight mb-1.5 text-[19px] text-chalk">The four states</h2>
          <p className="mb-6 font-body text-[13px] font-light text-chalk-dim">
            The same file in every state. Colour is applied by the component, never baked into
            the artwork.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <IllustrationOption illustration="goal-build-muscle" label="Default" description="Muted accent" />
            <IllustrationOption illustration="goal-build-muscle" label="Selected" description="Brighter accent, glow up, white structure" selected />
            <IllustrationOption illustration="goal-build-muscle" label="Disabled" description="Desaturated, non-interactive" disabled />
            <IllustrationOption illustration="goal-build-muscle" label="Multi-select" description="Square marker" role="checkbox" selected />
          </div>
          <p className="mt-5 font-body text-[12.5px] font-light text-chalk-mute">
            Hover and focus are live — hover any card, or press Tab, to see the border and ring
            treatments.
          </p>
        </section>
      </main>
    </div>
  );
}
