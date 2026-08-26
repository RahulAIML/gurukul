# Onboarding Implementation Plan — Avatar-Based Fitness Personalization (Vertical Slice 1)

**Scope**: Simple landing → 5 personalization questions → temporary result. Nothing else.

---

## 1. Reference study — MadMuscles

### 1.1 What I could actually observe

I attempted a live walkthrough of both `madmuscles.com` and the supplied funnel URL (`/funnel/bing-default-soft/step-one`, with and without the full UTM/msclkid query). **The funnel body never rendered** in this environment — the page loads its shell, shows a persistent `loader` image, and the question content is never injected. It is gated (bot/geo/consent), so I could not step through the real questions.

Stating that plainly rather than describing screens I did not see.

**What the entry point did reveal, concretely:**

| Observation | Evidence | What it tells us |
|---|---|---|
| Funnel is a distinct routed surface, not a modal | Landing CTA "Choose a program" → `/funnel/default-uni-soft/step-one` | The quiz is its own route with its own step URLs — deep-linkable, back-button friendly |
| Named step routes | `.../step-one` | Steps are addressable, not just internal component state |
| Multiple funnel *variants* per traffic source | `default-uni-soft`, `bing-default-soft` in URLs | The funnel is config/variant-driven, not hardcoded — the same conclusion we want for our schema |
| Multiple visual *themes* enumerated in the DOM | `LIGHT_ORANGE`, `DARK_ORANGE_MODERN`, `DEFAULT`, `DEFAULT_PRIMARY_SOFT`, `DEFAULT_BLUE_SOFT` | Theme is a swappable layer over one question engine |
| 16 locales, each preserving the funnel path | `/hi/funnel/bing-default-soft/step-one`, etc. | Question content is data, fully externalised from the UI |
| Quiz precedes account creation | Homepage markets post-signup value; the funnel is the pre-signup surface | Ask first, register later — never gate the quiz behind auth |

The structural lesson — **one question engine, content as data, presentation as a swappable theme, steps as addressable routes** — is directly evidenced, and is exactly what §13 of the brief asks for. That is what we adopt.

### 1.2 Patterns adopted (genre conventions, not copied specifics)

Well-established conventions of the fitness-quiz funnel genre. We adopt the *mechanics*; all content, visuals, copy and code are original Gurukul work:

1. **One primary question per screen.** No multi-question pages. Reduces perceived effort per step.
2. **Large tappable option cards with a visual, a title, and a short description** — not bare text buttons.
3. **Tap-to-select auto-advances** on single-choice questions. Halves the interactions on mobile and creates momentum.
4. **A quiet, always-visible progress indicator.** Present enough to reassure, small enough not to dominate.
5. **Ask before registering.** The user invests answers first; the account request comes later.
6. **Second-person, non-judgemental copy.** "Where do you stand today?" not "Rate your fitness level."
7. **A synthesis beat after the questions** — a brief "preparing your plan" moment that makes the answers feel used rather than swallowed.

### 1.3 Explicitly NOT taken

Their branding, colour system (orange themes), typography, illustrations, photography, copy, layouts, code, or visual identity. Our palette, type, ornament, illustration family, and every line of copy are Gurukul-original per `docs/VISUAL_LANGUAGE.md`.

---

## 2. What this slice builds

```
/                             Simple landing (intentionally temporary)
   ↓ "Start Your Journey"
/gym/onboarding/goal          Q1  Goal             single
/gym/onboarding/level         Q2  Fitness level    single
/gym/onboarding/location      Q3  Location         single
/gym/onboarding/equipment     Q4  Equipment        multiple
/gym/onboarding/time          Q5  Time per session single
   ↓
/gym/onboarding/preparing     Temporary synthesis + "coming next"
```

**Not in this slice** (§31): marketing landing, real recommendation engine, AI, auth, payments, dashboard, workout engine, progress, community, nutrition, admin, backend persistence.

---

## 3. Question schema

Config-driven per §13. One engine renders every question.

```ts
type QuestionType = 'single' | 'multiple';   // only what Q1-Q5 need (§15)

interface QuestionOption {
  id: string;
  title: string;
  description: string;
  avatar: AvatarKey;        // key into the swappable avatar registry
  exclusive?: boolean;      // multi-select: selecting this clears all others
}

interface Question {
  id: string;               // also the URL segment
  question: string;         // the one primary question
  helper?: string;          // one short reassuring line
  type: QuestionType;
  options: QuestionOption[];
  minSelections?: number;   // multiple: gates the Continue button
  columns?: 2 | 3;          // desktop layout hint; mobile is always 1
}
```

Adding a question later = appending one object to `fitnessQuestions.ts`. No component changes, no routing changes (the route is `:questionId`).

Future types (`slider`, `number`, `text`, `date`, `boolean`) are deliberately unimplemented (§15 — do not over-engineer).

---

## 4. The five questions

| # | id | Question | Type | Options |
|---|---|---|---|---|
| 1 | `goal` | What would you like to achieve? | single | Build Muscle · Lose Fat · Get Stronger · Improve Fitness · Build Stamina · Start My Journey |
| 2 | `level` | Where does your practice stand today? | single | Just starting · Trained a little · Fairly experienced · Highly experienced |
| 3 | `location` | Where do you prefer to train? | single | Gym · Home · Outdoors · A mix of places |
| 4 | `equipment` | What do you have access to? | **multiple** | Full gym · Basic equipment · Dumbbells · No equipment\* · A mix\* |
| 5 | `time` | How much time can you realistically give? | single | 15–20 min · 30 min · 45 min · 60+ min · It varies |

\* `exclusive: true` — "No equipment" and "A mix" each clear the other selections, since they contradict specific-item picks.

**Copy principle**: Q2 never ranks the user. "Just starting" is framed as a beginning, not a deficit. No option is worded so that another looks better.

---

## 5. Avatar art direction and asset strategy

### 5.1 The honest constraint

§7 hypothesises "premium semi-realistic digital illustrations." I cannot produce or commission raster character art here, and §28 rightly forbids downloading unrelated stock images. So:

**Decision**: build the avatar family as **original inline SVG figure illustrations**, authored as one system, in the established Gurukul visual language.

This is not a compromise fallback — thin brass line-work on warm ink *is* the house style (`VISUAL_LANGUAGE.md` §5), so figures drawn this way are more coherent with the brand than imported semi-realistic renders would be. They are sharp at any size, theme-aware, and add no image payload.

### 5.2 The single visual system

Every avatar obeys the same rules, so they unmistakably belong together:

- **Canvas**: 200×200 `viewBox`, figure occupying the central ~150×150.
- **Stroke**: 2.2px brass primary line, 1.2px secondary detail. Round caps and joins throughout.
- **Fill**: none on figures. Flat low-opacity brass washes only for ground shapes.
- **Framing**: every avatar sits inside the same cusped-arch ground with the same jali hatch — the recurring Gurukul device.
- **Figure language**: consistent simplified proportions (head ≈ 1/7 body), same shoulder width, same implied light from upper-left. Poses read as *practice*, never strain or aggression.
- **State**: unselected renders at 78% opacity; selected goes to 100% with the arch ground filling brass-dim.

### 5.3 Replaceable asset layer (§28)

The UI never references a file path or format. It references a key:

```ts
type AvatarKey =
  | 'goal-build-muscle' | 'goal-lose-fat' | 'goal-get-stronger'
  | 'goal-improve-fitness' | 'goal-build-stamina' | 'goal-start-journey'
  | 'level-beginner' | 'level-some' | 'level-experienced' | 'level-advanced'
  | 'location-gym' | 'location-home' | 'location-outdoors' | 'location-mix'
  | 'equipment-full-gym' | 'equipment-basic' | 'equipment-dumbbells'
  | 'equipment-none' | 'equipment-mix'
  | 'time-short' | 'time-medium' | 'time-long' | 'time-extended' | 'time-varies';

// avatars/registry.tsx — the ONLY place that knows how an avatar is drawn
export const AVATARS: Record<AvatarKey, React.FC<AvatarProps>> = { ... };
```

Swapping to commissioned raster art later means editing `registry.tsx` alone — replace each component body with an `<img>`. No question data, no component, no test changes.

---

## 6. Interaction decisions

### 6.1 Selection behaviour (§18 asks us to evaluate)

| Question type | Behaviour | Why |
|---|---|---|
| `single` | Tap selects → 260ms confirm beat → auto-advance | One tap instead of two on every step. The pause is long enough to see the selection land, short enough to feel responsive. |
| `multiple` | Tap toggles; explicit **Continue** button | Auto-advance is impossible when the user may pick several. Continue is disabled until `minSelections` is met, with a quiet hint. |

Auto-advance honours `prefers-reduced-motion` by collapsing the delay and skipping the transition.

**Anti-confusion measures**: the multi-select question is visually distinct (square checkbox affordance, a "Select all that apply" label, a persistent Continue bar), so the user is never unsure whether to expect an auto-advance.

### 6.2 Back navigation (§19)

`← Back` on every question after the first, plus native browser back (real routes make this work for free). Going back restores the prior answer as selected, allows changing it, and recomputes progress. Answers are never cleared on reverse navigation, and changing an early answer preserves later ones (answers are keyed by question id, not position).

---

## 7. Architecture

### 7.1 Tech

Vite · React 18 · TypeScript · Tailwind · React Router v6 · Framer Motion — all from the approved stack.

**State**: a single `useFitnessOnboarding` hook over `useReducer` + localStorage. Deliberately **not** Zustand for this slice — five questions of local, single-consumer state do not justify a store (§15). Promoting to Zustand later is a contained change behind the same hook signature.

### 7.2 Files

```
src/frontend/src/
├── app/
│   ├── App.tsx                      routes
│   └── main.tsx
├── features/onboarding/
│   ├── components/
│   │   ├── OnboardingLayout.tsx     shell: brand, progress, back, focused column
│   │   ├── ProgressIndicator.tsx    "Step 2 of 5" + dot rail
│   │   ├── QuestionCard.tsx         renders one Question from schema
│   │   ├── AvatarOption.tsx         one option card
│   │   └── PreparingScreen.tsx      temporary synthesis (§25)
│   ├── avatars/
│   │   ├── primitives.tsx           shared arch ground, jali hatch, stroke defaults
│   │   └── registry.tsx             AvatarKey → component  (swap point)
│   ├── data/
│   │   └── fitnessQuestions.ts      the five questions
│   ├── hooks/
│   │   └── useFitnessOnboarding.ts  currentQuestion · answers · progress
│   ├── types/
│   │   └── onboarding.types.ts
│   └── utils/
│       └── onboardingStorage.ts     localStorage read/write/clear + version guard
├── pages/
│   ├── GymLanding.tsx               simple, temporary (§4)
│   └── GymOnboarding.tsx            routed question host
└── styles/
    └── index.css                    VISUAL_LANGUAGE tokens + Tailwind layers
```

Matches §27, adapted to the repo's existing `src/frontend/` root.

### 7.3 Routing (§21)

```
/                                 GymLanding
/gym/onboarding                   → redirect to first unanswered question
/gym/onboarding/:questionId       GymOnboarding (validates id against schema)
/gym/onboarding/preparing         PreparingScreen
*                                 → /
```

One route with a param, not five hardcoded routes — so adding Q6 needs no routing change. An unknown or out-of-order `questionId` redirects to the first unanswered question, so URLs cannot be used to skip ahead.

### 7.4 Persistence (§20)

`localStorage` key `gurukul.onboarding.fitness.v1` holding `{ version, answers, updatedAt }`. Version-guarded: a schema change bumps the version and stale payloads are discarded rather than mis-read. Every access is wrapped in try/catch (private mode, disabled storage). No MongoDB in this slice.

---

## 8. Motion (§17)

| Moment | Treatment |
|---|---|
| Question enter | Fade + 12px rise, 280ms, ease-out |
| Question exit | Fade + 8px lift, 180ms |
| Option select | Border/ground transition 160ms; check mark scales in |
| Progress | Dot fill + bar width, 240ms |
| Preparing screen | Slow brass ring sweep ~2.4s, then reveal |

Direction is forward-on-advance, reverse-on-back. Everything is gated by a `prefers-reduced-motion` check that reduces transforms to opacity-only and collapses durations.

---

## 9. Responsive (§22, §23) — mobile first

| Width | Option grid | Card form |
|---|---|---|
| 360–429 | 1 column | Horizontal: avatar left, text right |
| 430–767 | 1 column, roomier | Horizontal |
| 768–1023 | 2 columns | Vertical: avatar above text |
| 1024+ | 2–3 columns per `columns` hint | Vertical, content column capped at 720px — never full-bleed (§23) |

Cards are ≥88px tall on mobile and the whole card is the tap target, well past the 48px floor.

---

## 10. Accessibility

- `single` → `role="radiogroup"` + `role="radio"`, arrow-key navigation, roving tabindex.
- `multiple` → `role="checkbox"` + `aria-checked`.
- Selected state carries **three** signals: brass border, filled arch ground, **and** an explicit check glyph — never colour alone.
- Visible focus ring (2px brass, 2px offset) on every interactive element.
- `aria-live="polite"` announces step changes; focus moves to the new question heading on advance.
- Contrast: parchment on warm ink ≈ 13.6:1; brass on ink ≈ 8.2:1.

---

## 11. Verification

1. `tsc --noEmit` clean; `vite build` clean.
2. Screenshot pass at 360 / 390 / 430 / 768 / 1024 / 1440.
3. Full flow: land → 5 questions → preparing.
4. Back navigation preserves answers; changing an early answer preserves later ones.
5. Reload mid-flow resumes at the right question.
6. Keyboard-only completion.
7. Deep-link to a later question redirects correctly.
8. Reduced-motion pass.

---

## 12. Deployment

Vercel, static SPA build from `src/frontend`. Requires an SPA rewrite (all paths → `index.html`) or deep links 404 on refresh.

---

## 13. Extensibility — what this slice makes cheap

| Future need | Cost, given this design |
|---|---|
| Add questions 6–12 | Append objects to `fitnessQuestions.ts` |
| New question type (slider) | One renderer branch in `QuestionCard` + one union member |
| Real commissioned avatars | Edit `avatars/registry.tsx` only |
| Backend persistence | Swap `onboardingStorage` internals; hook signature unchanged |
| Real recommendation engine | Replace `PreparingScreen`'s terminus; answers already shaped as `Record<questionId, string[]>` |
| Second category (English) | Copy the feature folder, new data file; engine and components are category-agnostic |
