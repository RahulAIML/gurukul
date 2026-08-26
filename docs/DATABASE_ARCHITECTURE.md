# GURUKUL — Database Architecture

**Status**: Baseline. Refines SRS §5 (DECIDED collections/fields/indexes — restated, not altered) with the relationship/embedding rationale and scalability notes the brief §23 asks for.

---

## 1. Strategy (SRS §5, unchanged)

MongoDB, hybrid embedding/referencing, optimized for read-heavy operations and real-time queries.

## 2. Entity-by-entity detail

### User
- **Purpose**: authentication identity.
- **Fields** (SRS §5): `_id`, `email` (unique), `password_hash`, `full_name`, `avatar_url`, `status`, `created_at`.
- **Indexes**: `email` (unique), `created_at`, `status`.
- **Relationships**: 1:1 with Profile (referenced, not embedded — see below).
- **Embedding decision**: **referenced**. Auth data (`User`) and profile data (`Profile`) are split because they have different read patterns (auth is read on every request via JWT-derived `user_id`; profile is read on far fewer screens) and different write patterns (password changes vs. bio/preference edits) — merging them would mean every profile edit touches the same document as auth, increasing write contention risk as the platform scales.
- **Scalability**: stable as-is; sharding key candidate if ever needed: `_id`.

### Profile
- **Purpose**: personal/category-agnostic + category-relevant self-reported data.
- **Fields** (SRS §5): `user_id`, `bio`, `age`, `gender`, `timezone`, `language`, `fitness_level`, `health_conditions`, `preferences`.
- **Indexes**: `user_id` (unique), `fitness_level`.
- **Relationships**: 1:1 with User (referenced).
- **Embedding decision**: `preferences` and `health_conditions` are embedded sub-documents (small, always read/written together with the profile, never queried independently at scale) — correct as specified.
- **Note**: `fitness_level` is Gym-specific data living in a platform-shared collection. This is intentional and matches `CATEGORY_ARCHITECTURE.md` §4's table (category-specific profile fields share the collection; only the owning category's code reads/writes its own fields). A future English category would add its own fields (e.g., `cefr_level`) to the same document, not a new collection — avoids an explosion of near-empty per-category profile collections.
- **Scalability**: fine at current shape; if categories proliferate past ~5–6 with meaningfully different field sets, revisit whether category-specific profile data should move to a `CategoryProfiles` collection keyed by `(user_id, category_id)` — not needed now, flagged as a future decision point, not an open question blocking this phase.

### Categories
- **Fields** (SRS §5): `slug`, `name`, `description`, `icon_url`, `banner_url`, `status`, `order`, `config` (category-specific).
- **Indexes**: `slug` (unique), `status`.
- **Relationships**: referenced by Goals, Programs (via `category_id`).
- **Embedding decision**: `config` is an embedded flexible object — this is the database-level counterpart to `CATEGORY_ARCHITECTURE.md`'s `CategoryConfig` (the *code-level* contract is richer than what's persisted; only the parts a non-technical admin might edit, like display copy or feature toggles, need to live in this document — routing/component wiring stays in code, not data).
- **Scalability**: tiny collection (one doc per category, ever), no scaling concerns.

### Goals
- **Fields** (SRS §5): `user_id`, `category_id`, `goal_type`, `description`, `target_date`, `status`, `created_at`.
- **Indexes**: `user_id`, `category_id`, `status`.
- **Relationships**: references User, Categories.
- **Embedding decision**: referenced (goals are queried independently — "show me all active goals" — and can outlive/outnumber other per-user data).
- **Confirms D2**: `goal_type` is singular (not an array), consistent with the confirmed single-select Goal Selection UX.

### Programs
- **Fields** (SRS §5): `category_id`, `goal_ids` (array), `title`, `description`, `difficulty`, `duration_weeks`, `curriculum` (embedded).
- **Indexes**: `category_id`, `goal_ids`, `difficulty`.
- **Relationships**: references Categories, Goals (many-to-many via `goal_ids`).
- **Embedding decision**: `curriculum` (the week-by-week/workout-sequence structure) is **embedded** — it's authored as a unit, read as a unit (Program Details renders the whole curriculum at once), and never independently queried at the sub-document level. This is the correct embedding call per MongoDB's general rule (embed what's read together, reference what's queried independently).
- **Scalability**: curriculum embedding has a practical ceiling (MongoDB's 16MB document limit) — not a real risk for a structured weeks/workouts curriculum, but noted as a boundary condition if a program's curriculum ever grows unusually large (e.g., a year-long, day-by-day plan) — such a program would need `Workouts/Sessions` referenced instead of embedded curriculum, which the schema already supports as an alternative path (see next entity).

### Exercises / Lessons
- **Fields** (SRS §5): `category_id`, `name`, `description`, `media_url`, `duration`, `difficulty`, `target_area`.
- **Indexes**: `category_id`, `difficulty`, `target`.
- **Relationships**: referenced by Workouts/Sessions (many-to-many, an exercise appears across many workouts).
- **Embedding decision**: referenced — exercises are a shared library reused across many programs/workouts; embedding would duplicate exercise data (and form-video URLs) across every workout that uses it.

### Workouts / Sessions
- **Fields** (SRS §5): `program_id`, `sequence_number`, `title`, `exercises` (array), `duration_minutes`.
- **Indexes**: `program_id`, `sequence_number`.
- **Relationships**: references Programs, and (within the `exercises` array) references Exercises by id with workout-specific overrides (e.g., prescribed sets/reps for *this* workout, even though the Exercise itself is shared).
- **Embedding decision**: the `exercises` array embeds `{exercise_id, sets, reps, rest_seconds}` tuples (workout-specific prescription), referencing the shared Exercise document for name/media/instructions — a hybrid, exactly matching SRS §5's stated strategy.

### Progress
- **Fields** (SRS §5): `user_id`, `program_id`, `workout_id`, `date_completed`, `duration_seconds`, `rating`.
- **Indexes**: compound `(user_id, program_id, date_completed)` for efficient history queries — as specified.
- **Relationships**: references User, Programs, Workouts.
- **Embedding decision**: referenced, append-only — this collection is a write-heavy log (one document per completed session) and must never be embedded into User/Profile (unbounded growth would breach document-size limits almost immediately).
- **Scalability**: this is the platform's highest-volume collection long-term. The compound index already anticipated in SRS §5 is the correct mitigation; if per-user history grows very large, a future TTL-archival strategy (moving sessions older than N months to a cold collection) is a reasonable Phase 2+ optimization — not needed for MVP scale.

### AIConversations
- **Fields** (SRS §5): `user_id`, `category_id`, `messages` (embedded), `context` (user profile summary).
- **Indexes**: `user_id`, `category_id`, `created_at`.
- **Embedding decision**: `messages` embedded (a conversation is read/written as a unit, matches the AI Conversation screen's access pattern exactly) — correct as specified. `context` embedding a **summary**, not the full profile, is deliberate: keeps the document bounded and keeps token-budget-relevant context compact (feeds directly into `AI_ARCHITECTURE.md`'s context-window management).
- **Scalability**: same unbounded-array caution as Progress — a very long-running conversation thread could approach document-size limits. Mitigation: cap active thread length client/server-side (e.g., start a new conversation document past ~200 messages) — a concrete implementation detail for `AI_ARCHITECTURE.md`, not a schema change.

### Subscriptions
- **Fields** (SRS §5): `user_id`, `plan_tier`, `stripe_subscription_id`, `status`, `period dates`.
- **Indexes**: `user_id`, `status`.
- **Status**: schema-ready, feature postponed (per `DESIGN_PHASE_REVIEW.md` §6) — no service/UX built this phase.

### Notifications
- **Fields** (SRS §5): `user_id`, `title`, `body`, `type`, `sent_at`, `read_at`, **TTL: 30 days**.
- **Indexes**: `user_id`, `sent_at`.
- **Embedding decision**: referenced, TTL-indexed for automatic expiry (as specified) — correct for a high-volume, short-lived collection.

### CommunityPosts
- **Fields** (SRS §5): `user_id`, `category_id`, `content`, `media_urls`, `likes_count`, `created_at`.
- **Status**: schema-ready, feature postponed.

### AnalyticsEvents
- **Fields** (SRS §5): `event_name`, `user_id`, `session_id`, `properties` (JSON), `timestamp`, **TTL: 90 days**.
- **Indexes**: `event_name`, `user_id`, `timestamp`.
- **Event taxonomy**: defined in `ANALYTICS_ARCHITECTURE.md`, not here — this document owns the storage shape, not the event catalogue.

## 3. What's deliberately not implemented yet

Per `DESIGN_PHASE_REVIEW.md` §6, schemas for Subscriptions/CommunityPosts exist (SRS already scaffolded them) but no service/repository/controller code is built until their respective roadmap phase — the schema readiness is intentional (avoids a later migration), the feature build is not.

---

*Base fields/indexes: SRS §5 (unchanged). Feeds: `API_ARCHITECTURE.md`, `BACKEND_ARCHITECTURE.md` (repository layer), `AI_ARCHITECTURE.md` (AIConversations usage).*
