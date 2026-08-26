# Gurukul Onboarding Illustration System

**Status**: Built. 27 assets across six categories; the shipped funnel renders from this system.
**Review surface**: `/design/illustrations`

---

## 1. What this is

One illustration language for the **entire** onboarding, not an avatar set. Every visual answer option in every question — a body type, a goal, a gym, a dumbbell, a duration, later a motivation or a sleep pattern — is drawn to the rules below so that no question ever looks like it came from a different product.

The name for the style is **Lit Line**: precise flat vector construction, one solid accent mass carrying the subject, structure in neutral, a single implied light source.

---

## 2. The construction rules

These are the rules that actually keep a set coherent. An asset that breaks any of them gets sent back.

| Property | Rule | Why it matters |
|---|---|---|
| **Canvas** | `viewBox="0 0 160 160"`. Subject occupies the central ~120×120 with a 20px safe margin. | A shared canvas and margin is what makes twelve unrelated subjects sit at the same optical size. |
| **Floor line** | Every subject stands on `y=142`, drawn as a 3px neutral line at 50% opacity. | The single strongest cohesion device in the set. A floating object next to a grounded one instantly reads as two styles. |
| **Perspective** | **Strict front elevation only.** No 3/4 view, no isometric, no foreshortening. | Mixing perspectives is the fastest way a set falls apart. Non-negotiable. |
| **Line weight** | Two tiers only: **structural 5–7px**, **detail 3–4px**. Round caps and joins throughout. | At 76–104px render size, anything under ~3px on a 160 canvas disappears; more than two tiers reads as noise. |
| **Shape language** | Geometric primitives. Rectangles get `rx` ≥ 3.5. No sharp points except deliberate direction cues (chevrons, arrows). | Consistent corner treatment across objects and environments. |
| **Detail budget** | **Maximum 7 discrete shapes** per illustration (excluding the floor line). | Hard cap that forces clarity at small size. Every asset so far comes in under it. |
| **Fill vs stroke** | The *subject* is filled with the accent. *Context and structure* are stroked in neutral. | This is the figure/ground contract: the eye always lands on the thing the option is about. |
| **Lighting** | Single implied source, upper-left. One white rim-light stroke at 26% opacity on the subject's lit edge. | Gives flat shapes form without gradients. |
| **Gradients** | **None inside the `.svg` files.** | Gradients need `id`s, and multiple inline SVGs on one screen collide on ids. Depth comes from the rim light and opacity tiers instead. |
| **Background** | Transparent. | The glow and contact shadow are drawn by the component, not baked into the asset — see §5. |
| **Human figures** | 8-head adult canon. **No facial features, ever.** | Proportion (not detail) is what makes a stylised figure read as an adult rather than a child. No faces means no implied age, ethnicity or expression — inclusive by construction, and it sidesteps the uncanny. |
| **Icon register** | There is no separate "icon" register in onboarding. Everything is an illustration on the full canvas. | Prevents the half-icon/half-illustration inconsistency that plagues most quiz funnels. |

### Human figure proportions (the 8-head canon)

On the 160 canvas, scaled from crown `y=14` to sole `y=142`:

| Landmark | y |
|---|---|
| Crown | 14 |
| Head centre | 22 (rx 7, ry 8.4) |
| Shoulder | 38 |
| Chest | 46 |
| Waist | 65 |
| Hip | 78 |
| Knee | 110 |
| Sole | 142 |

Hips sit at the **halfway point** of the figure. Head height is ~12.5% of figure height. These two numbers do all the work; getting either wrong is what made earlier drafts read as toys (see `ADR-012`).

**Body type is expressed by three parameters only** — shoulder half-width, waist half-width, hip half-width. That is how the set communicates: broad shoulders with a tight waist read as developed, a fuller midsection reads as a starting point, a hip-dominant frame reads as a female frame. Nothing else changes between figures.

---

## 3. Categories

| Category | Folder | Assets |
|---|---|---|
| Human figures | `people/` | 3 |
| Goals | `goals/` | 6 |
| Fitness level | `fitness-level/` | 4 |
| Locations / environments | `locations/` | 4 |
| Equipment | `equipment/` | 5 |
| Time / schedule | `time/` | 5 |
| Training style | `training-style/` | folder ready |
| Motivation | `motivation/` | folder ready |
| Lifestyle | `lifestyle/` | folder ready |

Later questions (frequency, cardio vs strength, mobility, sleep, recovery, social vs solo, constraints) slot into these categories or add a sibling folder. No new rules should be needed — if a subject genuinely cannot be drawn under §2, that is a signal to revisit the spec deliberately, not to improvise one asset.

### Per-category treatment

- **people** — filled figure, `stand` pose, no props. Body parameters carry the meaning.
- **goals** — figure in a goal-specific pose, plus at most one abstract cue behind it (rising chevrons for growth, motion marks for endurance). Never a dumbbell icon bolted next to a figure.
- **fitness-level** — the same figure four times with progressively broader shoulders and tighter waist. **The beginner is never drawn as weak, unhealthy or smaller** — it is an average, healthy frame; the progression is additive, not corrective.
- **locations** — environment: structure stroked in neutral, the training implement filled in accent. Bench/rack/tree/wall as context.
- **equipment** — the object itself, front elevation, accent-filled, with a second unit behind in neutral at ~55% when the option is plural.
- **time** — duration as a *proportion*, not a clock face: a ring whose arc length equals the fraction of an hour, plus a horizontal span bar. One number generates the whole family.

---

## 4. Naming and file layout

```
src/frontend/src/assets/illustrations/onboarding/
├── people/          people-neutral.svg · people-male.svg · people-female.svg
├── goals/           goal-build-muscle.svg · goal-lose-fat.svg · goal-get-stronger.svg …
├── fitness-level/   level-beginner.svg · level-some.svg · level-experienced.svg · level-advanced.svg
├── locations/       location-gym.svg · location-home.svg · location-outdoor.svg · location-mix.svg
├── equipment/       equipment-full-gym.svg · equipment-dumbbells.svg · equipment-none.svg …
├── time/            time-20-min.svg · time-30-min.svg · time-45-min.svg · time-60-min.svg
├── training-style/
├── motivation/
└── lifestyle/
```

**Convention**: `{category-singular}-{slug}.svg`, lowercase, hyphenated. The registry key is the filename without extension, so a key tells you exactly which file to open. Never `image1.svg`, `final2.svg`, `new-avatar.svg`, `test.svg`.

---

## 5. Colour and state — the component owns state, the asset never does

Assets are authored with exactly **two** colour references:

- `currentColor` — the subject / accent
- `var(--ill-neutral)` — structure and context

Nothing else. No hex values in an asset except the white rim light (`#FFFFFF` at 26%) and the black definition shading (at ~26%), both of which are lighting, not identity.

`IllustrationOption` sets those two values per state, and draws the glow and contact shadow itself:

| State | `currentColor` | `--ill-neutral` | Glow | Contact shadow |
|---|---|---|---|---|
| **Default** | `#C9202A` (muted accent) | `#9A9AA8` | 40% | 34% |
| **Hover** | unchanged | unchanged | unchanged | unchanged — border and card background lift instead |
| **Selected** | `#FF4A52` (bright) | `#FFFFFF` | 100% | 50% |
| **Disabled** | `#5A5A66` (desaturated) | `#9A9AA8` | 40% | 34% |
| **Focus** | unchanged | unchanged | unchanged | 2px ember focus ring, 2px offset |

Consequences worth stating:

- Re-theming the accent (red → gold, or per-category tinting) is a **token change**, not an asset rewrite.
- One asset serves all four states, so there is no `-selected.svg` variant to keep in sync.
- Selection never depends on colour alone: the border, the marker glyph and the glow all change too.

---

## 6. Technical approach

**Real `.svg` files, imported as inline React components** via `vite-plugin-svgr` (`import X from '….svg?react'`).

This resolves a genuine conflict in the brief: §11 asks for `.svg` assets referenced by path, while §12 requires the component to control colour. An `<img src="….svg">` is an opaque document — CSS cannot reach inside it, so `currentColor` and `--ill-neutral` would not work and every state would need its own baked file. Inlining keeps the asset files exactly where §16 wants them while making them fully recolourable.

Other consequences: no HTTP request per illustration, crisp at every DPR, tree-shaken, and `prefixIds` in the SVGO config guards against id collisions if an asset ever does need an id.

**Raster is not used anywhere, and currently has no justified case.** Should one arise (a genuine photographic texture), it needs explicit sign-off first, per §11 of the brief.

---

## 7. The component

```tsx
<IllustrationOption
  illustration="goal-build-muscle"   // registry key, not a path
  label="Build Muscle"
  description="Size and shape, built through structured work"
  selected={…}
  disabled={…}
  role="radio"                        // or "checkbox" for multi-select
  onSelect={…}
/>
```

It is deliberately agnostic — it does not know whether the illustration is a person, a place, an object or a duration. That is what lets one component carry every question in the onboarding.

Layout: horizontal on mobile (illustration left, text right, so more options fit above the fold), vertical from `sm` up. Whole card is the hit target, minimum 92px tall.

---

## 8. Adding an illustration

1. Draw it against §2 on a 160 canvas, using only `currentColor` and `var(--ill-neutral)`.
2. Save as `{category}/{category-singular}-{slug}.svg`.
3. Add one import + one registry line in `features/onboarding/illustrations/registry.ts`.
4. Reference the key from question data.

No component or routing changes at any point.

---

## 9. Fixed during the build

Caught by inspecting the set at 4× and corrected:

- **Fitness-level progression was illegible.** Four frames only spanned ~6.5 units of shoulder width, so beginner and advanced looked alike at 76px. Widened to ~10 units, and the advanced frame now uses the flex pose.
- **`equipment-basic` read as a handbag.** The resistance-band arc over a mat was ambiguous; replaced with a kettlebell.
- **`location-outdoor` read as two random circles.** Dropped the tree, kept sun + horizon + outdoor bar.
- **`location-mix` and `equipment-mix` read as jumbles.** Redrawn as legible silhouettes at matched size.
- **Float precision leaked into stroke widths** (`stroke-width="11.049999999999999"`) — the generator now rounds.
- **`goal-get-stronger`'s bar** crowded the head; raised clear.

## 9a. Optical weight normalisation

Measured rather than eyeballed. Each asset is rasterised at 400px with the state colours substituted in, then scored on alpha-weighted ink coverage (share of the canvas actually painted, weighted by opacity) plus content bounding box. Script: the measurement harness in the scratchpad; rerun it after touching any asset.

**Before → after**

| Metric | Before | After |
|---|---|---|
| Category mean spread | 3.62 pts | **2.52 pts** |
| Safe-box violations (content outside x 20..140) | 6 | **0** |
| Assets with content height under 100 | 7 | **1** (97.6) |
| Shortest asset | 63.6 | **97.6** |
| Time family internal spread | 10.4–16.8% | **14.0–18.0%** |

**What the measurement actually revealed**, none of which was visible at card size:

1. **Height, not coverage, was the main driver.** Objects measured h=64–104 against a figure h=125. Short content in a square well reads small however much ink it has.
2. **Six assets breached the 20px safe margin** — the abstract cues (speed marks, pulse, steps) and two scaled environments ran off the canvas.
3. **Width-limited assets cannot be fixed by scaling.** `equipment-full-gym`, `equipment-dumbbells` and `equipment-mix` were already at w≈120, so uniform scaling would have broken the margin. They were restructured taller instead — the dumbbells got taller plates, the mix stacked vertically (h 64 → 116).
4. **The time family was internally inconsistent** because arc length encodes duration, so a 20-minute ring carried 10.4% ink and a 60-minute ring 16.8%. Fixed by making the unfilled track heavier, so track + arc is roughly constant while the arc still communicates the proportion.
5. **My first metric was wrong.** Counting pixels above an alpha threshold scored a 12% fill as full ink and an 8% fill as none — a cliff, not a measurement. Switching to alpha-weighted coverage changed which assets were flagged.

**Deliberately not flattened**: within-category spread where it is semantic. `goal-build-stamina` is a lean runner (13.6%) and `goal-get-stronger` carries a loaded bar (20.1%); forcing those equal would destroy the thing the illustration is saying. Figures also still run ~2 pts heavier than objects, which is correct — the figure is the hero.

## 10. Relationship to the shipped funnel

**Migration complete.** The parametric avatar layer (`features/onboarding/avatars/`) and `AvatarOption` are deleted. There is now one source of truth:

- `illustrations/registry.ts` — the only swap point
- `IllustrationOption` — the only option component
- `AvatarKey` retired; `QuestionOption.illustration` is an `IllustrationKey`

All 27 options across the 9 shipped questions render from asset files. Verified by the 41-check suite.

---

## 11. Generated vs hand-authored

`scripts/generate-illustrations.mjs` emits the 19 figure-based and duration assets from the canon in §2. Run it after changing any proportion:

```bash
node scripts/generate-illustrations.mjs
```

Those files carry a `GENERATED` header — edit the script, not the file. The 8 environment and equipment assets are hand-authored (they share no armature) and are edited directly.

The split exists because consistency between *figures* is mechanical — one armature, three width parameters — and mechanical consistency should be enforced by code, not by discipline. Environments have no armature to share, so generating them would buy nothing.
