# GURUKUL — AI System Design

**Status**: Baseline, **design only — not implemented this phase** (per brief §27's explicit instruction). Closes gap R2 from `DESIGN_PHASE_REVIEW.md`.

---

## 1. Architecture

```
                    AI Gateway  (Shared Platform Service)
                    ├── Provider abstraction (Anthropic Claude API, SRS §4)
                    ├── Token budgeting & rate limiting
                    ├── Conversation persistence (AIConversations, DATABASE_ARCHITECTURE.md)
                    ├── Logging / observability hook
                    └── Safety guardrails (message-role separation, SECURITY_ARCHITECTURE.md §4)
                            │
              ┌──────────────┼──────────────┐
              │              │              │
          Gym Coach     English Coach   Cricket Coach
        (built, MVP)     (future)        (future)
```

The Gateway is platform-owned; each Coach is a **persona registration**, not a separate service — a persona is data (system prompt, context-builder function reference, tone guidelines) plus one category-owned function (`CategoryConfig.aiCoach.contextBuilder`, per `CATEGORY_ARCHITECTURE.md` §2), not a parallel AI integration per category.

## 2. Provider abstraction

The Gateway exposes one internal interface (`sendMessage(personaId, conversationId, userMessage)`); nothing in the category modules calls the Anthropic SDK directly. This is deliberate, not speculative — SRS §4 names the Anthropic Claude API specifically, so this isn't multi-provider abstraction "just in case"; it's a seam that keeps API-key handling, retry logic, and cost tracking in one place, and makes future provider changes (if ever needed) a Gateway-only change.

## 3. Persona / prompt structure

Each persona (`gymCoach`, future `englishCoach`, etc.) is defined as:

```typescript
interface CoachPersona {
  id: string;
  systemPrompt: string;          // tone, scope, boundaries — never user-editable
  contextBuilder: (userId: string) => Promise<CoachContext>;
  maxContextTokens: number;
}
```

`gymCoach`'s system prompt encodes: the brand voice (calm, disciplined, encouraging — never generic chatbot cheerfulness, per Product Principle 3), explicit scope boundaries (fitness/training guidance only — the Coach is not a general medical or nutrition authority; SRS §5's `health_conditions` field being present in Profile means the Coach should treat any flagged condition as "recommend consulting a professional" territory, not attempt to give medical advice), and a directive to reference the user's actual program/progress data when relevant rather than giving generic advice.

## 4. Context management

- `contextBuilder(userId)` assembles a **summary**, not raw data dumps: current goal, active program name + week, recent session ratings/streak — matching `DATABASE_ARCHITECTURE.md`'s `AIConversations.context` field, which stores a profile *summary* by design.
- Full conversation history isn't resent in full on every turn once a thread grows long — only the most recent N messages plus the standing context summary are sent, keeping per-request token cost bounded regardless of conversation length. Exact N is an implementation-time tuning decision within this design's cap, not fixed here.

## 5. Token budgets & cost controls (directly answers SRS §14's named AI-cost risk)

- **Per-user daily message cap**: enforced at the Gateway level (not per-persona), preventing a user from working around a category-specific limit by spreading messages across future categories' coaches.
- **Per-request max output tokens**: capped at a fixed ceiling appropriate for a coaching-chat response length (a few hundred tokens) — the Coach gives focused answers, not essays; this is both a cost control and a UX choice consistent with "guided, not overwhelming" (Product Principle 1).
- **Context truncation**: per §4, bounded regardless of thread length.
- **Caching**: identical/near-identical context summaries (e.g., a user asking a generic question with no session-specific detail) are candidates for prompt-level caching where the provider supports it — an optimization to revisit once real usage data exists, not a blocking requirement for MVP.

## 6. Safety

- Message-role separation prevents user input from overriding system instructions (per `SECURITY_ARCHITECTURE.md` §4).
- The Coach never fabricates program/progress data — its context is always grounded in what `contextBuilder` actually retrieves from the database; if data is missing (e.g., no sessions logged yet), the persona prompt instructs it to say so rather than inventing a plausible-sounding answer.
- Graceful degradation: if the daily cap is hit, the UI (AI Conversation screen, per `UX_ARCHITECTURE.md` §8) shows a clear, non-punitive message ("You've reached today's coaching limit — see you tomorrow!") rather than a generic error — this was flagged as a required design consideration in `DESIGN_PHASE_REVIEW.md` §7's risk register and is resolved here.

## 7. Logging

Every AI Gateway call logs (via the platform's Winston/Sentry/OpenTelemetry stack, SRS §10): persona id, token counts (input/output), latency, success/failure — feeds both cost monitoring and the `ANALYTICS_ARCHITECTURE.md` event `ai_coach_opened`/message-sent events. Message *content* logging is a deliberate privacy decision to make explicitly at implementation time (full content logging aids debugging but has privacy implications for health/fitness conversations) — flagged here as a decision to make when this is actually built, not assumed either way now.

## 8. What's explicitly not being built this phase

No API integration, no live prompt engineering, no actual Anthropic API calls. This document is the blueprint the Phase 7 roadmap item (`ROADMAP.md`) implements against.

---

*Depends on: SRS §4/§14, `CATEGORY_ARCHITECTURE.md` §2/§3, `DATABASE_ARCHITECTURE.md` (AIConversations), `SECURITY_ARCHITECTURE.md` §4. Feeds: `API_ARCHITECTURE.md` §9, `ROADMAP.md` Phase 7.*
