# GURUKUL — Analytics Architecture

**Status**: Baseline. Closes gap R5 from `DESIGN_PHASE_REVIEW.md`. Storage shape: `DATABASE_ARCHITECTURE.md`'s `AnalyticsEvents` collection (SRS §5, unchanged). Product analytics platform: PostHog (SRS §4, unchanged).

---

## 1. Event naming convention

`snake_case`, `noun_verb-past-tense` where an action completed, `noun_started`/`noun_viewed` where it's a beginning/impression. Matches the examples already given in the brief §28 and SRS's event-adjacent naming.

## 2. Event taxonomy (MVP scope, traced to journeys in `GYM_USER_JOURNEYS.md`)

| Event | Trigger | Key properties | Anonymous or authenticated |
|---|---|---|---|
| `page_view` | Any route render | `path`, `referrer` | Both |
| `category_impression` | Category card visible on Home | `categorySlug` | Both |
| `category_selected` | User taps into a category | `categorySlug` | Both |
| `goal_selected` | Goal Selection card chosen | `categorySlug`, `goalType` | Both |
| `onboarding_started` | First onboarding step rendered | `categorySlug` | Both |
| `onboarding_step_completed` | Each step's Continue pressed | `categorySlug`, `stepNumber` | Both |
| `onboarding_completed` | Recommendation screen reached | `categorySlug`, `recommendedProgramId` | Both |
| `onboarding_abandoned` | Session ends mid-onboarding (best-effort, on `beforeunload`/route-away without completion) | `categorySlug`, `lastStepReached` | Both |
| `program_viewed` | Program Details screen render | `programId`, `source` (discovery/landing/recommendation) | Both |
| `program_started` | Enrollment confirmed (post-registration, first "Start Program") | `programId` | Authenticated |
| `signup_completed` | Registration success | `hadOnboardingContext` (boolean — did they arrive via onboarding or direct signup) | Authenticated |
| `workout_started` | Active Workout entered | `workoutId`, `source` (today/programs) | Authenticated |
| `workout_completed` | Workout Completion screen reached | `workoutId`, `durationSeconds` | Authenticated |
| `workout_abandoned` | Active Workout exited via "End Workout" before completion | `workoutId`, `exercisesCompleted` | Authenticated |
| `ai_coach_opened` | AI Coach screen or a new conversation started | `categorySlug`, `entryPoint` (nav/contextual) | Authenticated |
| `ai_message_sent` | User sends a Coach message | `categorySlug`, `conversationId` | Authenticated |
| `cta_clicked` | Any tracked primary CTA (Hero, Recommendation, Final CTA) | `ctaId`, `location` | Both |
| `streak_milestone` | Streak count crosses a notable threshold (e.g., 7/30/100 days) | `streakCount` | Authenticated |

## 3. Payload structure

```json
{
  "event_name": "onboarding_completed",
  "user_id": "usr_123 | null",
  "session_id": "sess_abc",
  "properties": { "categorySlug": "gym", "recommendedProgramId": "prg_456" },
  "timestamp": "2025-XX-XXTXX:XX:XXZ"
}
```

Matches `AnalyticsEvents`' schema (SRS §5) exactly — `user_id` is nullable for anonymous pre-registration events, `session_id` bridges anonymous → authenticated identity once a user registers (standard PostHog identity-merge pattern: anonymous session events are re-attributed to the user id post-signup via PostHog's `identify` call, not by mutating already-written `AnalyticsEvents` documents).

## 4. Anonymous vs. authenticated tracking

- **Anonymous (pre-registration)**: `page_view`, `category_impression/selected`, `goal_selected`, `onboarding_*`, `cta_clicked`. Session-scoped, `user_id: null`, matches the session-local onboarding data handling in `GYM_USER_JOURNEYS.md` §1 (no server-side persistence of health/fitness answers for anonymous users — analytics *events* about the funnel's progress are fine to record; the *content* of sensitive answers is not sent as event properties beyond category-level facts like `goalType`, never free-text notes from onboarding step 06).
- **Authenticated**: everything post-registration, `user_id` set.

## 5. Privacy

- No event property ever contains free-text user input verbatim (e.g., onboarding step 06's optional notes field, or AI Coach message content) — event properties are structured/enumerated values only (ids, counts, booleans), never raw user-authored text. This is a deliberate privacy boundary consistent with `SECURITY_ARCHITECTURE.md`'s data-protection posture and is stricter than SRS §9 required, because analytics events are a different exposure surface (viewable by anyone with PostHog dashboard access) than the primary database.
- PostHog session replay (SRS §3 names it as part of Analytics & Observability) masks form input fields by default — password fields and any free-text health-related input are explicitly excluded from replay capture, not just default-masked.
- `AnalyticsEvents`' 90-day TTL (SRS §5, unchanged) means this collection is never the system of record for anything requiring longer retention (e.g., audit logs — see `SECURITY_ARCHITECTURE.md` §4, which is intentionally a *separate*, non-TTL'd collection).

---

*Depends on: SRS §3/§5 (unchanged), `GYM_USER_JOURNEYS.md`, `SECURITY_ARCHITECTURE.md` §3. Feeds: `TRACEABILITY.md`.*
