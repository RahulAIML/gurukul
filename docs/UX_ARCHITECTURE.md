# GURUKUL — UX Architecture

**Status**: Baseline for Design + System Architecture Phase
**Covers**: Design direction, full screen inventory (30 screens), and deep-dive specs for the highest-leverage screens (Landing, Hero, Goal Selection, Onboarding, Recommendation).

---

## 1. Design direction

**Personality** (from brief §3, adopted as-is): Premium, modern, disciplined, aspirational, personal, technological, Indian-inspired, calm but powerful.

**Explicit avoid-list** (from brief §3, adopted as-is): generic SaaS appearance, generic gym-website appearance, excessive neon, excessive glassmorphism, childish gamification, excessive decoration, overly traditional/religious visual treatment.

**How "Indian-inspired, sophisticated and subtle" is expressed concretely:**
- The gold accent (`#D4AF37`, SRS §13) is the *only* carrier of cultural warmth — no motifs, patterns, or iconography referencing temples, mandalas, or religious symbols.
- "Guru" language is used sparingly and conceptually (e.g., AI Coach framed as a patient, always-available guide) — never literal ashram/guru imagery of people.
- Typography favors quiet confidence (see `DESIGN_SYSTEM.md`) over ornamentation — the discipline of the product *is* the design language, not applied decoration on top of a generic template.
- Dark, navy-black surfaces (`#1a1a2e`/`#16213e`, per SRS §13 — confirmed system-of-record, see `DESIGN_PHASE_REVIEW.md` Conflict 2) evoke a calm, focused evening-training mood rather than a bright commodity-gym aesthetic.

**MadMuscles reference — mechanic only:** the useful pattern is *goal → short onboarding → personalized payoff → registration after value shown*. Nothing about its visual language, copy, or layout is reused (see `GYM_USER_JOURNEYS.md` §1 for how this mechanic is adapted).

---

## 2. Screen inventory (all 30, priority-ordered)

Legend: **P0** = designed in full in this phase, sequenced early in the roadmap · **P1** = designed in full, later roadmap phase · **P2** = conceptual only this phase, no build commitment.

| # | Screen | Auth | Priority | Category-owned? |
|---|---|---|---|---|
| 1 | Gurukul Home | Public | P0 | Platform |
| 2 | Category Selection | Public | P0 | Platform |
| 3 | Gym Landing | Public | P0 | Gym |
| 4 | Program Discovery | Public | P0 | Gym |
| 5 | Program Details | Public | P0 | Gym |
| 6 | Goal Selection | Public | P0 | Gym |
| 7 | Fitness Onboarding | Public | P0 | Gym |
| 8 | Recommendation Result | Public | P0 | Gym |
| 9 | Registration | Public | P0 | Platform |
| 10 | Login | Public | P0 | Platform |
| 11 | Gym Dashboard | Auth | P0 | Gym |
| 12 | Today's Workout | Auth | P0 | Gym |
| 13 | Workout Details | Auth | P0 | Gym |
| 14 | Exercise Details | Auth | P0 | Gym |
| 15 | Active Workout | Auth | P0 | Gym |
| 16 | Workout Completion | Auth | P0 | Gym |
| 17 | Programs (My Programs) | Auth | P1 | Gym |
| 18 | Program Details (auth view) | Auth | P1 | Gym |
| 19 | Progress | Auth | P1 | Gym |
| 20 | Goals | Auth | P1 | Gym |
| 21 | AI Coach | Auth | P1 | Gym |
| 22 | AI Conversation | Auth | P1 | Gym |
| 23 | Profile | Auth | P1 | Platform |
| 24 | Settings | Auth | P1 | Platform |
| 25 | Notifications | Auth | P1 | Platform |
| 26 | Community | Auth | P2 | Platform |
| 27 | Challenges | Auth | P2 | Gym |
| 28 | Subscription | Auth | P2 | Platform |
| 29 | Payments | Auth | P2 | Platform |
| 30 | Admin | Auth (admin role) | P2 | Platform |

---

## 3. Deep dive: Gym Landing Page

**Section structure** (as specified in the brief, adopted):

```
Navbar → Hero → Personalization/Goal Selection → Why Gurukul → Programs →
How It Works → AI Coach → Progress → Testimonials → FAQ → Final CTA → Footer
```

| Section | Objective | User psychology | Content | CTA | Interaction | Animation | Mobile behavior |
|---|---|---|---|---|---|---|---|
| **Navbar** | Orientation + trust signal | "This is a real, professional product" | Logo, minimal links (Programs, How It Works, Login) | "Get Started" (scrolls to Goal Selection) | Sticky, background gains opacity on scroll | Fade-in on load only | Collapses to logo + hamburger; CTA stays visible |
| **Hero** | State the promise in one sentence | "This understands what I actually want" | Headline + subhead + primary CTA (see §4 for creative directions) | "Build My Plan" → scrolls to Goal Selection | CTA has subtle persistent presence | Staggered text reveal on load, respects reduced-motion | Headline shortens; CTA remains full-width, thumb-reachable |
| **Goal Selection** | Convert "interested" into "engaged" | "It's starting to ask about *me*" | Goal cards (see §5) | Selecting a card auto-advances | Card select → inline expand to "Continue" | Card selection scale+glow (150ms) | Cards stack vertically, one visible per swipe on small screens |
| **Why Gurukul** | Differentiate from commodity fitness apps | "This isn't just another app" | 3–4 differentiators (AI personalization, structured programs, premium coaching feel, progress visibility) — no fabricated stats | None (informational) | Scroll-triggered reveal | Sections reveal on scroll-into-view, once only | Stacks to single column |
| **Programs** | Show real substance exists | "There's real content here, not vaporware" | 3–4 program teaser cards (name, level, duration) linking to Program Discovery | "View All Programs" | Card hover lifts slightly | Reveal on scroll | Horizontal scroll-snap carousel |
| **How It Works** | Reduce perceived effort/risk | "This is simple, I know what happens next" | 3–4 numbered steps (Choose Goal → Get Plan → Train → Track) | None | Step highlight on scroll position | Sequential reveal tied to scroll | Vertical stepper, numbers stay left-aligned |
| **AI Coach** | Introduce the AI differentiator without overselling | "There's a guide, not just a video library" | Short explanation + example prompt/response teaser (static, not live) | "See how it works" (optional, links to explanation, not a live demo pre-signup) | None interactive pre-signup | Typing-effect teaser (respects reduced-motion → static text) | Teaser simplifies to single example |
| **Progress** | Show the payoff of consistency | "I'll be able to see myself improve" | Static illustrative progress visualization (clearly marked as example, not real user data) | None | None | Chart draws in on scroll-into-view | Simplifies to single stat + one chart |
| **Testimonials** | Social proof | "Other real people did this" | 3–5 items — **placeholder-marked** until real testimonials exist (never fabricated, per design guidance) | None | Carousel, manual advance | Slide transition | Single testimonial at a time, swipeable |
| **FAQ** | Remove last objections | "My concerns are addressed" | 5–8 real Q&As (pricing, AI accuracy, equipment needs, cancellation) | None | Accordion expand/collapse | Height animation on expand | Full-width accordion |
| **Final CTA** | Last conversion opportunity | "I'm ready" | Restated promise + CTA | "Build My Plan" (same destination as Hero CTA) | None | Fade-in on scroll | Full-width button |
| **Footer** | Utility + trust | — | Links (legal, contact, social), category links | — | — | None | Stacks into accordion groups |

**Accessibility for this page**: every CTA reachable via keyboard tab order matching visual order; scroll-triggered animations gated behind `prefers-reduced-motion`; all section headings use proper `h2`/`h3` hierarchy for screen-reader navigation; testimonial carousel has visible pause control and is not auto-advancing indefinitely without pause.

---

## 4. Hero — three creative directions

### Direction A: "The Guide" (chosen — see rationale below)

- **Headline**: "Your Discipline. Guided."
- **Supporting message**: "Personalized coaching that adapts to your goals — built on structure, not guesswork."
- **CTA**: "Build My Plan"
- **Visual concept**: Deep navy-black background, a single subtle radial gold glow (not a photo/illustration — restraint over decoration), headline as the dominant visual element with generous negative space.
- **Emotional objective**: Calm confidence — "I'm being guided by something disciplined and trustworthy."
- **Strengths**: Matches "calm but powerful" precisely; avoids every item on the avoid-list; typography-led design ages well and is cheap to localize for future categories (same template works for "Your Fluency. Guided." for English).
- **Weaknesses**: Relies entirely on typographic execution quality — a weak type pairing would make this feel empty rather than restrained. Requires strong copywriting discipline to not feel generic.

### Direction B: "The Transformation"

- **Headline**: "From Where You Are. To Where You're Meant to Be."
- **Supporting message**: "AI-personalized fitness coaching rooted in ancient discipline."
- **CTA**: "Start Your Journey"
- **Visual concept**: Split-screen or before/after motif suggesting progression, gold accent line connecting two states.
- **Emotional objective**: Aspiration, hope.
- **Strengths**: Strong emotional pull, classic fitness-marketing effectiveness.
- **Weaknesses**: Before/after visual language is exactly the commodity-fitness-app aesthetic the brief explicitly asks to avoid; risks reading as generic SaaS/fitness marketing rather than premium and disciplined.

### Direction C: "The Companion"

- **Headline**: "A Guru for Every Goal."
- **Supporting message**: "Available 24/7. Infinitely patient. Built for you."
- **CTA**: "Meet Your Coach"
- **Visual concept**: Abstract representation of an always-present presence — a soft pulsing gold indicator, minimal chat-bubble hint.
- **Emotional objective**: Reassurance, companionship.
- **Strengths**: Leads with the AI Coach differentiator immediately.
- **Weaknesses**: Risks the "overly traditional" flag by using "Guru" so literally in the headline itself; also front-loads AI before the user has any reason to trust it — AI Coach lands better as a mid-page reveal (per §3's section order) than as the very first thing said.

### Selected: **Direction A — "The Guide"**

**Why**: It is the only direction that satisfies all five personality traits (premium, modern, disciplined, aspirational, personal) simultaneously without tripping any avoid-list item, and it generalizes cleanly across future categories without rewriting the visual system (Direction B's before/after motif is fitness-specific; Direction C's language is too literally "guru" for the "sophisticated and subtle" requirement). It also puts the least pressure on any one visual asset — the risk (weak typography execution) is fully mitigated by the `DESIGN_SYSTEM.md` type scale being locked before this ships.

**Reconfirmed after reviewing a user-supplied reference image**: mid-phase, a reference UI was shared using literal mythological/epic artwork (a painted Arjuna-with-bow scene, temple gopuram silhouette) as its hero visual. This was evaluated and explicitly rejected as the hero's visual treatment — it directly contradicts this brief's own §3 guardrail against "overly traditional/religious visual treatment," and Direction A's typographic restraint remains the confirmed direction. What *was* adopted from that reference is purely structural/IA (sidebar shape, dashboard card composition — see §8's Gym Dashboard revision note and `INFORMATION_ARCHITECTURE.md` §3), which carries no visual-treatment risk.

---

## 5. Deep dive: Goal Selection

**Goals** (single-select, per D2 in `DESIGN_PHASE_REVIEW.md`):

```
Build Muscle · Lose Fat · Get Stronger · Improve Fitness ·
Build Stamina · Build Discipline · Start From Zero
```

| Aspect | Spec |
|---|---|
| Card design | Rectangular card, icon (custom line-icon set, not emoji — see `COMPONENT_SPECIFICATION.md` → GoalCard), goal label, one-line description. No photography — icons keep it category-portable and avoid stock-photo genericness. |
| Icon/image treatment | Single-color line icon in muted text-secondary by default; recolors to gold on select/hover. Consistent 2px stroke weight, 24px grid (per `DESIGN_SYSTEM.md` icon rules). |
| Selected state | Gold border (2px), subtle gold-tinted background fill, icon recolors gold, checkmark badge appears top-right. |
| Hover | Border lightens, card lifts 2px, shadow deepens — signals interactivity without color change (color change reserved for selected state so hover and selected remain visually distinct). |
| Keyboard focus | Visible 2px gold focus ring, offset 2px, identical treatment to hover but persists without a pointer — cards are real `<button>` elements, arrow-key navigable as a radiogroup (`role="radiogroup"`, each card `role="radio"`). |
| Animation | Select: 150ms scale (1 → 1.03 → 1) + border/background transition. No bounce/spring — restraint per brand personality. |
| Selection model | **Single-select** (confirmed D2) — selecting a new card deselects the previous one instantly, no confirmation step needed. |
| CTA behavior | "Continue" button is disabled/hidden until a selection is made; once selected, either auto-advances after a short delay (400ms, allows the selection animation to complete) or a "Continue" button becomes active — **auto-advance chosen** to keep momentum (matches the "guided, not a form" principle from onboarding, item 10) with a visible but non-blocking Continue button as a fallback for users who pause. |
| Mobile layout | Single column, full-width cards, comfortable 56px+ touch height, sticky Continue button once a selection exists. |
| Persistence | Session-local (browser storage) until registration, per `GYM_USER_JOURNEYS.md` §1 abandonment handling — never sent to the server for anonymous users. |

---

## 6. Deep dive: Fitness Onboarding

Multi-step, one question per screen, guided (not a long form):

| Step | Question | Answer type | UI | Validation | Progress | Back | Skip |
|---|---|---|---|---|---|---|---|
| 01 | "What's your experience level?" | Single-select (Beginner / Intermediate / Advanced) | 3 large cards with brief descriptors | Required | Step 1 of 6, dots + fraction | N/A (first step; back exits to Goal Selection) | Not skippable — needed for recommendation |
| 02 | "Where will you train?" | Single-select (Home / Gym / Both) | 3 cards with icon | Required | Step 2 of 6 | Returns to Step 1, answer preserved | Not skippable |
| 03 | "What equipment do you have access to?" | Multi-select (None / Dumbbells / Resistance Bands / Full Gym / Other) | Chip-style multi-select grid | At least one required | Step 3 of 6 | Preserved | Not skippable |
| 04 | "How many days a week can you train?" | Single-select (2–3 / 3–4 / 4–5 / 5+) | Horizontal segmented control | Required | Step 4 of 6 | Preserved | Not skippable |
| 05 | "How long can each session be?" | Single-select (20–30 / 30–45 / 45–60 / 60+ min) | Horizontal segmented control | Required | Step 5 of 6 | Preserved | Not skippable |
| 06 | "Anything else we should know?" (injuries, preferences) | Free text, optional | Textarea, short character limit, helper text | None — optional | Step 6 of 6 | Preserved | **Skippable** — only optional step |

**Cross-cutting behavior:**
- **Progress indicator**: a slim top progress bar (fills left→right) plus "Step N of 6" text — bar alone is not sufficient for screen readers, hence the text pairing.
- **Continue behavior**: primary button always bottom-anchored (mobile) or bottom-right (desktop), disabled until the step's validation passes (except step 6).
- **Transition**: horizontal slide (forward = slide left, back = slide right), 250ms, respects reduced-motion (crossfade instead of slide when reduced-motion is set).
- **Mobile**: one question fully visible per screen, no scrolling required within a step; large tap targets (56px minimum per accessibility floor, brief §17).
- **Data model note**: steps 1–5 map directly to fields already defined in SRS §5's `Profile` (`fitness_level`) and the onboarding answer set feeds `Goals` — no new top-level collection needed; see `DATABASE_ARCHITECTURE.md`.

Guided feel is achieved by: one decision per screen (never a scrolling form), conversational question phrasing (not label:field style), and immediate visual acknowledgment of every choice (selected-state styling identical to Goal Selection's language, for consistency).

---

## 7. Deep dive: Recommendation Result

**Payoff framing**: "We understand your goal. Here's your recommended starting journey."

| Element | Content |
|---|---|
| Goal | Restates the selected goal (e.g., "Build Muscle") with its icon, anchoring the result to the user's own choice |
| Fitness level | Restates step-01 answer |
| Recommended program | Program name + one-line description, pulled from the rule-based lookup (goal × level × equipment × frequency → `program_id`, see `CATEGORY_ARCHITECTURE.md`) |
| Schedule | Days/week and session length, matching steps 04–05 answers |
| Weekly commitment | Plain-language summary ("3 sessions/week, ~40 min each") |
| Expected training structure | Brief structure preview (e.g., "Weeks 1–4: Foundation · Weeks 5–8: Progression") — sourced from the program's own metadata, not invented per-user |
| Reason for recommendation | One or two sentences explicitly connecting answers to the recommendation ("Because you're a beginner training at home 3x/week, we've matched you with...") — this line is what makes the moment feel earned, not templated |
| CTA | "Create My Account" (primary) → Registration; "Explore Other Programs" (secondary, text link) → Program Discovery |

**Why this screen matters most**: per `GYM_USER_JOURNEYS.md`, this is the conversion hinge — the entire onboarding investment pays off or falls flat here. The "reason for recommendation" line is non-negotiable; without it, this screen is indistinguishable from a generic result screen and the personalization principle (Product Principle 2) fails at the most visible moment.

---

## 8. Compact specs: remaining P0/P1 screens

For brevity, remaining screens use a compact template. Full states/motion for shared components (buttons, cards, etc.) are in `COMPONENT_SPECIFICATION.md` and `MOTION_GUIDELINES.md` — not repeated per screen.

### Program Discovery (Public, P0)
Purpose: browse all Gym programs. Primary action: filter/select a program. Layout: filter bar (goal, level, duration) + responsive card grid. Empty state: "No programs match — clear filters." Navigation: from Landing's Programs section or Navbar. Mobile: filters collapse into a bottom-sheet.

### Program Details (Public, P0)
Purpose: evaluate one program before committing. Primary action: "Start This Program" (routes into Goal Selection/Onboarding if unauthenticated, or directly enrolls if authenticated — see screen #18). Layout: hero summary, curriculum breakdown (weeks/phases), equipment needed, level. Secondary action: back to Discovery.

### Registration (Public, P0)
Purpose: create an account, carrying forward onboarding context. Primary action: submit email/password. Fields: email, password, confirm password (per SRS §11 MVP scope — no name field required at this stage, added later in Profile). Validation: inline, Zod-schema-driven (client) mirrored server-side. States: default, error (field-level), submitting, success → redirect to Dashboard. Secondary action: "Already have an account? Log in."

### Login (Public, P0)
Purpose: authenticate a returning user. Primary action: submit email/password. Secondary actions: "Forgot password," "Create account." States: default, error (generic "invalid credentials" — never reveals which field is wrong, per security posture), submitting.

### Gym Dashboard (Auth, P0)
Purpose: single landing point after login; answers "what do I do now." Primary action: "Continue" / "Start Today's Workout" card (dominant, top of page, always first regardless of layout width). Layout (desktop ≥1024px, two-column per `RESPONSIVE_GUIDELINES.md` §2): primary column = Today's Workout card, Daily Progress card (ProgressRing + session/streak/time stats bundled in one card, not scattered StatCards), Popular/Continue Programs (horizontal `ProgramCard` carousel, compact variant); secondary column = Your Goals (compact list, 3–5 items pulled from the user's active `Goals`, "View All" link to the Goals screen — not a full re-explanation of onboarding, just a glanceable list), Your Journey (a `Timeline` component showing the 5-step lifecycle: Learn → Practice → Log → Improve → Achieve, mapped to Gym's actual flow: Program assigned → Workout started → Session logged → Progress visible → Goal milestone — informational, not interactive), AI Coach nudge (single contextual card, not persistent nagging). Mobile (<1024px): the same cards stack in this priority order: Today's Workout → Daily Progress → Your Goals (collapsed to top 3) → Programs carousel → Journey → Coach nudge. Empty state (no program yet — shouldn't normally happen post-onboarding, but handled): "Choose a program to get started" CTA replaces the Today's Workout card only; other cards render normally.

> **Revision note**: the two-column composition (Goals list, Journey timeline, bundled Progress+stats card, Programs carousel) was adopted from a user-supplied UI reference after confirming these are genuine layout/IA improvements, independent of that reference's rejected visual treatment (see §1 and §4 below).

### Today's Workout (Auth, P0)
Purpose: show what's scheduled today before committing to start. Primary action: "Start Workout" → Active Workout. Secondary: view full exercise list, swap/skip (if program allows). Layout: workout title, estimated duration, exercise list preview (collapsed, expandable). Empty/rest-day state: calm rest-day message, no guilt-based language (Product Principle 3).

### Workout Details (Auth, P0)
Purpose: pre-execution detail for a specific workout (accessed from Programs, not just Today). Same content shape as Today's Workout but without the "today" framing; includes "Schedule for later" vs "Start Now."

### Exercise Details (Auth, P0)
Purpose: form guidance for one exercise. Primary action: none required (informational) — reachable mid-workout via tap. Content: name, muscle group, form video/cues, last-performed stats (weight/reps history), optional "Ask Coach about this" contextual entry.

### Active Workout (Auth, P0)
Purpose: distraction-free execution. Primary action: log each set (weight × reps) and advance. Layout: full-screen, one exercise emphasized at a time, rest timer between sets, minimal chrome — nav sidebar/bottom-nav is **hidden** during this screen (only exit is an explicit "End Workout" confirmation, preventing accidental navigation loss). AI Coach access deliberately suppressed here (per `GYM_USER_JOURNEYS.md` §3). States: default (logging), resting (timer), paused, exercise-complete.

### Workout Completion (Auth, P0)
Purpose: close the loop, reinforce consistency. Content: duration, sets/reps completed, streak update, optional short reflection input (skippable). Primary action: "Done" → Dashboard. No forced social share, no gamified confetti overload (Product Principle 3) — a single, restrained success acknowledgment (see `MOTION_GUIDELINES.md` → success state).

### Programs / My Programs (Auth, P1)
Purpose: manage enrolled program(s), browse to switch. Primary action: continue active program. Secondary: browse/switch (with a clear warning that switching resets progress tracking for the prior program, not silently discarding data).

### Program Details — authenticated view (Auth, P1)
Same as public Program Details plus authenticated actions: Enroll / Currently Active / Switch.

### Progress (Auth, P1)
Purpose: visualize consistency and improvement. Content: streak history, workouts-completed chart, key-lift progress (if 1RM tracked), milestone markers. Empty state (new user): encouraging first-week framing, not an empty chart with no context.

### Goals (Auth, P1)
Purpose: view/edit current goal. Primary action: "Update Goal" (re-enters a shortened onboarding flow, not full onboarding from scratch). Secondary: view goal history.

### AI Coach (Auth, P1)
Purpose: entry point to AI conversations. Layout: list of past conversations + "New Conversation" primary action, contextual suggested prompts (e.g., "Ask about today's workout").

### AI Conversation (Auth, P1)
Purpose: scoped chat thread. Layout: standard chat UI (ChatMessage/ChatInput components, see `COMPONENT_SPECIFICATION.md`). States: sending, streaming response, error (rate-limited/unavailable — explicit graceful message, never a silent failure), empty (new thread, shows suggested starter prompts).

### Profile (Auth, P1, Platform-owned)
Purpose: manage identity info. Fields: name, avatar, bio, timezone — matches SRS §5 `Profile` fields. Category-agnostic.

### Settings (Auth, P1, Platform-owned)
Purpose: account/privacy/notification preferences. Sections: Account, Notifications, Privacy, (future: Subscription).

### Notifications (Auth, P1, Platform-owned)
Purpose: notification center. Content: list, read/unread state, per SRS §5 `Notifications` collection (TTL 30 days). Empty state: calm "You're all caught up."

---

## 9. Compact specs: P2 (conceptual only, not built this phase)

- **Community**: platform-owned feed, category-filterable. No screen design produced this phase (per `DESIGN_PHASE_REVIEW.md` §6, postponed).
- **Challenges**: Gym-owned, time-boxed group goals. No design produced this phase.
- **Subscription / Payments**: platform-owned, Stripe-backed (SRS §4/§6). No design produced this phase — API shape exists in SRS §6 (`/subscriptions/checkout`).
- **Admin**: separate shell, not user-facing. No design produced this phase.

---

## 10. States, accessibility, and responsive — pointers

To avoid repeating the same rules 30 times, the following are defined once, centrally, and apply to every screen above unless a screen-specific override is called out:

- **Component states** (default/hover/focus/active/selected/disabled/loading/error/empty/success): defined per-component in `COMPONENT_SPECIFICATION.md`.
- **Responsive breakpoints and layout transformation rules**: `RESPONSIVE_GUIDELINES.md`.
- **Motion**: `MOTION_GUIDELINES.md`.
- **Accessibility baseline** (contrast, focus, keyboard, screen-reader, semantic structure, touch targets, reduced motion): `DESIGN_SYSTEM.md` §Accessibility, applied uniformly.

---

*This document depends on `DESIGN_PHASE_REVIEW.md` (palette Conflict 2, recommendation-engine D1, single-select D2) and feeds `TRACEABILITY.md`.*
