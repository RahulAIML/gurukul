# GURUKUL — Frontend Architecture

**Status**: Baseline. Extends SRS §7 (folder structure, state split — both DECIDED, unchanged) with layer responsibilities the SRS didn't spell out.

---

## 1. Layer structure

```
React Application
│
├── App Shell            — router mount, global providers (QueryClient, auth context), layout shell selection (public vs. authenticated)
├── Routing              — React Router v6, route table maps to INFORMATION_ARCHITECTURE.md's site map
├── Design System         — tokens (DESIGN_SYSTEM.md), Tailwind config, base primitives
├── Shared Components     — COMPONENT_SPECIFICATION.md's component library (src/components/)
├── Platform Features     — auth, user, community(fnd), notifications (src/features/{auth,user,notifications}/)
│
└── Category Features
    └── gym (src/features/gym/) — per CATEGORY_ARCHITECTURE.md §5
```

## 2. Where things belong

| Concern | Belongs in | Reasoning |
|---|---|---|
| **Server state** (programs, workouts, progress, AI conversations — anything the backend owns) | TanStack Query (SRS §7, DECIDED) | Auto-caching, background refetch, and race-condition prevention are exactly what this data needs; reinventing this with Zustand would duplicate what the library already solves |
| **Client/UI state** (auth session shape, active modal, filter selections, onboarding-in-progress answers before submission) | Zustand (SRS §7, DECIDED) | Ephemeral, not server-owned, doesn't need cache invalidation semantics |
| **API calls** | `src/services/` (or `src/features/{x}/services/` for category/feature-scoped calls) — thin functions wrapping `fetch`/axios, called *by* TanStack Query hooks, never called directly from components | Keeps components free of transport concerns; a service function is the single place that knows an endpoint's URL/shape |
| **Business logic** (e.g., Gym's client-side recommendation preview, form-to-API payload shaping) | `src/features/{x}/services/` or category-scoped hooks — never inside a component body | Testable in isolation, reusable across screens (e.g., Onboarding's live preview vs. the final submit use the same recommendation logic) |
| **UI logic** (open/close a drawer, which step is active, local form validation state) | Component-local `useState` or a small local hook — does not need Zustand unless genuinely shared across distant components | Avoids over-centralizing state that has no reason to leave one screen |
| **Shared components** | `src/components/` — platform-owned, category-agnostic (per `CATEGORY_ARCHITECTURE.md` §5's isolation rule) | — |
| **Category-specific code** | `src/features/{category}/` — isolated per `CATEGORY_ARCHITECTURE.md` §5; never imported by platform code or other categories | — |

## 3. Routing structure (React Router v6)

Route table mirrors `INFORMATION_ARCHITECTURE.md`'s site map directly. Two top-level layouts:

- **PublicLayout**: Navbar + Footer chrome, wraps Home/Categories/Gym-public/Auth routes.
- **AppLayout**: Sidebar (≥1024px) / BottomNavigation (<1024px) chrome, wraps everything under `/app/*`; enforces auth via a route guard (redirects to `/auth/login` if no valid session, preserving the intended destination for post-login redirect).

Category routes are **not hand-written per category** in the route table — the route table iterates the `CategoryConfig` registry (`CATEGORY_ARCHITECTURE.md` §2) to mount each category's public and app routes at its configured `publicBasePath`/`appBasePath`. Lazy code-splitting (SRS §4) is applied per category feature folder, so an unvisited category's bundle is never downloaded.

## 4. Data flow (confirms and extends SRS §7's stated chain)

```
UI (component)
   ↑ reads/dispatches
Zustand (client state) ←──────┐
   ↑ reads                     │ both feed component render
TanStack Query (server state) ─┘
   ↑ fetches via
services/ (API client functions)
   ↑ calls
Backend API (see API_ARCHITECTURE.md)
```

A component never calls `fetch` directly, never imports a service function from another feature's folder, and never holds server data in `useState`/Zustand as a substitute for TanStack Query's cache.

## 5. Form handling

React Hook Form + Zod (SRS §4, DECIDED). Pattern: one Zod schema per form, colocated with the form component; the same schema (or a derived subset) mirrors server-side validation (`BACKEND_ARCHITECTURE.md` §4) so client and server never silently disagree on what's valid.

## 6. Component composition rule

Screens (`src/features/{x}/pages/`) compose from `src/components/` (shared) and `src/features/{x}/components/` (category-owned) — a page file itself contains layout and data-wiring, not new visual primitives. This keeps `UX_ARCHITECTURE.md`'s screen specs directly traceable to code: one screen spec → one page file → a composition of documented components.

---

*Depends on: SRS §4/§7 (unchanged), `CATEGORY_ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `COMPONENT_SPECIFICATION.md`. Feeds: `TRACEABILITY.md`.*
