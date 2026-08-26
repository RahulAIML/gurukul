# GURUKUL — Infrastructure & CI/CD Architecture

**Status**: Baseline. Restates SRS §10 (DECIDED, unchanged) with environment-by-environment detail and a CI/CD pipeline (brief §31 explicitly warns against over-engineering it — this stays close to SRS §10's already-defined 4-step pipeline).

---

## 1. Stack (SRS §10, unchanged)

| Layer | Service |
|---|---|
| Frontend hosting | Vercel (auto-deploy, global CDN, edge functions, preview deployments) |
| Backend hosting | Render or Railway (Docker, auto-scaling, CI/CD, env management) |
| Database | MongoDB Atlas (managed, backups, replication, encryption) |
| Media | Cloudinary (image optimization, responsive delivery, video streaming) |
| Monitoring | PostHog (analytics/flags), Sentry (errors), OpenTelemetry (tracing) |
| Email | Nodemailer/SMTP (SRS §4) |
| Payments | Stripe (postponed feature, infra-ready) |
| AI Provider | Anthropic Claude API |

## 2. Environments

| Environment | Purpose | Frontend | Backend | Database |
|---|---|---|---|---|
| **Development** | Local iteration | Vite dev server (localhost) | Local Node process or Docker Compose | MongoDB Atlas dev cluster (or local MongoDB for fully offline work) |
| **Preview** | Per-PR review | Vercel PR preview deployment (automatic) | Not typically deployed per-PR for MVP scale (backend preview environments are a Phase 2+ nicety, not needed while the team is small — avoids over-engineering, per brief §31) — PR previews hit the shared staging API | Staging cluster (shared) |
| **Staging** | Pre-production QA | Vercel (staging branch/alias) | Render/Railway staging service | MongoDB Atlas staging cluster |
| **Production** | Live | Vercel (production) | Render/Railway production service | MongoDB Atlas production cluster |

Secrets are environment-scoped (Vercel/Render environment variable stores per SRS §9) — a staging API key is never valid in production and vice versa.

## 3. CI/CD pipeline (SRS §10's 4 steps, expanded with the brief §31 stages that were implicit but not spelled out)

```
Feature Branch
    ↓
Pull Request  (opens against main)
    ↓
Lint            (ESLint, both frontend/backend)
    ↓
Unit Tests      (Jest/Vitest — see TESTING_STRATEGY.md)
    ↓
Build           (Vite build for frontend, TS compile for backend)
    ↓
Preview         (Vercel PR preview, automatic)
    ↓
Merge to main → Staging deployment (Render, per SRS §10 step 2)
    ↓
QA testing on staging (SRS §10 step 3, manual + TESTING_STRATEGY.md's E2E suite against staging)
    ↓
Git tag (vX.Y.Z) → Production deployment (SRS §10 step 4: migrations, health checks, monitoring)
```

**Deliberately not added**: multi-stage canary deploys, blue/green deployment infrastructure, per-PR backend environments, or a separate integration-test environment beyond staging. Per brief §31's explicit instruction not to over-engineer the pipeline initially, staging *is* the integration/QA environment — a dedicated fourth environment isn't justified at this team size/traffic level and would be pure process overhead this early. Revisit if/when staging becomes a bottleneck (e.g., multiple features needing isolated QA simultaneously) — not a problem yet.

## 4. What runs at each CI stage

| Stage | Tooling | Blocks merge on failure? |
|---|---|---|
| Lint | ESLint (frontend + backend configs) | Yes |
| Type check | `tsc --noEmit` (both) | Yes |
| Unit tests | Vitest (frontend), Jest (backend) — see `TESTING_STRATEGY.md` | Yes |
| Dependency audit | `npm audit` (high/critical only block; low/moderate warn) | High/critical: Yes |
| Build | Vite build, backend TS compile | Yes |
| E2E (staging only, post-merge, not per-PR) | Playwright against staging — see `TESTING_STRATEGY.md` | Blocks production tag, not the PR merge itself |

## 5. Health checks & rollback

Production deploys include a post-deploy health check (`GET /api/v1/health` returning `200` with DB connectivity confirmed) before traffic is considered fully cut over — Render/Railway's built-in health-check-gated deploy feature is used rather than a custom mechanism. Rollback: redeploy the previous git tag — no custom rollback tooling is built for MVP; this is a manual-trigger, well-understood operation at this scale.

## 6. Observability wiring (SRS §3/§10, unchanged — restated as an infra concern)

- **Sentry**: error tracking + performance monitoring, wired in both frontend and backend from day one (matches SRS §15's "Build observability from day 1" recommendation).
- **PostHog**: product analytics + session replay + feature flags (SRS §3 names Feature Flags as a platform service — PostHog serves double duty here rather than adding a dedicated Unleash/LaunchDarkly instance, since SRS §4 lists both as options and PostHog is already required for analytics — avoids running two flagging systems).
- **OpenTelemetry**: distributed tracing across the API — primarily valuable once the system has more than one backend service; wired early per SRS's recommendation even though its full value is realized later.

---

*Base: SRS §3/§9/§10/§15 (unchanged). Feeds: `ROADMAP.md` (Phase 0/1 infra setup), `TESTING_STRATEGY.md`.*
