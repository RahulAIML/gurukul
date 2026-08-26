# GURUKUL — Traceability Matrix

**Status**: Baseline. Answers brief §34 — maps requirement → journey → screen → component → frontend feature → API → service → database → test, for the Gym MVP's critical path.

---

## 1. Chain format

```
Product Requirement → User Journey Step → Screen → UI Component →
Frontend Feature → API Endpoint → Service → Database Collection → Test
```

## 2. Worked example (from the brief, confirmed and completed)

```
User selects fitness goal
        ↓
Goal Selection screen (UX_ARCHITECTURE.md §5)
        ↓
GoalCard (COMPONENT_SPECIFICATION.md → Cards)
        ↓
src/features/gym/ (FRONTEND_ARCHITECTURE.md §1) — Goal Selection page, session-local Zustand state
        ↓
POST /onboarding/gym/recommend (API_ARCHITECTURE.md §4) — called once all onboarding steps complete
        ↓
Gym's RecommendationEngine implementation (CATEGORY_ARCHITECTURE.md §3, ADR-004)
        ↓
Goals + Profile collections (DATABASE_ARCHITECTURE.md — written on /onboarding/gym/complete after registration)
        ↓
E2E: "first-time funnel" journey test (TESTING_STRATEGY.md §1) + unit tests on RecommendationEngine
```

## 3. Full traceability table — first-time funnel (P0 critical path)

| Requirement | Journey step | Screen | Key component(s) | Frontend feature | API | Service | DB collection(s) | Test level |
|---|---|---|---|---|---|---|---|---|
| Discover categories | Home → Choose Gym | Gurukul Home, Category Selection | Card (base) | `src/features/*` (platform) | `GET /categories` | CategoryService | `Categories` | E2E, API |
| Understand Gym's value | Gym Landing → Understand Value | Gym Landing | Card, Button, Accordion (FAQ) | `src/features/gym/` | `GET /categories/gym` | CategoryService | `Categories` | Component, API |
| Select a goal | Select Goal | Goal Selection | GoalCard | `src/features/gym/` | — (session-local) | — | — (session-local, no DB write yet) | E2E, Component |
| Complete onboarding | Start Personalization → Fitness Onboarding | Fitness Onboarding (6 steps) | Radio/Checkbox-backed step cards, ProgressBar | `src/features/gym/` | `POST /onboarding/gym/recommend` | Gym `RecommendationEngine` | — (session-local until registration) | E2E, Unit (engine), API |
| Receive a personalized recommendation | Recommendation | Recommendation Result | ProgramCard, Badge | `src/features/gym/` | `POST /onboarding/gym/recommend` | Gym `RecommendationEngine` | `Programs` (read) | E2E, Unit |
| Create an account | Register | Registration | Input, Button | `src/features/auth/` (platform) | `POST /auth/register` | AuthService | `Users`, `Profiles` | E2E, API, Integration |
| Persist onboarding answers | (post-registration) | — (background call) | — | `src/features/gym/` | `POST /onboarding/gym/complete` | Gym OnboardingService | `Goals`, `Profiles`, `Programs` (enrollment) | Integration, API |
| Land in a personalized dashboard | Gym Dashboard | Gym Dashboard | StatCard, ProgressRing, GoalCard (list), ProgramCard (carousel) | `src/features/gym/` | `GET /workouts/today`, `GET /progress`, `GET /goals` | GymDashboardService | `Goals`, `Progress`, `Programs` | E2E, Component |
| Start first workout | Start Program | Today's Workout → Active Workout | Timer/ProgressRing, RepLogger (category-owned) | `src/features/gym/` | `GET /workouts/today`, `POST /progress/session` | WorkoutService | `Workouts`, `Progress` | E2E, Integration, API |
| Log workout completion | (loop closes) | Workout Completion | Badge, success motion (`MOTION_GUIDELINES.md`) | `src/features/gym/` | `POST /progress/session` | WorkoutService | `Progress` | E2E, API |

## 4. Cross-cutting requirements (not journey-step-specific)

| Requirement | Where enforced | Test level |
|---|---|---|
| Users can only access their own data | Service layer, every query scoped to authenticated `user_id` (`SECURITY_ARCHITECTURE.md` §2/§5) | API (IDOR test cases), Integration |
| Passwords securely hashed | AuthService, bcrypt 12 rounds (SRS §9) | Unit, Integration |
| Rate limiting on auth endpoints | Middleware (`SECURITY_ARCHITECTURE.md` §6) | API |
| WCAG 2.2 AA on all P0 screens | `DESIGN_SYSTEM.md` §6, enforced via `jest-axe` + manual pass | Accessibility |
| Category-blind platform core | `CATEGORY_ARCHITECTURE.md` (structural — verified by code review against the ownership table in §5–6, not a runtime test) | Code review gate (Development Gate 4/6) |
| AI cost bounded | AI Gateway token budget (`AI_ARCHITECTURE.md` §5) | Integration (once built, Phase 7) |

## 5. Screens without a traceability row above

P1/P2 screens (Programs list, Progress, Goals edit, AI Coach, Profile, Settings, Notifications, and all P2 screens) follow the same chain pattern but are not enumerated row-by-row here to avoid padding this document with mechanical repetition — each is fully specified in `UX_ARCHITECTURE.md` §8–9, and its API/DB mapping is already fully specified in `API_ARCHITECTURE.md`/`DATABASE_ARCHITECTURE.md`. This matrix's purpose is to prove the traceability *pattern* holds end-to-end on the critical path; extending it mechanically to every P1/P2 screen is a roadmap-phase task (done as each phase's screens are actually built, per `ROADMAP.md`), not a design-phase deliverable.

---

*Depends on every document referenced in the table above. This is the single document a developer should check to confirm "does this screen's data actually have a place to live and an endpoint to reach it" before writing code.*
