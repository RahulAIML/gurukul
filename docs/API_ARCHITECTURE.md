# GURUKUL — API Architecture

**Status**: Baseline. Extends SRS §6 (base URL, auth style, and a partial endpoint list — DECIDED) with full endpoint specs for MVP-critical domains and the domain list the brief §24 asks for.

---

## 1. Conventions (SRS §6, unchanged)

- Base: `/api/v1`
- Auth: JWT bearer token (access token in `Authorization: Bearer`), refresh token in HTTP-only secure cookie (SRS §9).
- Errors: standardized shape (see `BACKEND_ARCHITECTURE.md` §5): `{ "error": { "code": "...", "message": "..." } }`.
- Category-scoped endpoints are mounted per `CATEGORY_ARCHITECTURE.md` §6 — `/api/v1/gym/*` is not hardcoded, it's the result of Gym's `CategoryConfig.routes` being registered.

## 2. Domains (brief §24's list, MVP-relevant ones specified in full)

`/auth` · `/users` · `/categories` · `/goals` · `/programs` · `/workouts` · `/exercises` · `/onboarding` · `/progress` · `/ai` · `/community` (postponed) · `/notifications` · `/subscriptions` (postponed) · `/analytics`

## 3. Auth (SRS §6, restated with detail)

| Endpoint | Method | Auth | Request | Response | Errors |
|---|---|---|---|---|---|
| `/auth/register` | POST | None | `{email, password, confirmPassword}` | `201 {user, accessToken}` + refresh cookie set | `409 EMAIL_EXISTS`, `400 VALIDATION_ERROR` |
| `/auth/login` | POST | None | `{email, password}` | `200 {user, accessToken}` + refresh cookie set | `401 INVALID_CREDENTIALS` (generic — never reveals which field) |
| `/auth/refresh` | POST | Refresh cookie | — | `200 {accessToken}` | `401 INVALID_REFRESH_TOKEN` |
| `/auth/logout` | POST | Access token | — | `204` | — |
| `/auth/verify-email` | POST | None | `{token}` | `200` | `400 INVALID_OR_EXPIRED_TOKEN` |
| `/auth/password-reset` | POST | None | `{email}` | `200` (always, even if email doesn't exist — prevents email enumeration) | — |
| `/auth/password-reset/confirm` | POST | None | `{token, newPassword}` | `200` | `400 INVALID_OR_EXPIRED_TOKEN` |

## 4. Onboarding & Recommendation (new — closes SRS §6 gap; implements D1/D2)

| Endpoint | Method | Auth | Request | Response | Errors |
|---|---|---|---|---|---|
| `/onboarding/gym/recommend` | POST | None (anonymous — session-local flow per `GYM_USER_JOURNEYS.md` §1) | `{goal, fitnessLevel, location, equipment[], daysPerWeek, sessionLength, notes?}` | `200 {programId, program, schedule, reason}` | `400 VALIDATION_ERROR` |
| `/onboarding/gym/complete` | POST | Access token (called right after registration to persist the answers that were session-local until now) | `{goal, fitnessLevel, ..., programId}` | `200 {goal, enrolledProgram}` — writes to `Goals`, `Profile.fitness_level`, enrolls in `Programs` | `401`, `400` |

This is a Gym-specific route (`/onboarding/gym/*`), not a generic `/onboarding/*` — per `CATEGORY_ARCHITECTURE.md` §3, the recommendation shape differs per category, so the endpoint itself is category-scoped, registered via Gym's `CategoryConfig.routes`.

## 5. Categories (SRS §6, restated)

| Endpoint | Method | Auth | Response |
|---|---|---|---|
| `/categories` | GET | None | List active categories (drives Category Selection screen) |
| `/categories/:slug` | GET | None | Category details |

## 6. Programs & Enrollment (SRS §6, restated + extended)

| Endpoint | Method | Auth | Request | Response |
|---|---|---|---|---|
| `/programs` | GET | None | Query: `category, goal, difficulty, search, page` | Paginated list (Program Discovery) |
| `/programs/:id` | GET | None | — | Program details + curriculum |
| `/programs/:id/enroll` | POST | Access token | — | `200 {enrollment}` |
| `/programs/:id/workouts` | GET | Access token | — | List of workouts in the program (Program Details → authenticated view) |

## 7. Workouts & Exercises (new — required by Today's Workout / Active Workout / Exercise Details screens)

| Endpoint | Method | Auth | Response |
|---|---|---|---|
| `/workouts/today` | GET | Access token | Resolves the user's active program + current sequence position → today's workout (or rest-day indicator) |
| `/workouts/:id` | GET | Access token | Workout detail (exercise list with prescribed sets/reps) |
| `/exercises/:id` | GET | Access token | Exercise detail (form cues, media, user's last-performed stats for this exercise) |

## 8. Progress & Goals (SRS §6, restated)

| Endpoint | Method | Auth | Request | Response |
|---|---|---|---|---|
| `/progress/session` | POST | Access token | `{workoutId, exercises: [{exerciseId, sets: [{weight, reps}]}], durationSeconds, rating?}` | `201 {session}` — logs Active Workout completion |
| `/progress` | GET | Access token | Query: `range?` | User stats, streaks, history (Progress screen) |
| `/goals` | GET | Access token | — | User's goals |
| `/goals` | POST | Access token | `{categoryId, goalType, description?, targetDate?}` | `201` — used by Goals screen's "Update Goal" |
| `/goals/:id` | PUT | Access token | Partial update | `200` |

## 9. AI (SRS §6, restated + extended for conversation threading)

| Endpoint | Method | Auth | Request | Response |
|---|---|---|---|---|
| `/ai/conversations` | GET | Access token | — | List of the user's conversation threads (AI Coach screen) |
| `/ai/conversations` | POST | Access token | `{categoryId}` | `201 {conversationId}` — creates a new thread |
| `/ai/conversations/:id/messages` | POST | Access token | `{message}` | `200 {reply}` (or SSE-streamed, see `AI_ARCHITECTURE.md`) — rate-limited per `AI_ARCHITECTURE.md`'s token budget rules |

## 10. Notifications (new)

| Endpoint | Method | Auth | Response |
|---|---|---|---|
| `/notifications` | GET | Access token | List, paginated |
| `/notifications/:id/read` | PATCH | Access token | `200` |

## 11. Analytics (new — write path only; read/dashboarding is PostHog's job, not this API)

| Endpoint | Method | Auth | Request |
|---|---|---|---|
| `/analytics/events` | POST | None or Access token | `{eventName, properties, sessionId}` — batched client-side where possible rather than one request per micro-interaction |

## 12. Postponed domains (schema-ready, no endpoints built this phase)

`/community/*`, `/subscriptions/*` — SRS §6 already lists `POST /community/posts`, `GET /community/feed`, `POST /subscriptions/checkout` as eventual shapes; not implemented until their roadmap phase (per `DESIGN_PHASE_REVIEW.md` §6).

---

*Depends on: SRS §6 (base conventions, unchanged), `DATABASE_ARCHITECTURE.md`, `CATEGORY_ARCHITECTURE.md` §3/§6. Feeds: `FRONTEND_ARCHITECTURE.md` §4 (services layer), `TRACEABILITY.md`, `TESTING_STRATEGY.md` (API test scope).*
