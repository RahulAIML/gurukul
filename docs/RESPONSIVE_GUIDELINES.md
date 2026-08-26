# GURUKUL — Responsive Guidelines

**Status**: Baseline. Breakpoints per brief §17.

**Principle**: layouts are designed per range, not shrunk from desktop. Each breakpoint band below has an intentional layout, not a scaled-down copy of the one above it.

---

## 1. Breakpoint bands

| Width | Band | Representative devices |
|---|---|---|
| 360–389px | `xs` | Small Android phones |
| 390–429px | `sm` | Modern iPhones (standard) |
| 430–767px | `md-mobile` | Large phones (Pro Max class) |
| 768–1023px | `tablet` | iPad portrait, small tablets |
| 1024–1279px | `desktop-sm` | iPad landscape, small laptops |
| 1280–1439px | `desktop` | Standard laptops |
| 1440–1919px | `desktop-lg` | Large monitors |
| 1920px+ | `desktop-xl` | Wide/external monitors |

Tailwind mapping (SRS §4 confirms Tailwind CSS): `xs`/`sm`/`md-mobile` are the unprefixed (mobile-first) base; `md:` = 768px, `lg:` = 1024px, `xl:` = 1280px, `2xl:` = 1440px. 1920px+ is handled via `container-max` (1280px, `DESIGN_SYSTEM.md` §3) centering rather than a new breakpoint — content never stretches edge-to-edge on very wide screens.

---

## 2. Layout transformation rules (not just scaling)

### Navigation
- **< 1024px**: BottomNavigation (fixed, 5 items). Sidebar does not exist below this width — it is not "hidden," it's a genuinely different navigation pattern for touch-primary contexts.
- **≥ 1024px**: Sidebar (fixed left), BottomNavigation does not render.

### Landing page grids
- **< 768px**: single column throughout; card grids (Programs, Why Gurukul) become horizontal scroll-snap carousels where the content is inherently a set of peers (Programs), or stack vertically where it's sequential (How It Works steps).
- **768–1023px**: 2-column grids where content allows.
- **≥ 1024px**: 3–4 column grids per section (see `UX_ARCHITECTURE.md` §3).

### Onboarding
- **All widths**: one question per screen (never becomes a multi-question form at wider viewports — the guided, one-decision-at-a-time principle is width-independent, per `UX_ARCHITECTURE.md` §6).
- **≥ 768px**: content is centered in a fixed-width column (max 560px) rather than stretching full-width — full-width text/option lists on a wide screen would hurt readability and feel unintentional.

### Active Workout
- **< 768px**: full-screen, one exercise in focus, rest timer overlays.
- **≥ 768px**: same single-focus principle retained (this screen deliberately does NOT add a multi-column "see more exercises" layout at wider widths — the distraction-free intent, per `UX_ARCHITECTURE.md` §8, applies at every width). Available extra width is used for larger typography/tap targets and generous padding, not more simultaneous content.

### Dashboard
- **< 1024px**: single-column card stack, Today's Workout card first.
- **≥ 1024px**: two-column layout — Today's Workout + streak/stats as a primary column, secondary cards (AI nudge, recent progress) as a narrower side column. This is a genuine layout change, not just widening the single column, because at desktop width a single centered column of cards wastes horizontal space and under-uses the screen.

### AI Conversation
- **< 1024px**: full-screen chat, conversation list reached via back navigation.
- **≥ 1024px**: two-pane layout — conversation list (left, ~320px) + active thread (right), matching familiar chat-app conventions once there's room for it.

### Forms (Registration, Login, Onboarding free-text step)
- **All widths**: single-column field layout — form fields never go side-by-side, even at desktop widths, to keep scanning order unambiguous and match the "guided, not a form" feel end to end.

---

## 3. Touch targets & density

| Context | Minimum target | Density note |
|---|---|---|
| Mobile (< 768px) | 48px (Gurukul standard, exceeds the 44px accessibility floor per `DESIGN_SYSTEM.md` §6) | Generous spacing between tappable rows (min 8px gap) to prevent mis-taps |
| Tablet (768–1023px) | 48px | Slightly increased horizontal padding vs. mobile |
| Desktop (≥ 1024px) | 40px acceptable for dense UI (e.g., table-like Progress history rows) where mouse precision is assumed, but primary CTAs remain 48–52px regardless of input method | — |

---

## 4. Testing matrix

Every P0 screen (`UX_ARCHITECTURE.md` §2) must be verified at minimum at: 390px (`sm`), 768px (`tablet`), 1280px (`desktop`). The full 8-point list (360/390/430/768/1024/1280/1440/1920) is the target for the Landing Page and Dashboard specifically, since those carry the most layout complexity; other P0 screens are verified at the 3-point minimum unless a screen-specific responsive rule above says otherwise.

---

*Depends on `DESIGN_SYSTEM.md` §3 (spacing/grid tokens) and `UX_ARCHITECTURE.md` (per-screen mobile behavior notes, which this document formalizes into general rules).*
