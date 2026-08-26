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
    helper: 'Goal illustrations — the body itself carries the meaning.',
    category: 'goals',
    options: [
      { id: 'muscle', illustration: 'goal-build-muscle', label: 'Build Muscle', description: 'Size and shape, built through structured work' },
      { id: 'fat', illustration: 'goal-build-muscle', label: 'Lose Fat', description: 'Placeholder — uses the muscle sample' },
      { id: 'strong', illustration: 'goal-build-muscle', label: 'Get Stronger', description: 'Placeholder — uses the muscle sample' },
    ],
  },
  {
    question: 'Which best describes you?',
    helper: 'Human figures — no faces, so no age, ethnicity or expression is implied.',
    category: 'people',
    options: [
      { id: 'a', illustration: 'people-neutral', label: 'Male', description: 'Placeholder — uses the neutral sample' },
      { id: 'b', illustration: 'people-neutral', label: 'Female', description: 'Placeholder — uses the neutral sample' },
      { id: 'c', illustration: 'people-neutral', label: 'Prefer not to say', description: 'The shipped neutral figure' },
    ],
  },
  {
    question: 'Where do you prefer to train?',
    helper: 'Environments — structure in neutral, the thing you train with in accent.',
    category: 'locations',
    options: [
      { id: 'gym', illustration: 'location-gym', label: 'At the Gym', description: 'Rack, bar and bench' },
      { id: 'home', illustration: 'location-gym', label: 'At Home', description: 'Placeholder — uses the gym sample' },
      { id: 'out', illustration: 'location-gym', label: 'Outdoors', description: 'Placeholder — uses the gym sample' },
    ],
  },
  {
    question: 'What equipment can you reach?',
    helper: 'Objects — multi-select, so the markers are square. One disabled state shown.',
    category: 'equipment',
    multi: true,
    options: [
      { id: 'db', illustration: 'equipment-dumbbells', label: 'Dumbbells', description: 'A pair of adjustable or fixed weights' },
      { id: 'full', illustration: 'location-gym', label: 'Full Gym', description: 'Reuses the gym environment' },
      { id: 'none', illustration: 'people-neutral', label: 'No Equipment', description: 'Disabled, to show the fourth state', disabled: true },
    ],
  },
  {
    question: 'How much time can you give?',
    helper: 'Duration — a proportion, not a clock face. One number drives the whole family.',
    category: 'time',
    options: [
      { id: '30', illustration: 'time-30-min', label: '30 minutes', description: 'Ring at half, span at half' },
      { id: '45', illustration: 'time-30-min', label: '45 minutes', description: 'Placeholder — same sample' },
      { id: '60', illustration: 'time-30-min', label: '60+ minutes', description: 'Placeholder — same sample' },
    ],
  },
];

export function IllustrationReview() {
  const [picked, setPicked] = useState<Record<string, string[]>>({
    goals: ['muscle'],
    people: ['c'],
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
            Five sample illustrations across five categories — a human figure, a goal, an
            environment, an object and a duration — all rendered by the same{' '}
            <code className="text-ember">IllustrationOption</code> component. Options repeat a
            sample where that asset is not drawn yet; those are labelled placeholder.
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
