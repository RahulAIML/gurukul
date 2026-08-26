# GURUKUL — Security Architecture

**Status**: Baseline. Restates SRS §9 (DECIDED, unchanged) and adds the threat model + areas SRS §9 didn't cover (AI abuse, audit logging depth, file upload).

---

## 1. Authentication security (SRS §9, unchanged)

JWT: 15-minute access tokens, 7-day refresh tokens in HTTP-only secure cookies. bcrypt, 12 salt rounds. Mandatory email verification on signup. Password reset via 24-hour email-based tokens. OAuth2 (Google, GitHub) scaffolded, not activated in MVP (per `DESIGN_PHASE_REVIEW.md` D4).

## 2. Authorization / RBAC (SRS §9, unchanged)

Roles: `user`, `moderator`, `admin`, `category_coach` (reserved, unused in Gym MVP — per D5). Resource-level access: users can only access their own data — enforced at the service layer (every query scoped by the authenticated `user_id`, never trusting a client-supplied user id in the request body/params for "whose data" questions). Admin operations logged with timestamp + actor (audit trail).

## 3. Data protection & API security (SRS §9, unchanged)

HTTPS/TLS 1.3 enforced. Secrets in environment variables, never in code/version control. Sensitive data (password hashes, payment tokens) encrypted at rest (MongoDB Atlas default encryption + application-level hashing for passwords). Rate limiting: 100 req/hour/IP baseline, tuned per endpoint (auth endpoints stricter — see §6 below). CORS restricted to the frontend origin, `credentials: include`. Input validation via Zod on all endpoints (confirms `BACKEND_ARCHITECTURE.md` §4). Helmet security headers (CSP, X-Frame-Options, X-Content-Type-Options). XSS prevention via input escaping and output encoding.

## 4. Areas SRS §9 didn't cover — filled in this phase

### File upload security
- Multer (SRS §4) handles multipart uploads (avatars, form-check videos in future).
- Constraints: file-type allowlist (image/video MIME types only, verified server-side by content inspection, not just the client-supplied extension), size limits enforced before the file reaches Cloudinary, uploads streamed directly to Cloudinary rather than persisted on the API server's filesystem (avoids the API server itself becoming a storage/attack surface).

### AI abuse protection
- Per-user daily message cap on `/ai/conversations/:id/messages` (specific number defined in `AI_ARCHITECTURE.md`'s token-budget section — this document owns *that a cap exists and is enforced server-side*, not the number itself).
- Prompt-injection awareness: user messages are never concatenated into a system prompt in a way that lets user input redefine the AI's role/instructions — the AI Gateway (see `AI_ARCHITECTURE.md`) keeps system instructions and user content in separate, clearly-delineated message roles per the Anthropic API's message structure, not string-concatenated.
- Content moderation: responses are not proactively filtered by a separate moderation model in MVP (cost/complexity not justified yet) — flagged as a Phase 2+ hardening item, not a gap silently ignored.

### Audit logging depth
- SRS §9 says admin operations are logged with timestamp + actor. This phase specifies: audit logs are a separate, append-only collection (not commingled with `AnalyticsEvents`, which is TTL'd at 90 days and meant for product analytics, not compliance/security records) — audit logs are NOT TTL'd.
- Logged at minimum: role/permission changes, account status changes (suspend/ban), any admin write to another user's data.

### Database security
- MongoDB Atlas network access restricted to the API server's egress IP(s)/VPC peering (not open to `0.0.0.0/0`), per Atlas managed-service defaults (SRS §10).
- Principle of least privilege on the Atlas database user the API connects as (read/write scoped to the application database only, no admin-level Atlas credentials embedded in the running application).

## 5. Threat model (lightweight, per brief §29)

| Threat | Vector | Mitigation |
|---|---|---|
| Credential stuffing / brute force login | Repeated `/auth/login` attempts | Rate limiting (stricter than global 100/hr — e.g., 10/hr per IP+email combination on auth endpoints specifically), generic error messages that don't reveal valid emails |
| Session hijacking | Stolen refresh token | HTTP-only, Secure, SameSite cookie flags; short-lived access token limits exposure window if a token leaks |
| Data exposure via IDOR (Insecure Direct Object Reference) | Requesting another user's `Progress`/`Goals` by guessing an id | Every service-layer query filters by the authenticated user's own `user_id` — never trusts a client-supplied user id for ownership checks |
| XSS via user-generated content (future: Community posts) | Malicious script in post content | Output encoding on render, CSP headers, input sanitization on write — postponed feature, but the pattern is established now so it's not retrofitted insecurely later |
| AI prompt injection | User attempts to override the Coach's system instructions via crafted messages | Message-role separation (see AI abuse protection above); Coach persona/instructions never derived from user-editable data |
| Excessive AI cost from abuse | Automated/scripted repeated AI calls | Per-user rate limits + daily token budget (see `AI_ARCHITECTURE.md`), monitored via Sentry/PostHog alerting on anomalous usage patterns |
| Secrets leakage | Accidental commit of `.env` or API keys | `.gitignore` enforcement, secrets exclusively in Render/Vercel environment variable stores, never in the repository |
| Supply-chain (npm dependency) risk | Compromised/vulnerable dependency | `npm audit` in CI (see `TESTING_STRATEGY.md`), dependency updates reviewed, not auto-merged blindly |

## 6. Endpoint-specific rate limiting (extends SRS §9's baseline)

| Endpoint group | Limit |
|---|---|
| Global baseline | 100 req/hour/IP (SRS §9) |
| `/auth/login`, `/auth/register`, `/auth/password-reset` | 10 req/hour per IP+email combination — stricter, since these are the highest-value targets for automated abuse |
| `/ai/conversations/:id/messages` | Per-user daily cap (see `AI_ARCHITECTURE.md`), independent of the IP-based global limit — cost control, not just abuse prevention |

---

*Base: SRS §9 (unchanged). Depends on: `BACKEND_ARCHITECTURE.md` §5 (error handling), `AI_ARCHITECTURE.md` (cost/abuse controls). Feeds: `TESTING_STRATEGY.md` (security testing scope), `INFRASTRUCTURE_ARCHITECTURE.md`.*
