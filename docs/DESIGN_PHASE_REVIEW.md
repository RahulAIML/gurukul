# GURUKUL — Design Phase Review

**Status**: Draft for approval
**Purpose**: Gap analysis between the existing SRS (v1.0, Aug 2024) and the newly requested Design + System Architecture Phase. This document must be resolved before the full package (UI/UX architecture, system architecture, roadmap) is built out, because several items below change the shape of that package.

---

## 1. How to read this document

Every item is tagged:

- **DECIDED** — SRS already answers this. We follow it. Not up for silent debate.
- **NEEDS REFINEMENT** — SRS states a direction but not enough detail to hand to a developer. This phase must fill the gap.
- **NEEDS DECISION** — SRS is silent or ambiguous. A real choice must be made and recorded (as an ADR).
- **CONFLICT** — SRS says one thing; the new brief implies another. Flagged explicitly below — **I have not resolved these silently.**
- **POSTPONED** — Legitimately out of scope for this phase or for the Gym MVP.
- **RISK** — Architectural risk worth naming now even if no action is needed yet.

---

## 2. CONFLICTS (resolve these first — they change the shape of everything else)

### CONFLICT 1 — Timeline: 14 weeks (SRS) vs. 8 months (this brief)

- **Existing decision (SRS §12)**: A 14-week roadmap taking Gym from landing page to a launched, paid product (Weeks 1–2 landing, 3–4 auth/onboarding, 5–7 programs, 8–9 progress, 10 AI coach, 11 payments, 12–13 polish, 14 QA/launch).
- **New brief**: "We have approximately 8 months to build Gurukul," with an explicit Design + System Architecture phase preceding implementation, and a screen inventory (30 screens) far larger than the SRS's MVP scope (§11: landing + auth + onboarding only; English/Cricket, community, AI depth, admin explicitly **NOT IN MVP**).
- **Reason this matters**: These are not compatible schedules for the same scope. 14 weeks assumes a lean MVP with AI coach and payments landing in weeks 10–11 with no dedicated design phase. 8 months assumes a full pre-implementation design/architecture pass plus a much larger authenticated product (dashboard, active workout flow, AI conversation UI, profile/settings/notifications, etc.) before the same features ship.
- **Consequence if unresolved**: The roadmap in Part B of this package cannot be written correctly until this is settled, because "8 months" could mean either (a) a much higher-quality, more deliberate build of the *same* MVP scope, or (b) the same 14-week MVP plus 20 additional weeks of screens/features the SRS explicitly deferred.
- **Proposed resolution** (needs your confirmation): Treat the **SRS's 14-week roadmap as superseded**, not deleted — its phase *content* (landing → auth/onboarding → programs → progress → AI → payments → polish → QA) becomes the backbone of an 8-month roadmap, but with a new Phase 0 (this design phase, ~4–6 weeks) inserted first, and each subsequent phase given realistic multi-week duration instead of compressed 1–2 week slices. I will build the roadmap this way in Part B unless you tell me otherwise — flagging it here rather than silently overwriting §12.

### CONFLICT 2 — Visual palette: SRS dark-navy vs. previously-shipped dark-black canvas

- **Existing decision (SRS §13)**: Background `#1a1a2e` (dark navy-purple), Secondary surface `#16213e` (blue-navy), Text secondary `#A0A0A0`, Success `#10B981`, Warning `#F59E0B`, Error `#EF4444`. Typography: Inter + Poppins, H1 56px, H2 40px, H3 28px, Body 16px/1.6, Small 14px, Caption 12px @ 0.7 opacity. Spacing: 8px base scale (4/8/16/24/32/48/64).
- **What actually shipped in the earlier design-canvas pass** (before this SRS section had been read in full): background `#0f0f0f`/`#1a1a1a` (neutral black, no navy tint), a different type scale (H1 64px, -2px tracking), and a 4px-base spacing scale. That work predated a full SRS read and drifted from §13 without flagging it — that was a mistake on my part.
- **Reason this matters**: `#1a1a2e`/`#16213e` reads as a **cooler, slightly purple-navy black** — distinct from a neutral `#0f0f0f`/`#1a1a1a`. This is a real visual difference, not a rounding error, and it's the platform's primary brand surface.
- **Consequence if unresolved**: Design System v2 (this phase) either quietly keeps the drifted palette (repeating the mistake) or reverts to SRS values without saying so (also a silent change).
- **Proposed resolution**: **Revert to the SRS-specified palette** (`#1a1a2e` / `#16213e` / `#A0A0A0` / semantic colors as specified) as the baseline in the new Design System, and treat the neutral-black variant as a rejected exploration, noted as such. Typography and spacing scales will also follow the SRS's §13 values as the base, refined (not replaced) with additional levels (H4, button, label, etc.) the SRS didn't specify. This is called out explicitly in the new `DESIGN_SYSTEM.md` rather than silently swapped.

### CONFLICT 3 — Screen/feature scope: SRS MVP vs. 30-screen inventory

- **Existing decision (SRS §11)**: MVP = landing page + auth + onboarding questionnaire only. Explicitly **NOT IN MVP**: English/Cricket, advanced AI coach, community, live coaching, native apps, AR, wearables, full admin panel.
- **New brief**: Requests conceptual design for 25 "priority" screens (public + authenticated Gym experience including full dashboard, active workout flow, AI Coach + conversation UI, notifications, profile/settings) plus 5 lower-priority screens (community, challenges, subscription, payments, admin).
- **Reason this matters**: This is not a conflict about *direction* — the SRS already lists Gym Dashboard-adjacent concepts (Goals, Programs, Progress, 1RM tracking) as part of Layer 2/3 — but the SRS scoped only landing+auth+onboarding for MVP *delivery*, deferring the rest to "Phase 1.5" or later. The new brief's screen inventory is a **design/architecture exercise across the full first-category experience**, not a redefinition of what ships first.
- **Proposed resolution**: No conflict in substance — I will design (conceptually, per this phase's purpose) all 25 priority screens as requested, because that is explicitly what a design/architecture phase is for (deciding the full shape before building). But the **implementation roadmap** (Part B, item 35) will continue to sequence delivery MVP-first, matching SRS §11's priority order (landing → auth/onboarding → programs/workouts → progress → AI → payments → polish), just stretched across 8 months instead of 14 weeks. I'm flagging this so it's clear: designing a screen ≠ committing to build it in month 1.

### CONFLICT 4 — "MadMuscles as funnel reference" vs. SRS positioning

- **Existing decision (SRS §2)**: "Premium positioning (NOT commodity fitness app like Peloton/Fittr)... avoid SaaS template look."
- **New brief**: Use MadMuscles (a commodity-style D2C fitness quiz-funnel product) as a *product/funnel reference only*, explicitly not for branding/layout/visuals.
- **Reason this matters**: This isn't a real conflict — the brief itself draws this distinction — but it's worth stating explicitly so no one downstream assumes "funnel reference" means "make it look like a quiz-funnel fitness app." Gurukul's premium/calm-but-powerful personality (this brief, §3) governs the *visual and tonal* execution; MadMuscles only informs the *mechanic* of a goal→onboarding→personalized-result funnel, which the SRS already independently specifies in §11 (goal selection → fitness level → equipment → time availability → recommendation).
- **Proposed resolution**: No change needed. Documented here so it's traceable.

---

## 3. DECIDED — Already answered by the SRS (followed, not re-litigated)

| Area | SRS Decision | Where |
|---|---|---|
| Overall architecture | 3-layer: Shared Platform Services → Category Engine → Domain-Specific Features | §3 |
| Platform-core neutrality | Architecture must NOT be fitness-specific at the core | §1 |
| Tech stack — frontend | React 18+, TypeScript, Vite, Tailwind, Shadcn/UI, TanStack Query, Zustand, React Router v6, RHF+Zod, Framer Motion, Lucide | §4 |
| Tech stack — backend | Node 20 LTS, Express 4.18+, TypeScript, MongoDB 6+, Mongoose 7+, JWT, bcrypt, Nodemailer, Multer, Winston, Helmet, express-rate-limit, node-cron | §4 |
| External services | MongoDB Atlas, Stripe, Anthropic Claude API, Cloudinary, Render/Railway, Vercel, PostHog, Sentry, Firebase Cloud Messaging/OneSignal | §4 |
| DB strategy | MongoDB, hybrid embedding/referencing, optimized for read-heavy + real-time queries | §5 |
| Core collections | Users, Profiles, Categories, Goals, Programs, Exercises/Lessons, Workouts/Sessions, Progress, AIConversations, Subscriptions, Notifications, CommunityPosts, AnalyticsEvents — with fields and indexes specified | §5 |
| API base & auth style | REST, base `/api/v1`, JWT-based | §6 |
| Frontend structure | Feature-based (`src/pages`, `src/features/{auth,gym,user,community}`, `src/components`, `src/hooks`, `src/services`, `src/api`, `src/store`, `src/types`, `src/utils`, `src/constants`) | §7 |
| Frontend state split | Zustand = client state (auth, prefs, UI/modals, filters); TanStack Query = server state (programs, progress, posts) | §7 |
| Backend structure | Layered: Controllers → Services → Repositories → MongoDB; folders `config/controllers/services/repositories/models/routes/middleware/validators/utils/types/jobs` | §8 |
| Auth mechanics | JWT 15-min access token + 7-day refresh token in HTTP-only secure cookies; bcrypt 12 rounds; mandatory email verification; password reset via 24h email token; OAuth2 scaffolding (Google, GitHub) ready but not required for MVP | §9 |
| RBAC roles | `user`, `moderator`, `admin`, `category_coach` | §9 |
| API security | HTTPS/TLS 1.3, secrets via env vars, rate limit 100 req/hr/IP tunable per endpoint, CORS restricted to frontend domain, Zod/Joi validation on all endpoints, Helmet headers, XSS via escaping/CSP | §9 |
| Infra | Vercel (frontend), Render/Railway (backend, Docker), MongoDB Atlas, Cloudinary, PostHog + Sentry + OpenTelemetry | §10 |
| Deploy pipeline | Feature branch → PR preview (Vercel) → merge to main → staging (Render) → QA → git tag → production | §10 |
| Category isolation goal | Category Engine layer must allow Career/Meditation/Leadership etc. to be added "without platform rewrite" | §3 |
| Risk register | Scope creep, AI token costs, media storage costs, category-expansion complexity, performance at scale — already named with mitigations | §14 |

**These are not being reopened.** The new architecture docs will restate them for developer convenience but treat them as fixed inputs.

---

## 4. NEEDS REFINEMENT — SRS states direction, not enough detail to build from

| # | Topic | SRS gives | Gap this phase must close |
|---|---|---|---|
| R1 | Category Engine mechanics | Says categories "inherit platform but maintain independent logic" and lists per-category feature lists | No concrete pattern for *how* a category registers itself, configures its own onboarding questions, or contributes its own AI coach prompt/context without touching shared code. → `Category Architecture` doc must define a `CategoryConfig` contract. |
| R2 | AI Infrastructure | Named as a Layer 1 service: "LLM abstraction, context management, token budgeting" | No gateway shape, no per-category coach interface, no cost-control mechanics beyond "budget/caching" as a risk mitigation. → `AI System Design` doc. |
| R3 | Onboarding → Recommendation logic | SRS §11 lists the onboarding questions (goal, fitness level, equipment, time/week) and says "personalized program recommendations based on answers" | No recommendation algorithm/scoring logic specified — is it rule-based (deterministic mapping table) or LLM-based? This is a real fork with cost/latency/predictability consequences. → Needs an explicit decision (see D-series below), not silent invention. |
| R4 | Design system depth | §13 gives palette, 3 heading sizes, body/small/caption, 8px spacing scale | No H4, no button/label type styles, no component-level tokens (radius, shadow, motion durations), no dark-mode-only confirmation. → This phase's `DESIGN_SYSTEM.md` extends §13, keeping its values as the source of truth. |
| R5 | Analytics events | §1 mentions analytics/observability as a platform service; SRS DB has `AnalyticsEvents` collection with `event_name/user_id/session_id/properties/timestamp` | No defined event taxonomy (which events, what payload per event). → `ANALYTICS_ARCHITECTURE.md` defines the taxonomy this brief's §28 asked for. |
| R6 | Community & Subscriptions | Present in DB schema and API list (`CommunityPosts`, `/subscriptions/checkout`) but explicitly deferred past MVP | Fields exist; no UX or service-layer design yet. Correctly postponed (see §5 below) — just noting the DB shape already anticipates it. |

---

## 5. NEEDS DECISION — SRS is silent; a real choice is required (tracked as ADRs)

| # | Decision needed | Options | Recommendation (to be confirmed, not assumed) |
|---|---|---|---|
| D1 | Recommendation engine: rule-based vs. LLM-based | (a) Deterministic lookup table mapping {goal × level × equipment × days/week} → program id. (b) LLM call at onboarding completion. | **(a) for MVP.** Faster, free, predictable, testable, and the SRS's own risk register flags AI cost as a real concern. LLM-based recommendation is a Phase-2 enhancement once enough programs exist to need fuzzier matching. This becomes ADR-004. |
| D2 | Single-select vs multi-select goal selection | SRS §11 implies a single onboarding path ("fitness goals" as one step) | **Single-select for MVP** — cleaner recommendation logic, matches "goal_type" as a singular field in the `Goals` collection (§5: `goal_type` not `goal_types`). Multi-goal support is a data-model change, not just UI — flagged, not assumed. ADR-005. |
| D3 | Repository layer: real abstraction or pass-through? | SRS §8 specifies Controllers → Services → Repositories → MongoDB, but doesn't say how "thin" repositories should be | **Thin repositories** — one repository per Mongoose model, exposing typed CRUD + query methods; no premature generic repository base class. Services own business logic; repositories own persistence only. This avoids "abstraction for its own sake," which the brief explicitly warns against. ADR-006. |
| D4 | OAuth: build now or scaffold only? | SRS §9 says "OAuth2 infrastructure ready" but MVP §11 auth list only has email/password | **Scaffold only** (routes/strategy stubs), no real Google/GitHub app registration or UI entry point until Phase 1.5+. Confirmed against SRS, not a new decision, but stated explicitly so a developer doesn't build full OAuth UI prematurely. |
| D5 | Where does "category_coach" role get used? | RBAC lists the role; no defined use case in MVP scope | **Reserved, unused in Gym MVP.** Becomes relevant once a category has human-in-the-loop coaching (not in MVP). Flag as a no-op role for now rather than building permission checks with no consumer. |
| D6 | Design system: dark-mode-only, or light mode ever? | SRS's whole palette is dark-only; no light-mode values exist anywhere | **Dark-mode-only for the foreseeable roadmap.** Matches "cinematic imagery," premium-not-SaaS positioning. Explicit decision so no developer builds a theme-switcher speculatively. ADR-007. |

---

## 6. POSTPONED — Legitimately out of scope right now

Directly inherited from SRS §11 "NOT IN MVP," reconfirmed for this design phase's own prioritization (design conceptually now, build later):

- English, Cricket, and all future categories — **conceptual architecture only** (Category Architecture doc explains extension pattern; no English/Cricket screens designed).
- Full Admin panel — SRS says "full CMS" not in MVP; this phase produces no Admin screen designs (kept as future/lower-priority per this brief's own §4 list).
- Community, Challenges — DB shape exists; no UX in this phase.
- Native iOS/Android, AR form correction, wearable integrations — no design work this phase.
- Live coaching sessions — no design work this phase.

---

## 7. ARCHITECTURAL RISKS (naming risks introduced or sharpened by this new phase, in addition to SRS §14's existing register)

| Risk | Description | Mitigation direction |
|---|---|---|
| Design-phase scope inflation | 30-screen inventory + full system architecture package is itself a multi-week effort; risk of the "design phase" consuming a disproportionate share of the 8 months. | Time-box this phase (see roadmap Phase 1) and gate hard at the Development Gates in Part B — no re-opening design decisions once a gate is passed without an ADR. |
| Two competing timeline mental models | Team may plan against the old 14-week doc and the new 8-month doc simultaneously. | This review formally supersedes SRS §12's roadmap with the new one produced in this package (§35). SRS §12 is kept for historical reference, not deleted, and marked superseded. |
| Recommendation-engine coupling | If the rule-based lookup table (D1) is hard-coded into the onboarding controller, adding English/Cricket onboarding later re-triggers platform-core changes — contradicting the SRS's Layer 2 isolation principle. | Recommendation logic must live inside the Gym category module behind a common `CategoryOnboardingEngine` interface (see Category Architecture doc), not in a shared controller. |
| AI cost exposure once AI Coach ships | SRS already flags this (§14); sharpened here because this phase's screen inventory includes a full "AI Conversation" UI, which will create user expectations that could clash with tight token budgets. | AI System Design doc must define token budgets and graceful-degradation UX (e.g., daily message caps) before the AI Conversation screen is built, not after. |

---

## 8. What happens next

This review does not block the rest of the package — per your instruction, Parts A and B proceed now. But three items above materially shape what gets written next, so they're surfaced as explicit confirmations rather than assumptions:

1. **Timeline model** (Conflict 1): proceeding with "SRS phase content, stretched to 8 months with a Phase 0 design gate" unless corrected.
2. **Visual palette** (Conflict 2): proceeding with SRS §13's navy-tinted dark palette as the system-of-record, not the earlier neutral-black exploration, unless corrected.
3. **Recommendation engine** (D1): proceeding with rule-based/deterministic for MVP, unless corrected.

All three are used as working assumptions in the documents that follow. Anywhere this review's proposed resolution was applied, the downstream document says so explicitly (e.g., "per DESIGN_PHASE_REVIEW.md Conflict 2") so it stays traceable and reversible.

---

*This document is part of the Design + System Architecture Phase. See `docs/PRODUCT_VISION.md`, `docs/INFORMATION_ARCHITECTURE.md`, `docs/SYSTEM_ARCHITECTURE.md` and the ADR log for the decisions this review feeds into.*
