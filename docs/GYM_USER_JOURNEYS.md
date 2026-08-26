# GURUKUL — Gym User Journeys

**Status**: Baseline for Design + System Architecture Phase
**Scope**: First-time acquisition journey (public → registered) and the core returning-user loop.

---

## 1. First-time user journey (primary funnel)

```
Gurukul Home
    ↓
Choose Gym
    ↓
Gym Landing
    ↓
Understand Value  (scroll through Why Gurukul / Programs / How It Works / AI Coach)
    ↓
Select Goal  (in-page goal selector, launched from Landing's Hero or Personalization section)
    ↓
Start Personalization  (CTA: "Build My Plan")
    ↓
Fitness Onboarding  (multi-step: experience → location → equipment → frequency → duration → preferences)
    ↓
Recommendation  (program + schedule shown, unauthenticated)
    ↓
Register  (account created only after value is shown — not before)
    ↓
Gym Dashboard  (lands pre-populated with the recommendation)
    ↓
Start Program  (first workout begins)
```

### Why registration comes *after* the recommendation, not before

This is a deliberate sequencing decision, not an SRS-stated requirement, so it's flagged as a decision: asking for an account before showing any personalized value is the single biggest drop-off point in fitness-app funnels (this is the one useful pattern-level lesson taken from funnel products like MadMuscles — mechanic only, not visuals). The onboarding answers are held in local/session state until the recommendation is shown; registration is the *next* step once the user has seen something worth keeping. This matches SRS §11's MVP flow order (onboarding → recommendations → registration) exactly, so it's a confirmation, not a new decision.

### Step-by-step: what the user sees, decides, and what's captured

| Step | User sees | Decision made | Data captured | Next |
|---|---|---|---|---|
| **Gurukul Home** | Category cards (Gym live, others "coming soon") | Which category to explore | `page_view`, `category_impression` (anon analytics) | → Gym Landing |
| **Gym Landing** | Hero promise, value sections, program teasers | Whether Gym is credible/relevant | `category_selected` event | → Goal Selection (via CTA) |
| **Goal Selection** | 5–7 goal cards (single-select) | Which outcome they want | `goal` (session-local, not yet persisted) | → Onboarding |
| **Onboarding (6 steps)** | One question per screen, progress indicator | Experience level, location, equipment, frequency, duration, preferences | Full onboarding answer set (session-local) | → Recommendation |
| **Recommendation** | Program name, schedule, weekly commitment, "why this" reasoning | Accept and continue, or restart | `onboarding_completed`, recommended `program_id` computed (rule-based, see `CATEGORY_ARCHITECTURE.md`) | → Register |
| **Register** | Minimal form: email, password (name optional at this stage) | Create account or abandon | `User` + `Profile` created; session-local onboarding answers persisted to `Goals`/`Profile` | → Dashboard |
| **Dashboard (first visit)** | Pre-populated with recommended program, "Start Program" CTA prominent | Start now or explore first | `signup_completed`, `first_dashboard_view` | → Today's Workout |
| **Start Program** | Today's Workout for day 1 | Begin workout | `program_started` | → Active Workout |

### Abandonment handling

- If a user leaves mid-onboarding, session-local answers persist in browser storage (not the database — no account exists yet) for the session only. Returning within the same session resumes; a new session restarts. This avoids storing PII-adjacent data (health/fitness answers) for anonymous users server-side, which is a deliberate privacy-by-default choice consistent with SRS §9's data-protection posture.
- If a user completes onboarding but abandons at Registration, the recommendation screen remains reachable by "back," but the computed recommendation is not persisted — recomputing on return is cheap (rule-based, per D1) so there's no need to store it for anonymous users.

---

## 2. Returning user journey (core retention loop)

```
Login
    ↓
Gym Dashboard  (Today's Workout surfaced first, streak visible)
    ↓
Today's Workout  →  Active Workout  →  Workout Completion
    ↓                                        ↓
(or: Programs / Progress / Coach)      Dashboard (updated stats)
```

This loop is intentionally short. The dashboard's #1 job on every return visit is answering "what do I do today," not presenting a menu of options. Progress, Programs, and Coach are one tap away but never compete with Today's Workout for primary visual weight (Product Principle 1).

## 3. AI Coach journey (secondary, cross-cutting)

```
Any authenticated screen
    ↓
"Ask Coach" entry point (contextual — e.g., from Exercise Details: "form question?")
    ↓
AI Coach (conversation list or new conversation)
    ↓
AI Conversation (scoped to Gym persona, sees user's program/progress context)
    ↓
Response + optional suggested action (e.g., "adjust today's workout")
```

The Coach is reachable from two places: a dedicated nav destination (`/app/gym/coach`) and contextual entry points on relevant screens (Exercise Details, Workout Completion). It is never a modal that interrupts an in-progress workout — during Active Workout, coach access is deliberately suppressed to protect the distraction-free execution mode (see `UX_ARCHITECTURE.md` → Active Workout).

---

*This document assumes DESIGN_PHASE_REVIEW.md's D1 (rule-based recommendation) and D2 (single-select goal). Screen-by-screen detail for every step above is in `UX_ARCHITECTURE.md`.*
