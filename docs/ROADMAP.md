# GURUKUL — 8-Month Implementation Roadmap

**Status**: Baseline. Implements `ADR-001` (SRS §12's phase content stretched to 8 months, Phase 0 design gate inserted — here folded into Phase 1 itself, matching the brief's own phase numbering). Total: ~35 weeks (~8 months).

---

## Phase overview

| Phase | Weeks | Focus |
|---|---|---|
| 1 | 1–5 | Design + Architecture (this package) |
| 2 | 6–9 | Design System + Frontend Foundation |
| 3 | 10–14 | Gym Landing + Onboarding |
| 4 | 15–18 | Authentication + Backend |
| 5 | 19–24 | Programs + Workouts |
| 6 | 25–28 | Progress + Personalization |
| 7 | 29–32 | AI + Platform Features |
| 8 | 33–35 | Polish + QA + Launch |

---

## Phase 1 — Design + Architecture (Weeks 1–5)

**Objectives**: Produce the complete Design + System Architecture package (this document set); resolve every conflict/ambiguity between the SRS and the new brief explicitly (no silent decisions); establish the design system, component specs, and full system/category/API/database architecture developers can build against without re-deciding fundamentals mid-sprint.

**Deliverables**: All documents in `docs/` produced in this phase (`PRODUCT_VISION.md` through `ROADMAP.md`, the `ADR/` log, `TRACEABILITY.md`).

**Dependencies**: SRS v1.0 (complete, read in full — `DESIGN_PHASE_REVIEW.md`).

**Acceptance criteria (= Gate 1 + Gate 2 + Gate 3 + Gate 4, see below)**: every question in `PRODUCT_VISION.md` §6's checklist is answerable from the documentation alone; every SRS conflict is either resolved-and-confirmed or explicitly still open (none silently resolved); the design system's palette/type/spacing are locked; the Category Architecture's `CategoryConfig` contract is defined precisely enough that a developer could register a second category without asking "how."

---

## Phase 2 — Design System + Frontend Foundation (Weeks 6–9)

**Objectives**: Stand up the actual codebase skeleton implementing this phase's architecture — not feature work yet, foundation only.

**Deliverables**:
- Repository scaffolding matching `FRONTEND_ARCHITECTURE.md` and `BACKEND_ARCHITECTURE.md`'s folder structures (SRS §7/§8).
- Tailwind config with every token from `DESIGN_SYSTEM.md` §7 wired in.
- Shared component library (`COMPONENT_SPECIFICATION.md`'s foundational components: Button, Input, Card, Badge, Modal, Toast, EmptyState, LoadingState, ErrorState) built and unit/component-tested.
- CI/CD pipeline live (`INFRASTRUCTURE_ARCHITECTURE.md` §3) — lint/type-check/unit-test/build gates enforced from the first real PR.
- `CategoryConfig` interface + registry mechanism implemented (empty/stub — no Gym content yet), proving the pattern before Gym-specific code is written on top of it.

**Dependencies**: Phase 1 complete and approved (Gate 4).

**Acceptance criteria**: a new component can be added following `COMPONENT_SPECIFICATION.md` without inventing new patterns; CI blocks a PR that fails lint/type-check/tests; the category registry can host a stub category end-to-end (route mounts, nav entry renders) with zero Gym-specific code written yet.

---

## Phase 3 — Gym Landing + Onboarding (Weeks 10–14)

**Objectives**: Build the full public funnel per `GYM_USER_JOURNEYS.md` §1 and `UX_ARCHITECTURE.md` §3–7 — Landing, Goal Selection, Onboarding (6 steps), Recommendation Result. No backend persistence required yet beyond what Phase 4 provides — recommendation logic runs client-side against the rule-based engine (`ADR-004`) using seeded program data.

**Deliverables**: Gym Landing (all sections per `UX_ARCHITECTURE.md` §3), Goal Selection, 6-step Onboarding, Recommendation Result — all responsive per `RESPONSIVE_GUIDELINES.md`, motion per `MOTION_GUIDELINES.md`, accessible per `DESIGN_SYSTEM.md` §6.

**Dependencies**: Phase 2's component library; seed data for at least 3–4 real Gym programs (content work, tracked as a dependency but not a Phase 3 engineering task).

**Acceptance criteria**: the full funnel is navigable and visually complete end-to-end without a real backend (mocked/seeded data acceptable); Lighthouse budget met on Landing (`TESTING_STRATEGY.md` §1); accessibility pass on all four screens.

---

## Phase 4 — Authentication + Backend (Weeks 15–18)

**Objectives**: Build the real backend per `BACKEND_ARCHITECTURE.md`/`API_ARCHITECTURE.md`/`DATABASE_ARCHITECTURE.md`, starting with Auth (SRS §9, unchanged) and the endpoints Phase 3's funnel needs to persist onboarding results on registration.

**Deliverables**: `/auth/*` endpoints (register, login, refresh, logout, verify-email, password-reset), `/onboarding/gym/*` endpoints (server-side mirror of the recommendation engine), `Users`/`Profiles`/`Goals` collections live, Registration and Login screens wired to real endpoints, Phase 3's funnel now persists onboarding answers on account creation (`GYM_USER_JOURNEYS.md` §1's abandonment/persistence rules implemented for real).

**Dependencies**: Phase 3's screens (Registration/Login UI); MongoDB Atlas dev/staging clusters provisioned (`INFRASTRUCTURE_ARCHITECTURE.md` §2).

**Acceptance criteria**: full first-time-funnel E2E test (`TESTING_STRATEGY.md` §1) passes against a real (test) database; auth security checklist (`SECURITY_ARCHITECTURE.md` §1/§6) verified; a registered user's onboarding answers are correctly persisted and readable.

---

## Phase 5 — Programs + Workouts (Weeks 19–24)

**Objectives**: Build the authenticated Gym core loop — Dashboard, Today's Workout, Workout Details, Exercise Details, Active Workout, Workout Completion, Programs, Program Details (authenticated view) — per `UX_ARCHITECTURE.md` §8.

**Deliverables**: All screens above, `/programs/*`, `/workouts/*`, `/exercises/*`, `/progress/session` endpoints, `Programs`/`Workouts`/`Exercises`/`Progress` collections live, Sidebar/BottomNavigation shell (per `ADR-010`'s adopted nav pattern) wired for the authenticated app shell.

**Dependencies**: Phase 4's auth; a meaningful content catalogue (multiple programs/workouts/exercises — content production tracked as a parallel, non-engineering dependency).

**Acceptance criteria**: returning-user-loop E2E test (`GYM_USER_JOURNEYS.md` §2, `TESTING_STRATEGY.md` §1) passes; a user can complete a full onboarding→enrollment→workout→completion cycle with real persistence; Active Workout's distraction-free mode (no nav chrome, no Coach access — `UX_ARCHITECTURE.md` §8) verified.

---

## Phase 6 — Progress + Personalization (Weeks 25–28)

**Objectives**: Build Progress, Goals (edit flow), and the Dashboard's Progress/streak visualizations for real (Phase 5 shipped the logging mechanism; this phase makes the resulting data visible and meaningful).

**Deliverables**: Progress screen (charts, streak history, milestones), Goals screen (view/edit, re-entering a shortened onboarding), `GET /progress` and `GET/POST/PUT /goals` endpoints fully implemented against real historical data, Dashboard's ProgressRing/StatCard/Goals-list populated with live data (replacing Phase 5's placeholder/seed values where applicable).

**Dependencies**: Phase 5's `Progress` collection accumulating real session data (even from internal testing/QA usage).

**Acceptance criteria**: a user with workout history sees accurate, correctly-computed streaks and progress trends; empty-state handling (`COMPONENT_SPECIFICATION.md` → EmptyState) verified for new users with no history yet.

---

## Phase 7 — AI + Platform Features (Weeks 29–32)

**Objectives**: Implement the AI Gateway and Gym Coach persona per `AI_ARCHITECTURE.md` (design-only until now, per brief §27's original instruction); build AI Coach and AI Conversation screens; build the remaining platform-level screens (Profile, Settings, Notifications).

**Deliverables**: AI Gateway (provider abstraction, token budgeting, per `AI_ARCHITECTURE.md` §2/§5), `gymCoach` persona, `/ai/*` endpoints, AI Coach + AI Conversation screens (streaming chat UI per `COMPONENT_SPECIFICATION.md`'s ChatMessage/ChatInput), Profile/Settings/Notifications screens and their endpoints.

**Dependencies**: Phase 5/6's user data (the Coach's context-builder reads program/progress/goal data that must already exist and be reliable).

**Acceptance criteria**: AI Coach responds with context-aware guidance (not generic chatbot output) in manual QA review against the persona's intended tone (`AI_ARCHITECTURE.md` §3); daily cost/rate limits verified functional (`SECURITY_ARCHITECTURE.md` §6, `AI_ARCHITECTURE.md` §5); graceful-degradation message shown correctly when the cap is hit.

---

## Phase 8 — Polish + QA + Launch (Weeks 33–35)

**Objectives**: Full cross-device/browser QA, accessibility audit, security review against `SECURITY_ARCHITECTURE.md`'s threat model, performance tuning, production launch.

**Deliverables**: Full `RESPONSIVE_GUIDELINES.md` §4 testing matrix executed on all P0 screens; full accessibility pass (WCAG 2.2 AA) on all P0/P1 screens; security review (`SECURITY_ARCHITECTURE.md` §5 threat model walked item-by-item); load testing against expected launch traffic; production deployment per `INFRASTRUCTURE_ARCHITECTURE.md` §5.

**Dependencies**: All prior phases feature-complete.

**Acceptance criteria**: Gate 8 (below) satisfied; zero known critical/high security findings; Core Web Vitals within Lighthouse budget on Landing and Dashboard; production health check green post-deploy.

---

## Development Gates (brief §36, mapped to phases above)

| Gate | Satisfied at end of | Criteria |
|---|---|---|
| **Gate 1 — Product Architecture Approved** | Phase 1 | `PRODUCT_VISION.md`, `INFORMATION_ARCHITECTURE.md`, `GYM_USER_JOURNEYS.md` complete and reviewed; every SRS conflict resolved-and-confirmed (`DESIGN_PHASE_REVIEW.md`) |
| **Gate 2 — Design System Approved** | Phase 1 | `DESIGN_SYSTEM.md`, `COMPONENT_SPECIFICATION.md`, `MOTION_GUIDELINES.md`, `RESPONSIVE_GUIDELINES.md` complete; palette/type/spacing locked (`ADR-002`) |
| **Gate 3 — Gym UX Approved** | Phase 1 | `UX_ARCHITECTURE.md` complete for all P0 screens; Hero direction selected (`ADR` reconfirmation post-reference-image, see `ADR-010`) |
| **Gate 4 — System Architecture Approved** | Phase 1 | `SYSTEM_ARCHITECTURE.md`, `CATEGORY_ARCHITECTURE.md`, `FRONTEND_ARCHITECTURE.md`, `BACKEND_ARCHITECTURE.md`, `DATABASE_ARCHITECTURE.md`, `API_ARCHITECTURE.md`, `SECURITY_ARCHITECTURE.md` complete |
| **Gate 5 — Frontend Foundation** | Phase 2 | Component library built/tested; CI/CD live; category registry proven with a stub category |
| **Gate 6 — Backend Integration** | Phase 4 | Auth + onboarding-persistence endpoints live and tested; first-time-funnel E2E passes against real DB |
| **Gate 7 — Core Gym Product** | Phase 6 | Full onboarding→enrollment→workout→progress loop functional with real data; returning-user-loop E2E passes |
| **Gate 8 — Production QA** | Phase 8 | All Phase 8 acceptance criteria met; sign-off to deploy |

**Rule (brief §36)**: no phase begins its engineering work before its dependency phase's gate is satisfied. A gate is not re-opened once passed without a new ADR documenting why (matches `SYSTEM_ARCHITECTURE.md`'s general principle of explicit, traceable decisions).

---

## Explicitly out of scope for this 8-month roadmap

Per `DESIGN_PHASE_REVIEW.md` §6 and SRS §11 "NOT IN MVP": English, Cricket, and all future categories (architecture only, no build); Community, Challenges; Subscription/Payments UI (schema-ready, Stripe integration is a post-Phase-8 task if/when monetization is prioritized); native mobile apps; AR form correction; wearable integrations; full Admin CMS.

---

*Depends on: `ADR-001`, every architecture document referenced above. This is the single document answering "what do we build first, second, and third" (`PRODUCT_VISION.md` §6).*
