# GURUKUL — Component Specification

**Status**: Baseline. Depends on `DESIGN_SYSTEM.md` for all token references.

Each component below defines: variants, states (only those beyond the `DESIGN_SYSTEM.md` §5 baseline), behavior, accessibility, and responsive notes. Components not yet needed for Gym MVP screens (per `UX_ARCHITECTURE.md` P0/P1) are marked accordingly but still specified now so frontend work never blocks on a missing spec.

---

## Foundational

### Button
- **Variants**: `primary` (gold fill, black text), `secondary` (gold outline, gold text), `ghost` (no border, gold text), `destructive` (error-colored, for irreversible actions like "End Workout" / "Delete Account").
- **Sizes**: `sm` (36px height), `md` (44px), `lg` (52px, used for primary funnel CTAs).
- **States**: default/hover/active/focus/disabled/loading (spinner replaces label, width preserved to avoid layout shift).
- **Behavior**: `loading` state disables click; `disabled` never fires `onClick`.
- **Accessibility**: real `<button>`, `aria-busy="true"` while loading, `aria-disabled` mirrors `disabled`.
- **Responsive**: `lg` becomes full-width on mobile for primary funnel CTAs (Hero, Recommendation, Registration); `sm`/`md` remain intrinsic width.

### IconButton
- **Variants**: `default`, `ghost` (used in nav/toolbars).
- **Size**: 44×44px minimum hit area regardless of visual icon size (24px icon centered).
- **Accessibility**: mandatory `aria-label` — never icon-only with no accessible name.

### Input
- **Variants**: `text`, `email`, `password` (with visibility toggle), `number`, `textarea`.
- **States**: default/focus/error/disabled/filled.
- **Behavior**: label always visible (never placeholder-as-label); error message appears below on blur or submit attempt, not on every keystroke.
- **Accessibility**: `<label for>` bound explicitly; error linked via `aria-describedby`; `aria-invalid` set on error.

### Select
- Native `<select>` styled to match token system on desktop; on mobile, defers to native OS picker for better touch ergonomics (do not build a custom mobile dropdown unless a real need arises).

### Radio / Checkbox
- Custom-styled but backed by real `<input type="radio|checkbox">` for native semantics/keyboard support — never a `div`-based fake control.
- Selected state matches `DESIGN_SYSTEM.md` §5's selected styling (gold fill/border).

### Badge
- **Variants**: `neutral`, `success`, `warning`, `error`, `primary`.
- **Usage**: status labels (e.g., "Beginner," "3 sessions/week," notification counts). Never used as the sole indicator of an error state (always paired with text, not just a colored dot).

---

## Cards

### Card (base)
- **Anatomy**: `color-surface` background, `radius-md`, `card-padding`, `color-border` default border.
- **States**: default, hover (lift + `shadow-md` + `color-border-strong`), selected (gold border + `color-primary-muted` background).
- **Used as the base for**: GoalCard, ProgramCard, ProgressCard, StatCard below — those are Card + specific content, not separate visual systems.

### GoalCard
- Extends Card. Content: icon (top), label, one-line description, selected checkmark badge.
- Full interaction spec: `UX_ARCHITECTURE.md` §5.
- **Accessibility**: `role="radio"` within a `role="radiogroup"` container (Goal Selection is single-select).

### ProgramCard
- Extends Card. Content: program name, level badge, duration, short description, thumbnail (illustration/icon, not stock photography — see Design Direction guardrails).
- **Variants**: `compact` (Landing teaser, Discovery grid), `detailed` (Discovery with expanded metadata).

### ProgressCard
- Extends Card. Content: metric label, value, trend indicator (up/flat/down, color-coded via success/muted/warning — never error-red for a simple downward trend, which reads as alarming rather than informative).

### StatCard
- Extends Card, more compact than ProgressCard. Content: single number + label (e.g., "12 day streak"). Used in Dashboard's quick-stats row.

---

## Navigation

### Navbar (public)
- Sticky, transparent → `color-surface` background transition on scroll (per `UX_ARCHITECTURE.md` §3).
- Collapses to logo + hamburger below 768px.

### Sidebar (authenticated, desktop ≥ 1024px)
- Fixed left, 5 primary destinations only (Dashboard/Today/Programs/Progress/Coach — per `INFORMATION_ARCHITECTURE.md` §3), account menu (Profile/Settings/Notifications) at the bottom, separated visually.
- Active item: gold left-border accent + `color-primary-muted` background (matches SRS-derived active-nav pattern).

### BottomNavigation (authenticated, mobile/tablet < 1024px)
- Same 5 destinations as Sidebar, icon + label, fixed to viewport bottom, safe-area-aware (iOS notch/home-indicator padding).
- Account menu accessed via a 6th "More" entry or via an avatar tap that opens a sheet — **decision needed at implementation time**, not blocking this phase; default to avatar-in-topbar pattern (common, low-risk) unless UX testing suggests otherwise.

### Tabs
- Used within a screen (e.g., Programs: "My Programs" / "Discover"). Underline-style active indicator, gold.

### Breadcrumb
- Not used in MVP navigation depth (max 2 levels deep per `INFORMATION_ARCHITECTURE.md`) — omitted from MVP component set; revisit if navigation depth grows.

---

## Feedback & overlays

### Modal
- Centered, `color-surface-raised` background, `color-overlay` backdrop, `radius-lg`.
- **Behavior**: focus-trapped, `Escape` closes (unless the action is destructive-confirm, where explicit button tap is required), focus returns to the triggering element on close.
- **Used for**: destructive confirmations (End Workout, Delete Account), not for primary flows (Onboarding is NOT a modal — it's full-page, per `UX_ARCHITECTURE.md` §6).

### Drawer
- Slides from the side (desktop) or bottom (mobile, functions as a bottom-sheet). Used for: filter panels (Program Discovery on mobile), account menu on mobile if that pattern is chosen (see BottomNavigation note above).

### Toast
- Bottom-center (mobile) / bottom-right (desktop), auto-dismiss 4s (success/info) or persistent until dismissed (error), max one visible at a time (queue additional).
- **Accessibility**: `aria-live="polite"` (info/success) or `"assertive"` (error).

### Tooltip
- Hover/focus-triggered, short delay (400ms) before appearing, disappears immediately on blur/mouseleave. Never the sole carrier of essential information (supplementary only).

### ProgressBar
- Linear, used for: Onboarding step progress, workout completion percentage. `color-primary` fill on `color-border` track.

### ProgressRing
- Circular variant of ProgressBar, used for: Active Workout's rest timer, Dashboard streak visualization.

### Timeline
- Used in Progress screen for milestone history and in Program Details for phase/week breakdown.

---

## AI Coach components

### ChatMessage
- **Variants**: `user` (right-aligned, `color-primary-muted` bubble), `coach` (left-aligned, `color-surface` bubble, small coach avatar/mark).
- **States**: sent, streaming (animated text reveal, see `MOTION_GUIDELINES.md`), error (failed to send — retry affordance).

### ChatInput
- Fixed to bottom of AI Conversation screen, auto-growing textarea (max ~5 lines before internal scroll), send button disabled when empty.
- **Accessibility**: `Enter` sends, `Shift+Enter` newlines — standard chat convention.

---

## System states

### EmptyState
- **Anatomy**: icon/illustration (line-art, on-brand, never a generic stock "empty box" cliché), one-line message, optional CTA.
- **Used everywhere** a list/collection could be empty (Progress with no history, AI Coach with no conversations, Notifications with none) — per `DESIGN_SYSTEM.md` §5, never a bare blank area.

### LoadingState
- **Pattern**: skeleton screens matching the shape of the content being loaded (not a generic spinner) for primary content areas; a small inline spinner only for secondary/button-level loading.
- **Reduced-motion**: skeleton shimmer animation disabled, replaced with a static muted-fill placeholder.

### ErrorState
- **Pattern**: distinguishes between (a) inline field/action errors (handled by Input/Toast) and (b) page/section-level failures (network error loading Dashboard) — the latter uses a dedicated ErrorState component: icon, plain-language message (never a raw error code/stack to the user), "Retry" action.

---

## Component ownership note

Every component in this document is **platform-owned** (lives in the shared component library, `src/components/`), including GoalCard/ProgramCard/ProgressCard despite their Gym-flavored names — they are generic enough to be reused by English (e.g., ProgramCard → "Course Card" reuses the same component with different content) and Cricket. If a future category needs a genuinely different visual pattern a component here can't serve, that becomes a category-owned component inside that category's feature folder — not a modification to the shared one (see `FRONTEND_ARCHITECTURE.md` §4 and `CATEGORY_ARCHITECTURE.md`).

---

*Depends on: `DESIGN_SYSTEM.md` (tokens), `UX_ARCHITECTURE.md` (usage context). Feeds: `FRONTEND_ARCHITECTURE.md` component-folder structure.*
