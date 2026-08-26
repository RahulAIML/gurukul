# GURUKUL — Information Architecture

**Status**: Baseline for Design + System Architecture Phase

---

## 1. Full site map (public + authenticated, all categories conceptual, Gym concrete)

```
GURUKUL
│
├── / (Home)
│   └── Category selector → routes into a category namespace
│
├── /categories
│   ├── /gym                          [BUILT — MVP]
│   │   ├── /gym                      Gym Landing
│   │   ├── /gym/programs             Program Discovery
│   │   ├── /gym/programs/:id         Program Details
│   │   ├── /gym/goals                Goal Selection
│   │   ├── /gym/onboarding           Fitness Onboarding (multi-step)
│   │   ├── /gym/onboarding/result    Recommendation Result
│   │   └── /gym/coach                AI Coach preview (public teaser only)
│   │
│   ├── /english                      [CONCEPTUAL — not built]
│   ├── /cricket                      [CONCEPTUAL — not built]
│   ├── /career                       [FUTURE]
│   ├── /meditation                   [FUTURE]
│   └── /leadership                   [FUTURE]
│
├── /auth
│   ├── /auth/register
│   ├── /auth/login
│   ├── /auth/verify-email
│   ├── /auth/forgot-password
│   └── /auth/reset-password
│
└── /app  (authenticated shell — category-scoped inside)
    ├── /app                          Redirects to active category's dashboard
    │
    ├── /app/gym                      [BUILT — MVP+]
    │   ├── /app/gym                  Gym Dashboard
    │   ├── /app/gym/today            Today's Workout
    │   ├── /app/gym/workouts/:id     Workout Details
    │   ├── /app/gym/exercises/:id    Exercise Details
    │   ├── /app/gym/session/:id      Active Workout (full-screen mode)
    │   ├── /app/gym/session/:id/done Workout Completion
    │   ├── /app/gym/programs         My Programs
    │   ├── /app/gym/programs/:id     Program Details (authenticated view)
    │   ├── /app/gym/progress         Progress
    │   ├── /app/gym/goals            Goals
    │   └── /app/gym/coach            AI Coach
    │       └── /app/gym/coach/:id    AI Conversation (thread)
    │
    ├── /app/profile                  Profile               [PLATFORM, category-agnostic]
    ├── /app/settings                 Settings              [PLATFORM]
    ├── /app/notifications             Notifications         [PLATFORM]
    │
    ├── /app/community                [FUTURE — platform-level, category-filtered feed]
    ├── /app/challenges               [FUTURE — category-scoped]
    ├── /app/subscription             [FUTURE]
    ├── /app/billing                  [FUTURE]
    └── /app/admin                    [FUTURE — separate app shell, not user-facing]
```

## 2. Authenticated Gym architecture (detail)

```
/app/gym  (Gym category shell — persistent nav: Dashboard / Today / Programs / Progress / Coach)
│
├── Dashboard ─────────────► entry point after login; shows Today's Workout card,
│                             streak, quick stats, AI recommendation nudge
│
├── Today's Workout ───────► the single most important authenticated screen;
│                             answers "what do I do right now"
│   └── Active Workout ────► full-screen, distraction-free execution mode
│       └── Completion ────► logs session, shows summary, returns to Dashboard
│
├── Programs ───────────────► "my programs" (enrolled) + browse (discovery, reused
│   └── Program Details        from public Program Details with authenticated actions:
│                               enroll/switch/pause)
│       └── Workout Details ─► within a program, workout-level detail before starting
│           └── Exercise Details ► individual exercise: form cues, video, history
│
├── Progress ───────────────► charts, history, streaks, milestones
│
├── Goals ───────────────────► current goal(s), editable, links back to onboarding logic
│
└── Coach ────────────────────► AI Coach entry (contextual prompts) → Conversation thread
```

## 3. Navigation model

- **Public nav** (unauthenticated): Home → Categories → Gym Landing is the primary funnel. A persistent top nav exists (Features/Pricing/About-style) but is secondary to the funnel's own in-page CTAs.
- **Authenticated nav — desktop (≥1024px)**: fixed left Sidebar. Five primary, equally-weighted destinations: **Dashboard (Home), Programs, Progress, Coach, Community** (Community shown but disabled/"coming soon" until it ships — kept visible so the nav shape doesn't change later). **Notifications** appears as a sixth sidebar item with an unread-count badge — visible directly in nav (not buried in an account menu) because unread state is glanceable information a user should see without opening a menu; this is a deliberate refinement adopted from a user-supplied UI reference (see revision note below). **Profile** sits at the bottom of the sidebar, visually separated (small divider) from the 6 functional items above it, since it's an identity/account entry point rather than a content destination.
- **Authenticated nav — mobile/tablet (<1024px)**: BottomNavigation carries the top 5 content destinations only (Dashboard, Programs, Progress, Coach + one more); Notifications and Profile move to the topbar (bell icon + avatar) rather than competing for scarce bottom-nav slots — screen width, not importance, is why mobile trims to 5 while desktop can show 6.
- **Topbar (authenticated, all widths)**: search (program/topic search), a streak/points chip (glanceable motivation indicator, restrained — a number and a small icon, not a gamified badge wall per Product Principle 3), notification bell (mobile) or redundant-free on desktop where the bell already lives in the sidebar, and avatar.
- **Category switch**: if/when a user has access to multiple categories (post-MVP), category switching happens via a top-level switcher above the category nav, not by mixing categories into one nav list.

> **Revision note**: this navigation model was refined after reviewing a user-supplied AI-generated UI reference. The reference's sidebar shape (icon+label list, badge on Notifications, avatar/account entry separated at the bottom, streak chip in the topbar) was adopted as a genuine UX improvement over the earlier "account menu hides everything" version. Its visual execution (mythological artwork, heavy ornamentation) was explicitly **not** adopted — see `UX_ARCHITECTURE.md` §4's revision note and `DESIGN_PHASE_REVIEW.md` for why literal mythological/religious imagery stays out of scope per this brief's own design-direction guardrails.

## 4. Content ownership boundary (platform vs. category)

This is the IA's most important cross-cutting rule, directly enforcing SRS §3's "architecture is NOT fitness-specific at the core":

| Belongs to Platform (Shared Services) | Belongs to Gym Category |
|---|---|
| Home, category selector | Gym Landing, Program Discovery/Details |
| Auth (register/login/verify/reset) | Goal Selection, Fitness Onboarding, Recommendation |
| Profile, Settings, Notifications | Dashboard, Today's Workout, Active Workout, Completion |
| Subscription/Billing shell | Exercise Details, 1RM tracking, workout-specific Progress views |
| Community feed shell (future) | AI Coach persona/prompts (Gym-specific), Gym-specific goals |
| Admin shell (future) | — |

A screen only belongs on the left if it would make sense unmodified for English or Cricket (e.g., "Settings" needs no Gym knowledge; "Today's Workout" inherently does).

---

*This IA is the routing contract for `FRONTEND_ARCHITECTURE.md` and the URL/permission contract for `API_ARCHITECTURE.md`. Route paths shown are conceptual (React Router v6 path structure), not final file paths.*
