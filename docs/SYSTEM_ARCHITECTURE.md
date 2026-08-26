# GURUKUL — System Architecture

**Status**: Baseline. Refines SRS §3–4 into a professional, implementable architecture. Tech stack itself is unchanged from SRS §4 (DECIDED, see `DESIGN_PHASE_REVIEW.md` §3).

---

## 1. High-level architecture

```
                              GURUKUL PLATFORM
                                     │
                    ┌────────────────┴────────────────┐
                    │      SHARED PLATFORM SERVICES     │
                    │  Auth · Users · Notifications ·   │
                    │  Payments · Analytics · Search ·  │
                    │  Media · Community(fnd) · Admin · │
                    │  Feature Flags · CMS · AI Gateway │
                    └────────────────┬────────────────┘
                                     │
                              CATEGORY ENGINE
                     (CategoryConfig registry + contracts —
                      see CATEGORY_ARCHITECTURE.md)
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
             GYM                 ENGLISH               CRICKET
        (built, MVP)          (conceptual only)     (conceptual only)
              │
    ┌─────────┴─────────┐
    │  DOMAIN FEATURES   │
    │  Programs·Workouts │
    │  Exercises·1RM·    │
    │  Progress·AI Coach │
    └─────────────────────┘
```

**How this differs from the SRS diagram (SRS §3)**: the SRS diagram showed Gym → Fitness Domain as a single arrow. This refinement makes explicit that Gym itself is one *instance* of a Category, registered through a common Category Engine contract — not a special-cased branch of platform code. This is the concrete mechanism that closes gap R1 from `DESIGN_PHASE_REVIEW.md`. Full detail in `CATEGORY_ARCHITECTURE.md`.

## 2. Client/server topology

```
Browser (React SPA, Vite build)
   │  HTTPS/TLS 1.3
   ▼
Vercel Edge (static assets, CDN)
   │
   ▼
API — Node.js/Express (Render/Railway, containerized)
   │
   ├──► MongoDB Atlas (primary data store)
   ├──► Cloudinary (media)
   ├──► Anthropic Claude API (AI Gateway → per-category coaches)
   ├──► Stripe (payments — post-MVP)
   ├──► Nodemailer/SMTP (transactional email)
   └──► PostHog / Sentry / OpenTelemetry (observability)
```

This matches SRS §10 exactly (DECIDED) — restated here as the anchor diagram the other architecture documents build on.

## 3. Three architectural layers, defined precisely

| Layer | Responsibility | Must NOT contain |
|---|---|---|
| **Shared Platform Services** | Anything true regardless of category: identity, notifications, payments, analytics collection, media handling, search, moderation tooling, admin shell, feature flagging, AI Gateway (provider abstraction only, not coach personas), CMS primitives | Any field, endpoint, or UI string naming a specific category's domain vocabulary ("workout," "lesson," "match") |
| **Category Engine** | The registry and contract layer: what a category *is* (config, routes, nav entries, onboarding schema, AI persona reference), independent of Gym/English/Cricket specifics | Business logic itself — the engine hosts and dispatches to categories, it doesn't implement any one category's rules |
| **Domain-Specific Features** | Gym's actual behavior: programs, workouts, exercises, 1RM tracking, Gym's onboarding questions, Gym's AI Coach prompt/context | Anything another category would need to duplicate wholesale — if English would need an identical copy-pasted version of a Gym file, that file likely belongs one layer up |

## 4. Cross-cutting concerns and where they live

| Concern | Owner |
|---|---|
| Authentication/session | Shared Platform Services (SRS §9) |
| Authorization/RBAC | Shared Platform Services, but category modules can declare category-scoped permission checks (e.g., "must have an active Gym enrollment to log a session") that the shared middleware executes generically |
| Rate limiting | Shared Platform Services (global) + AI Gateway (per-category token budgets, see `AI_ARCHITECTURE.md`) |
| Validation | Each layer validates its own inputs (Zod schemas live next to the routes/forms they validate — not centralized into one giant schema file) |
| Logging/observability | Shared Platform Services (Winston/Sentry/OpenTelemetry wiring), but log *events* are emitted from wherever the action occurs, category code included |
| Error handling | Shared error-handling middleware (backend) / error boundary components (frontend) at the platform level; category code throws typed errors, doesn't format responses itself |

## 5. Why this refinement matters (traceability to SRS §14 risk)

SRS §14 names "Category Expansion Complexity" as a MEDIUM/HIGH risk, mitigated by "domain-driven design, clear API contracts, docs." This document and `CATEGORY_ARCHITECTURE.md` are that mitigation made concrete — without a defined `CategoryConfig` contract, "domain-driven design" is just a phrase; with it, adding English later is a data-and-module-registration exercise, not a platform rewrite.

---

*Feeds: `FRONTEND_ARCHITECTURE.md`, `BACKEND_ARCHITECTURE.md`, `CATEGORY_ARCHITECTURE.md`. Tech stack source: SRS §4 (unchanged).*
