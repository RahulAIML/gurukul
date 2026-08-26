# GURUKUL — Category Architecture

**Status**: Baseline. This is the concrete mechanism referenced by `SYSTEM_ARCHITECTURE.md` §3 and required by the brief's §25 ("this is critical").
**Goal**: define exactly how Gym is added without making the platform Gym-specific, and how English/Cricket are added later without a rewrite or a growing pile of `if (category === 'gym')` conditionals.

---

## 1. The core pattern

```
Category
   ↓
Category Configuration   ← a data record, not code, registered per category
   ↓
Domain Module             ← a self-contained code package (frontend feature + backend module)
   ↓
Domain Services            ← business logic, implements shared interfaces where the platform needs to call in
   ↓
Domain Models               ← Mongoose models scoped to that category
```

## 2. CategoryConfig — the contract

Every category, including Gym, registers itself via one config object. This is the *only* place the platform "knows" a category exists at a structural level; everything else is generic code operating on this config.

```typescript
// shared contract — lives in src/shared or equivalent
interface CategoryConfig {
  slug: string;                    // 'gym' — matches SRS §5 Categories.slug
  displayName: string;             // 'Gym'
  icon: string;
  status: 'active' | 'coming_soon';
  navEntries: NavEntry[];          // the 5 category-nav items (INFORMATION_ARCHITECTURE.md §3)
  onboarding: {
    steps: OnboardingStepDef[];    // UX_ARCHITECTURE.md §6's 6 steps, as data
    recommendationEngine: RecommendationEngine; // see §3 below
  };
  aiCoach: {
    personaId: string;             // references an AI Gateway persona, see AI_ARCHITECTURE.md
    contextBuilder: (userId: string) => Promise<CoachContext>;
  };
  routes: {
    publicBasePath: string;        // '/gym'
    appBasePath: string;           // '/app/gym'
  };
}
```

The **Category Engine** (a Shared Platform Service, per `SYSTEM_ARCHITECTURE.md` §3) holds a registry: `CategoryConfig[]`. Platform-level UI (category selector, category-agnostic nav shell, admin category list) reads this registry generically — it renders `config.displayName` and `config.icon`, it never contains a switch statement naming "Gym."

## 3. RecommendationEngine interface (closes DESIGN_PHASE_REVIEW.md D1)

Per the confirmed decision (rule-based for MVP), each category implements this interface however fits its domain — the platform only ever calls the interface, never a category-specific function directly:

```typescript
interface RecommendationEngine {
  recommend(answers: OnboardingAnswers): Promise<RecommendationResult>;
}
```

Gym's implementation is a deterministic lookup table: `{goal, fitnessLevel, equipment, daysPerWeek} → programId`, living entirely inside the Gym domain module (`src/features/gym/services/recommendationEngine.ts` on the frontend for instant preview, mirrored server-side as the source of truth at `POST /api/v1/onboarding/gym/recommend` — see `API_ARCHITECTURE.md`). English's future implementation could be a different shape entirely (e.g., a placement-test score → level mapping) — the platform's onboarding *flow* (progress indicator, step transitions, per `UX_ARCHITECTURE.md` §6) is shared; the *recommendation logic* is not, and doesn't need to be.

## 4. What "inherits platform but maintains independent logic" means concretely (SRS §3 Layer 2)

| Shared (platform provides, category consumes) | Independent (category owns entirely) |
|---|---|
| Onboarding *UI shell* (step transitions, progress bar, layout) | Onboarding *questions and answer types* per category |
| Auth, user session, profile storage | Domain-specific profile fields (Gym's `fitness_level` vs. a future English's `cefr_level`) — both live in the same `Profiles` collection (SRS §5) but only Gym code reads/writes `fitness_level` |
| AI Gateway (provider call, token budgeting, logging) | AI persona/prompt/context per category (`AI_ARCHITECTURE.md`) |
| Program/Course card UI component (`ProgramCard`, `COMPONENT_SPECIFICATION.md`) | Program/Course *content* and enrollment rules |
| Progress visualization *components* (ProgressCard, ProgressRing) | What counts as "progress" per category (workouts completed vs. lessons completed vs. drills logged) |
| Notification delivery mechanism | Notification *triggers and copy* per category |

## 5. Folder-level isolation (frontend)

Per SRS §7's feature-based structure, extended:

```
src/features/
  gym/                    ← everything Gym-specific
    components/           (GymOnly components, e.g., RestTimer, RepLogger)
    hooks/
    services/
    pages/
    config.ts              ← implements CategoryConfig for Gym
  english/                 ← does not exist yet; when it does, mirrors this shape
  auth/                    ← platform feature, not category
  user/                    ← platform feature, not category
  community/                ← platform feature, category-filtered by data, not by folder
```

Rule: nothing inside `src/features/gym/` is imported by platform code or by another category's folder. Shared visual components (Button, Card, GoalCard) live in `src/components/`, imported *by* category folders, never the reverse.

## 6. Folder-level isolation (backend)

Per SRS §8's layered structure, extended:

```
src/
  modules/
    gym/
      gym.routes.ts         ← mounted under /api/v1/gym/* by the category registry, not hardcoded in app.ts
      gym.controller.ts
      gym.service.ts         (implements RecommendationEngine, AI context builder)
      gym.repository.ts
      gym.model.ts            (Program, Workout, Exercise schemas — Gym-scoped)
    english/                 ← mirrors this shape when built
  platform/
    auth/
    users/
    notifications/
    ai-gateway/               ← generic provider abstraction; modules/gym/gym.service.ts calls into this, never the reverse
  categories.registry.ts      ← the CategoryConfig[] registry; app.ts mounts each module's routes by iterating this registry
```

`app.ts` never imports `gym.routes.ts` directly by name in a way that couples the app bootstrap to Gym specifically — it iterates `categories.registry.ts` and mounts each registered category's router under its `publicBasePath`/`appBasePath`. Adding English means adding an entry to the registry and a new `modules/english/` folder; it does not require touching `app.ts`'s logic (only its list of registered modules).

## 7. Adding English later — worked example

1. Create `src/modules/english/` (backend) and `src/features/english/` (frontend), mirroring Gym's shape.
2. Define `EnglishConfig: CategoryConfig` — new onboarding steps (e.g., "What's your current level?"), a new `RecommendationEngine` implementation (could be simple rules or a placement-test service), a new AI persona (`englishCoach`, registered in `AI_ARCHITECTURE.md`'s gateway).
3. Add `Category` document (`slug: 'english'`) to the `Categories` collection (SRS §5 — already schema-ready).
4. Register `EnglishConfig` in `categories.registry.ts`.
5. Platform code (category selector, nav shell, admin) requires **zero changes** — it already renders whatever's in the registry.
6. Shared components (GoalCard, ProgramCard, ProgressBar) are reused as-is or lightly re-themed via the category accent token pattern (`DESIGN_SYSTEM.md` §1) — no new component system needed unless English's UX genuinely requires a novel interaction (e.g., a pronunciation-recording widget), which would be a new category-owned component per `COMPONENT_SPECIFICATION.md`'s ownership note.

This is the concrete answer to "how do we add English or Cricket later without a giant conditional codebase" (brief §25): because nothing about English's existence is expressed as a conditional anywhere in platform code — it's expressed as a registry entry and a self-contained module.

---

*Depends on: `SYSTEM_ARCHITECTURE.md` §3, SRS §3/§5/§7/§8 (unchanged foundations). Feeds: `FRONTEND_ARCHITECTURE.md`, `BACKEND_ARCHITECTURE.md`, `API_ARCHITECTURE.md`, `AI_ARCHITECTURE.md`.*
