# GURUKUL — Motion Guidelines

**Status**: Baseline. Implementation via Framer Motion (SRS §4).
**Principle**: every animation has a purpose — orientation, feedback, or continuity. None are decorative. This directly enforces Product Principle 3 (premium restraint) and the brief's explicit ban on "childish gamification."

---

## 1. Timing & easing tokens

| Token | Duration | Easing | Usage |
|---|---|---|---|
| `motion-instant` | 100ms | `ease-out` | Press/active feedback |
| `motion-fast` | 150ms | `ease-out` | Hover, selection state changes |
| `motion-standard` | 250ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Page/step transitions, modal open |
| `motion-slow` | 400ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Large reveals, success moments |

No animation in this system exceeds 400ms. Nothing loops indefinitely except deliberate "waiting" indicators (spinners, rest timers), which are exempted since they represent real elapsed time, not decoration.

---

## 2. Purpose-mapped animation catalogue

| Moment | Animation | Duration | Notes |
|---|---|---|---|
| **Page entrance** | Fade + 8px upward translate | `motion-standard` | Applied once per route entry, never re-triggered on re-render |
| **Section reveal** (Landing scroll) | Fade + 12px upward translate, triggered on scroll-into-view via IntersectionObserver | `motion-standard` | Fires once only — never re-animates on scroll-back-into-view |
| **Hover** | Border/shadow/lift transition | `motion-fast` | Cards: 2px lift + shadow deepen. Buttons: background lightens, no lift (avoid excessive motion on frequently-hovered small elements) |
| **Press** | Scale to 0.98 | `motion-instant` | All tappable elements |
| **Selected** (GoalCard, onboarding options) | Scale 1 → 1.03 → 1 + border/background transition | `motion-fast`, single pulse | Never a repeating pulse — one settle, then static selected style holds |
| **Success** (Workout Completion, form submit) | Icon draws in (checkmark path animation) + fade | `motion-slow` | One-time, restrained — explicitly no confetti/particle effects (Product Principle 3, brief §16 "avoid childish gamification") |
| **Loading** | Skeleton shimmer (subtle, low-contrast sweep) | Continuous while loading, 1.5s loop | Exempted from the "nothing loops" rule as it represents real wait time; disabled entirely under reduced-motion (static placeholder instead) |
| **Progress** (ProgressBar/Ring fill) | Width/stroke animates from previous value to new value | `motion-slow` | Never resets to 0 and re-animates on every re-render — only animates the delta |
| **Navigation** (route change within app shell) | Content crossfades; persistent chrome (nav) does not re-animate | `motion-standard` | Sidebar/BottomNav never fade/flash on route change — only the content region transitions |
| **Modal** | Backdrop fade + content scale 0.96 → 1 | `motion-standard` | Exit reverses the same curve, not a different one |
| **Chat / streaming response** | Text reveals progressively as tokens arrive (real streaming, not a fake typewriter effect on already-received text) | N/A (driven by actual response timing) | If the full response arrives at once (non-streaming fallback), reveal as a single fade-in, not a simulated typing delay — simulating typing on instantly-available text is a dark pattern, not a design flourish |
| **Onboarding step transition** | Horizontal slide (forward = left, back = right) | `motion-standard` | Reduced-motion fallback: crossfade instead of slide |

---

## 3. Reduced-motion policy

`prefers-reduced-motion: reduce` is checked globally (a single hook/utility, not per-component reimplementation). When set:

- All translate/scale/slide animations are replaced with opacity-only crossfades ≤ `motion-fast`, or removed entirely where even a crossfade isn't necessary for comprehension.
- Skeleton shimmer becomes a static muted fill.
- Auto-advancing carousels (Testimonials) stop auto-advancing; manual controls remain.
- Streaming chat text reveal is unaffected (it reflects real data arrival, not decorative motion) but the "typing indicator" dots animation (if used while waiting for the first token) is replaced with a static "Coach is thinking…" label.

---

## 4. What Gurukul motion explicitly avoids

- Bounce/spring/elastic easings (reads as playful/toy-like — contradicts "disciplined, calm but powerful").
- Particle effects, confetti, or celebratory overlays on workout completion or streak milestones.
- Looping attention-grabbing animation on CTAs (no pulsing buttons to manufacture urgency).
- Parallax scrolling effects (adds decoration without orientation/feedback purpose, and is a common accessibility/performance pain point).
- Animating every element on every re-render — animation is reserved for *state changes a user should notice*, not routine data refreshes.

---

*Depends on `DESIGN_SYSTEM.md` §5 (state system) and §6 (accessibility). Implementation library: Framer Motion (SRS §4, unchanged).*
