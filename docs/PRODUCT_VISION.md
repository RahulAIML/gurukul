# GURUKUL — Product Vision

**Status**: Approved baseline for Design + System Architecture Phase
**Supersedes**: Nothing — extends SRS §1–2 with product-level detail the SRS states but doesn't operationalize.

---

## 1. What we are building

GURUKUL is a multi-category personal growth platform. It launches with one category — **Gym/Fitness** — built on an architecture that treats Gym as *one tenant of a category system*, not as the product itself. English, Cricket, Career, Meditation, and Leadership are not features bolted onto a fitness app; they are future categories plugged into the same Shared Platform Services (SRS §3).

The product's job in Year 1 is narrower than the architecture's job. The **product** goal is: ship an excellent, premium, trustworthy Gym coaching experience that converts visitors into onboarded, retained users. The **architecture** goal is: do this without writing anything into the platform core that assumes "workout," "exercise," or "rep" — because that assumption is what makes English and Cricket expensive to add later.

## 2. Who this is for

Primary persona for the Gym MVP:

- **Urban Indian professional, 24–38**, moderate income, gym-curious or gym-lapsed. Has tried generic fitness apps (Cult.fit, HealthifyMe, generic YouTube programs) and found them either too commodity/transactional or too chaotic/unstructured.
- Wants **structure and a sense of being guided**, not a library of 10,000 videos to sort through themselves.
- Responds to **premium framing** — this is not a discount gym app, it's closer to hiring a disciplined personal coach.
- Comfortable with AI as a coaching medium *if* it feels genuinely personalized rather than generic chatbot output.

This persona is why "Ancient Wisdom. Modern Guidance." (SRS §2) is not just brand copy — it sets the tone for every screen: calm, disciplined, personal, never noisy or gamified in a childish way.

## 3. Product principles (operationalize SRS §2's positioning)

1. **Guided, not overwhelming.** Every screen answers "what should I do right now" — one clear primary action, not a dashboard of 12 equally-weighted widgets.
2. **Earned personalization.** The product should visibly get smarter about the user as they use it — onboarding answers, workout history, and AI conversations all feed into what's shown next. Personalization is demonstrated, not just claimed.
3. **Premium restraint.** No neon, no confetti-heavy gamification, no dark patterns, no upsell nagging. Premium is expressed through typographic quality, spacing discipline, and motion that has purpose — not decoration.
4. **Sophisticated, not literal, Indian identity.** The gold accent and "guru/gurukul" naming carry the cultural through-line. We do not use temple imagery, religious iconography, or literal ashram visuals. The wisdom reference is conceptual (a guru who knows you, is patient, is always available), not decorative.
5. **Category-blind core.** Anything built into Shared Platform Services must be nameable without the word "workout," "gym," or "exercise." If a shared component needs Gym-specific language, it's not shared — it belongs in the Gym category module.

## 4. What "done" looks like for the Gym MVP

A first-time visitor can: land on Gurukul → understand what it offers in under 10 seconds → select Gym → understand Gym's value → select a goal → complete a short onboarding → receive a program recommendation that feels earned, not generic → register → land in a dashboard that already reflects their choices → start their first workout.

A returning user can: open the dashboard → immediately see today's workout → complete it → see visible progress → optionally talk to the AI coach for guidance → trust that their data and progress persist and are private.

## 5. What GURUKUL is explicitly not (guardrails)

- Not a video library / on-demand class marketplace (Peloton-style).
- Not a social-first fitness app (Strava-style) — community is secondary, added later, and never the primary loop.
- Not a gamified habit app with streak-shaming or loot-box mechanics.
- Not a generic SaaS dashboard — every authenticated screen should feel considered for *this* product, not templated.
- Not a general-purpose chatbot wrapper — the AI Coach is scoped, has a defined persona per category, and has hard cost/behavior boundaries (see `AI_ARCHITECTURE.md`).

## 6. Success signals for the design phase itself

Per the originating brief, this phase is complete when the following questions are answerable purely from the documentation produced:

| Question | Answered in |
|---|---|
| What exactly are we building? | This document + `INFORMATION_ARCHITECTURE.md` |
| What will the user experience? | `GYM_USER_JOURNEYS.md` + `UX_ARCHITECTURE.md` |
| What will every major screen look/behave like? | `UX_ARCHITECTURE.md` + `DESIGN_SYSTEM.md` + `COMPONENT_SPECIFICATION.md` |
| How does the system work? | `SYSTEM_ARCHITECTURE.md` + `FRONTEND_ARCHITECTURE.md` + `BACKEND_ARCHITECTURE.md` |
| What technologies and why? | SRS §4 (unchanged) + `SYSTEM_ARCHITECTURE.md` §1 |
| What do we build first/second/third? | `ROADMAP.md` |
| How do we add English/Cricket later? | `CATEGORY_ARCHITECTURE.md` |
| How do we ensure quality? | `TESTING_STRATEGY.md` + `SECURITY_ARCHITECTURE.md` |

---

*Baseline decisions this document depends on: DESIGN_PHASE_REVIEW.md Conflicts 1–3 (timeline model, palette, recommendation engine) — all resolved per user confirmation.*
