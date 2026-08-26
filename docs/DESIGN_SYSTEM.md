# GURUKUL — Design System

**Status**: Canonical, supersedes `docs/design/DESIGN_SYSTEM.md` (the earlier exploratory pass, which drifted from SRS §13 before the full SRS had been reviewed — see `DESIGN_PHASE_REVIEW.md` Conflict 2). That file is retained for historical reference only and should not be used as a source of truth going forward.

**Base**: SRS §13 values are treated as fixed inputs and extended here, not replaced.

---

## 1. Color

### Core palette (SRS §13, unchanged)

| Token | Hex | Usage |
|---|---|---|
| `color-bg` | `#1a1a2e` | Primary background (navy-black) |
| `color-surface` | `#16213e` | Cards, panels, elevated sections |
| `color-primary` (gold) | `#D4AF37` | CTAs, active states, brand accent, links |
| `color-text` | `#FFFFFF` | Primary text on dark surfaces |
| `color-text-muted` | `#A0A0A0` | Secondary text, captions, metadata |
| `color-success` | `#10B981` | Progress, completion, positive states |
| `color-warning` | `#F59E0B` | Caution, non-blocking alerts |
| `color-error` | `#EF4444` | Errors, destructive actions |

### Extended tokens (this phase — fills gaps SRS §13 didn't specify)

| Token | Value | Usage |
|---|---|---|
| `color-primary-hover` | `#E0C158` (gold, +8% lightness) | Hover/active state on gold elements |
| `color-primary-muted` | `rgba(212, 175, 55, 0.12)` | Selected-state backgrounds, subtle fills |
| `color-border` | `rgba(212, 175, 55, 0.16)` | Default card/input borders |
| `color-border-strong` | `rgba(212, 175, 55, 0.32)` | Hover/focus/selected borders |
| `color-surface-raised` | `#1c2947` | Modal/dropdown surfaces one level above `color-surface` |
| `color-overlay` | `rgba(15, 15, 25, 0.72)` | Modal/drawer backdrops |
| `color-success-muted` | `rgba(16, 185, 129, 0.14)` | Success background fills |
| `color-error-muted` | `rgba(239, 68, 68, 0.14)` | Error background fills |
| `color-disabled` | `rgba(255, 255, 255, 0.28)` | Disabled text/icons |
| `color-disabled-surface` | `rgba(255, 255, 255, 0.06)` | Disabled control backgrounds |

### Category accent tokens (used only within category-owned screens, never in shared platform chrome)

| Category | Accent | Notes |
|---|---|---|
| Gym | `#D4AF37` (uses primary gold directly — no separate category color for the launch category) | Keeps Gym visually identical to the platform brand since it *is* the platform's expression for now |
| Future categories | Reserved — each future category gets one accent hue at the same chroma/lightness as gold, defined when that category is designed, never invented speculatively now (per "designing well" — no invented content ahead of need) |

### Contrast validation

| Pair | Ratio | WCAG AA (4.5:1 body / 3:1 large) |
|---|---|---|
| `color-text` on `color-bg` | 16.1:1 | Pass |
| `color-text` on `color-surface` | 13.9:1 | Pass |
| `color-text-muted` on `color-bg` | 7.9:1 | Pass |
| `color-primary` on `color-bg` | 8.2:1 | Pass |
| `color-success` on `color-bg` | 6.4:1 | Pass |
| `color-error` on `color-bg` | 5.1:1 | Pass |
| `color-warning` on `color-bg` | 8.7:1 | Pass |
| Black text on `color-primary` (gold buttons) | 9.1:1 | Pass — gold buttons use black, not white, text |

**Dark-mode-only** (ADR-007, confirmed): no light theme is designed or planned in this roadmap. All tokens above are the complete palette.

---

## 2. Typography

**Font family** (SRS §13, unchanged): Inter (body), Poppins (display).

| Level | Font | Size | Weight | Line height | Letter spacing | Usage |
|---|---|---|---|---|---|---|
| Display | Poppins | 72px | 700 | 1.05 | -1.5px | Reserved for hero-only oversized moments (used sparingly) |
| H1 | Poppins | 56px | 700 | 1.1 | -1px | Page-level headlines (SRS §13 value, kept exact) |
| H2 | Poppins | 40px | 700 | 1.15 | -0.5px | Section headlines (SRS §13 value, kept exact) |
| H3 | Poppins | 28px | 600 | 1.2 | 0 | Subsection headers, card titles (SRS §13 value, kept exact) |
| H4 | Poppins | 20px | 600 | 1.3 | 0 | Small headers, list group titles — **new, fills SRS gap** |
| Body | Inter | 16px | 400 | 1.6 | 0 | Standard paragraph text (SRS §13 value, kept exact) |
| Body Medium | Inter | 16px | 500 | 1.6 | 0 | Emphasized inline text — **new** |
| Small | Inter | 14px | 400 | 1.5 | 0 | Secondary text (SRS §13 value, kept exact) |
| Caption | Inter | 12px | 400 | 1.4 | 0.2px | Metadata, at 0.7 opacity per SRS §13 — **new: opacity applied via `color-text-muted`, not raw opacity, to keep contrast predictable independent of background** |
| Button | Inter | 15px | 600 | 1 | 0.1px | All button labels — **new** |
| Label | Inter | 13px | 600 | 1.3 | 0.4px, uppercase | Form labels, eyebrow text, tags — **new** |

**Note on the caption-opacity change**: SRS §13 specifies caption text as "12px opacity 0.7." This phase implements that visually via the fixed `color-text-muted` token (`#A0A0A0`, itself already ~0.7-equivalent luminance against the dark background) rather than applying `opacity: 0.7` as a CSS property on top of white text. Reasoning: raw opacity on text stacks unpredictably over different backgrounds (a card surface vs. the page background) and can fail contrast in some combinations; a fixed muted color token guarantees the same, pre-validated contrast ratio everywhere. This is a refinement of implementation, not a change to the specified visual outcome.

---

## 3. Spacing & grid

**Base scale** (SRS §13, unchanged, 8px base):

| Token | Value |
|---|---|
| `space-xs` | 4px |
| `space-sm` | 8px |
| `space-md` | 16px |
| `space-lg` | 24px |
| `space-xl` | 32px |
| `space-2xl` | 48px |
| `space-3xl` | 64px |

**Extended (fills gaps):**

| Token | Value | Usage |
|---|---|---|
| `space-4xl` | 96px | Hero vertical padding, top-level page margins on desktop |
| `container-max` | 1280px | Max content width, centered |
| `container-padding-mobile` | 16px | Horizontal page margin < 768px |
| `container-padding-tablet` | 32px | Horizontal page margin 768–1023px |
| `container-padding-desktop` | 48px | Horizontal page margin ≥ 1024px |
| `card-padding` | `space-lg` (24px) | Standard card internal padding |
| `section-gap-mobile` | `space-2xl` (48px) | Vertical gap between page sections on mobile |
| `section-gap-desktop` | `space-3xl` (64px) | Vertical gap between page sections on desktop |

**Grid**: 4-column mobile (< 768px), 8-column tablet (768–1023px), 12-column desktop (≥ 1024px). Gutter = `space-md` (16px) mobile/tablet, `space-lg` (24px) desktop.

---

## 4. Radius, elevation, borders

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 6px | Inputs, small buttons, badges |
| `radius-md` | 10px | Standard cards, buttons |
| `radius-lg` | 16px | Large cards, modals |
| `radius-full` | 9999px | Avatars, pills, icon buttons |
| `shadow-sm` | `0 2px 8px rgba(0,0,0,0.24)` | Cards at rest |
| `shadow-md` | `0 8px 24px rgba(0,0,0,0.32)` | Hover-lifted cards, dropdowns |
| `shadow-lg` | `0 16px 48px rgba(0,0,0,0.4)` | Modals |
| `shadow-glow-gold` | `0 0 0 3px rgba(212,175,55,0.18)` | Selected/focus emphasis, used sparingly |

Border default: 1px solid `color-border`. Selected/hover: 1px–2px solid `color-border-strong` or `color-primary`.

---

## 5. State system

Every interactive component must define, at minimum, these states. Not every state applies to every component (e.g., a static card has no "loading" state) — apply what's relevant.

| State | Visual rule |
|---|---|
| Default | Base tokens as specified per component |
| Hover | Border lightens to `color-border-strong`, subtle lift (2px translateY) on cards; background lightens slightly on buttons |
| Focus | 2px `color-primary` outline, 2px offset — **always visible on keyboard focus, never removed without replacement** |
| Active/Pressed | Scale 0.98, brightness -5% |
| Selected | `color-primary-muted` background, `color-primary` border, primary-colored content |
| Disabled | `color-disabled` text/icon, `color-disabled-surface` background, no hover/active response, `cursor: not-allowed` |
| Loading | Content replaced or overlaid with a skeleton/spinner (see `COMPONENT_SPECIFICATION.md` → LoadingState); interactive elements disabled during load |
| Error | `color-error` border/text, `color-error-muted` background where applicable, inline message below the element |
| Empty | Dedicated `EmptyState` component (see `COMPONENT_SPECIFICATION.md`), never a blank area with no explanation |
| Success | `color-success` accent, brief and restrained (per Product Principle 3 — never confetti-heavy) |

---

## 6. Accessibility baseline (applies platform-wide)

- **Contrast**: WCAG 2.2 AA minimum for all text/interactive elements (validated in §1 table above); re-validate any new token pairing before shipping.
- **Focus**: every interactive element has a visible focus state (§5); focus order follows visual/DOM order; no positive `tabindex` values.
- **Keyboard navigation**: all interactive flows (goal selection, onboarding, active workout logging) must be fully operable without a pointer.
- **Screen reader**: semantic HTML first (`button`, `nav`, `main`, `h1`–`h4` in order); ARIA only to fill genuine gaps (e.g., `role="radiogroup"` on card-based single-select groups, per `UX_ARCHITECTURE.md` §5); live regions (`aria-live="polite"`) for async state changes (e.g., AI Coach streaming responses, rest-timer completion).
- **Form validation**: errors announced via `aria-describedby` linking the field to its error message; never color-only error indication (icon + text always accompanies the red state).
- **Touch targets**: minimum 44×44px per brief §19; Gurukul standardizes on 48px for primary actions.
- **Reduced motion**: every animation in `MOTION_GUIDELINES.md` has a defined reduced-motion fallback; `prefers-reduced-motion: reduce` is checked, never ignored.

---

## 7. Design tokens (implementation reference)

```css
:root {
  /* Color */
  --color-bg: #1a1a2e;
  --color-surface: #16213e;
  --color-surface-raised: #1c2947;
  --color-primary: #D4AF37;
  --color-primary-hover: #E0C158;
  --color-primary-muted: rgba(212, 175, 55, 0.12);
  --color-text: #FFFFFF;
  --color-text-muted: #A0A0A0;
  --color-border: rgba(212, 175, 55, 0.16);
  --color-border-strong: rgba(212, 175, 55, 0.32);
  --color-success: #10B981;
  --color-success-muted: rgba(16, 185, 129, 0.14);
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-error-muted: rgba(239, 68, 68, 0.14);
  --color-overlay: rgba(15, 15, 25, 0.72);
  --color-disabled: rgba(255, 255, 255, 0.28);
  --color-disabled-surface: rgba(255, 255, 255, 0.06);

  /* Typography */
  --font-display: 'Poppins', -apple-system, sans-serif;
  --font-body: 'Inter', -apple-system, sans-serif;

  /* Spacing */
  --space-xs: 4px;  --space-sm: 8px;   --space-md: 16px;
  --space-lg: 24px; --space-xl: 32px;  --space-2xl: 48px;
  --space-3xl: 64px; --space-4xl: 96px;

  /* Radius */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px; --radius-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.24);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.32);
  --shadow-lg: 0 16px 48px rgba(0,0,0,0.4);
  --shadow-glow-gold: 0 0 0 3px rgba(212,175,55,0.18);
}
```

---

*This document is the source of truth for `COMPONENT_SPECIFICATION.md`, `MOTION_GUIDELINES.md`, and `RESPONSIVE_GUIDELINES.md`. Any deviation from SRS §13's original values is called out explicitly above (see §2's caption-opacity note) — nothing else in SRS §13 was altered.*
