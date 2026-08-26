# GURUKUL — Testing Strategy

**Status**: Baseline. Answers brief §32's level-by-level breakdown, scoped realistically to an 8-month, small-team roadmap (not a maximal enterprise test pyramid).

---

## 1. Levels and what they cover

| Level | Tooling | What's tested | Owned by |
|---|---|---|---|
| **Unit** | Vitest (frontend), Jest (backend) | Pure logic: `RecommendationEngine` implementations (`CATEGORY_ARCHITECTURE.md` §3), Zod validators, service-layer business rules, utility functions | Every service/utility with non-trivial logic; repositories are mocked, not tested against a real DB at this level |
| **Component** | Vitest + React Testing Library | Individual components from `COMPONENT_SPECIFICATION.md` in isolation — states (default/hover/error/loading/etc. per `DESIGN_SYSTEM.md` §5), accessibility (via `jest-axe` or equivalent), keyboard interaction | Every shared component (`src/components/`); category-owned components tested where they carry real logic (e.g., a RepLogger's set-completion behavior), not for purely presentational ones |
| **Integration** | Vitest/Jest, real (test) MongoDB instance | Controller → Service → Repository chains for a given feature (e.g., "enrolling in a program updates both the enrollment record and the user's active program pointer correctly") | Backend feature modules, particularly cross-collection flows (onboarding completion writing to Goals + Profile + Programs) |
| **API** | Supertest (or equivalent) against a running test server | Full HTTP contract per `API_ARCHITECTURE.md`: status codes, response shapes, auth enforcement, validation errors | Every endpoint in `API_ARCHITECTURE.md`, at minimum the happy path + the documented error cases |
| **E2E** | Playwright | Full user journeys per `GYM_USER_JOURNEYS.md`: first-time funnel (Home → Goal Selection → Onboarding → Recommendation → Register → Dashboard) and the returning-user loop (Login → Today's Workout → Active Workout → Completion) | The two journeys above are the mandatory E2E suite for MVP; additional flows (AI Coach conversation, Progress viewing) added once those screens are built, not before |
| **Accessibility** | `jest-axe` (component level) + manual keyboard-only pass + Playwright + axe-core (E2E level) on P0 screens | WCAG 2.2 AA per `DESIGN_SYSTEM.md` §6 — contrast, focus order, semantic structure, screen-reader labeling | Every P0 screen (`UX_ARCHITECTURE.md` §2) at minimum once before its roadmap phase closes |
| **Performance** | Lighthouse CI (frontend), basic load testing (backend, e.g., k6) against staging | Core Web Vitals on Landing/Dashboard (highest-traffic screens), API response time under expected concurrent load | Landing Page and Dashboard get Lighthouse budgets enforced in CI; backend load testing is a pre-launch (Phase 8) activity, not continuous, at this scale |
| **Security** | `npm audit` in CI (per `INFRASTRUCTURE_ARCHITECTURE.md` §4), manual review against `SECURITY_ARCHITECTURE.md`'s threat model before launch | Dependency vulnerabilities (continuous), auth/IDOR/rate-limit behavior (manual test pass pre-launch, automated where practical as API tests — e.g., "requesting another user's Progress returns 403/404, not their data") | Continuous (dependency audit) + a dedicated pre-launch security pass (Phase 8, per `ROADMAP.md`) |

## 2. What's deliberately not built as a separate practice

- **Visual regression testing** (e.g., Chromatic/Percheck) — not adopted for MVP. The design system's token discipline (`DESIGN_SYSTEM.md`) reduces the drift risk this normally catches; revisit if the component library grows large enough that manual review becomes unreliable.
- **Mutation testing** — not adopted; the unit/integration coverage above is judged sufficient for this team size without adding mutation-testing tooling overhead.
- **Contract testing between frontend/backend** (e.g., Pact) — not adopted; `API_ARCHITECTURE.md`'s explicit endpoint specs plus API-level tests against those specs serve the same purpose at far lower setup cost for a single-team, monorepo-adjacent project.

## 3. Coverage philosophy

No blanket percentage target is set (e.g., "80% coverage") as a goal in itself — coverage is a signal, not a target, and chasing a number invites low-value tests. Instead: every service with business logic has unit tests for its branches (especially the `RecommendationEngine`, given it's the funnel's conversion hinge per `GYM_USER_JOURNEYS.md`), every P0 API endpoint has at least a happy-path + primary-error-case API test, and the two mandatory E2E journeys must pass before any production tag ships (a CI gate, per `INFRASTRUCTURE_ARCHITECTURE.md` §3).

## 4. Test data

Integration/API tests run against a dedicated test database (not staging/production), seeded per-test-run and torn down after — never sharing state with the staging environment QA uses manually.

---

*Depends on: `COMPONENT_SPECIFICATION.md`, `API_ARCHITECTURE.md`, `GYM_USER_JOURNEYS.md`, `SECURITY_ARCHITECTURE.md`, `INFRASTRUCTURE_ARCHITECTURE.md` §3–4. Feeds: `ROADMAP.md` (per-phase acceptance criteria), Development Gates.*
