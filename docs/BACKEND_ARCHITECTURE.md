# GURUKUL — Backend Architecture

**Status**: Baseline. Extends SRS §8 (layered structure, DECIDED) with layer responsibilities and the repository-usage decision (D3).

---

## 1. Layer chain (SRS §8, unchanged)

```
Client → API → Routes → Controllers → Services → Repositories → Models → MongoDB
```

## 2. Layer responsibilities

| Layer | Responsibility | Must NOT do |
|---|---|---|
| **Routes** | Declare endpoint paths + HTTP methods, attach middleware (auth guard, rate limit, validation schema), delegate to a controller function | Contain any business logic or direct model access |
| **Controllers** | Parse/shape the HTTP request into a plain call to a service, shape the service's result into an HTTP response, map thrown errors to status codes | Contain business logic (that's the service's job) or talk to Mongoose directly |
| **Services** | All business logic: validation beyond schema shape (e.g., "can this user enroll in this program"), orchestration across multiple repositories, calls to external services (AI Gateway, Stripe, Cloudinary) | Know about `req`/`res` (services are framework-agnostic, testable without spinning up Express) |
| **Repositories** | Persistence only: typed CRUD + query methods per model, one repository per Mongoose model | Contain business rules (a repository answers "give me active programs for this category," not "should this user see this program") |
| **Models** | Mongoose schemas, validation at the schema level (required fields, enums), indexes | Contain service-level logic |

## 3. Decision D3 — repository depth (confirms `DESIGN_PHASE_REVIEW.md` D3)

**Confirmed**: thin repositories, no generic base-repository abstraction layer, no repository interfaces with multiple implementations (there is one database — MongoDB — for the life of this roadmap; building a swappable-datastore abstraction now is exactly the "abstraction for its own sake" the brief warns against). Each repository is a plain class or module exporting typed functions against one Mongoose model:

```typescript
// modules/gym/gym.repository.ts
export const ProgramRepository = {
  findById: (id: string) => ProgramModel.findById(id).lean(),
  findByFilters: (filters: ProgramFilters) => ProgramModel.find(toQuery(filters)).lean(),
  create: (data: NewProgram) => ProgramModel.create(data),
  // ...
};
```

**When a repository is worth having at all** (vs. calling Mongoose directly from a service): always, for one reason — it gives services a mockable seam for unit testing (`TESTING_STRATEGY.md` §Unit) without needing a real MongoDB connection. That is the actual justification, not "layered architecture for its own sake."

## 4. Validation

Zod (SRS §4/§9 names Joi/Zod; Zod is used consistently since it's also the frontend's choice — SRS §4 — keeping one validation library across the stack reduces cognitive overhead and enables schema sharing for simple cases). Validation schemas live next to the route they guard (`modules/gym/gym.validators.ts`), applied as route middleware — a request that fails validation never reaches a controller.

## 5. Error handling

Single global error-handling middleware (Express, mounted last). Services throw typed errors (`class NotFoundError`, `class ValidationError`, `class ForbiddenError extends AppError`); the global handler maps error types to HTTP status codes and a consistent error response shape:

```json
{ "error": { "code": "NOT_FOUND", "message": "Program not found" } }
```

Controllers never `try/catch` and format errors themselves — they let errors propagate to the global handler, keeping error-response formatting in exactly one place.

## 6. Category module mounting

Per `CATEGORY_ARCHITECTURE.md` §6: `app.ts` mounts routers by iterating `categories.registry.ts`, not by importing `gym.routes.ts` by name in application bootstrap logic. This is what keeps adding a category a registration exercise rather than an `app.ts` edit.

## 7. Background jobs

`node-cron` (SRS §4, DECIDED). Jobs live in `src/jobs/`, one file per job (e.g., `dailyStreakReset.ts`, `weeklyDigestEmail.ts`). Jobs call into services exactly like an HTTP request would (a job is just another caller of the service layer) — no job contains business logic itself.

---

*Depends on: SRS §4/§8 (unchanged), `CATEGORY_ARCHITECTURE.md` §6, `DESIGN_PHASE_REVIEW.md` D3. Feeds: `API_ARCHITECTURE.md`, `TESTING_STRATEGY.md`.*
