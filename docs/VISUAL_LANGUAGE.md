# GURUKUL — Visual Language (Gurukul-Era Direction)

**Status**: Canonical visual direction. Supersedes the "restrained modern/typographic" direction previously recorded in `UX_ARCHITECTURE.md` §4 and `ADR-010`. See `ADR-011` for the reversal and its reasoning.

---

## 1. The intent

GURUKUL should feel like it comes *from* the gurukul era — the atmosphere of an ancient Indian place of learning — while functioning as a modern coaching product. The earlier direction (cool navy, Poppins/Inter, ornament-free) was technically clean but culturally mute: it read as generic premium SaaS. This direction corrects that.

**Target feeling**: warm, grounded, reverent, disciplined, timeless. Lamplight on stone. A place where learning is a practice, not a transaction.

**Not**: a devotional/religious app, a heritage-tourism brochure, or a costume-drama pastiche.

## 2. The one hard boundary — iconography vs. atmosphere

We evoke the era through **architecture, material, pattern, light, and geometry** — never through **religious figures or deity imagery**.

| We use | We do not use |
|---|---|
| Temple arch and shikhara silhouettes (abstracted to line) | Depictions of deities, avatars, or named religious figures |
| Jali (lattice) screens as texture | Devotional symbols used as decoration (om, swastika, trishul) |
| Lotus/chakra geometry, abstracted to radial line-work | Illustrations of religious scenes or epics |
| Manuscript borders, corner marks, palm-leaf proportions | Photographic temple imagery or stock "spiritual India" photos |
| Brass, terracotta, sandstone, kumkum, indigo as pigments | Saffron-flag or politically-coded color combinations |
| Diya (oil lamp) as a light/streak motif | Any figure that implies religious endorsement |

**Why this line exists**: the product serves anyone pursuing self-discipline, regardless of faith. Architecture and pattern read as *cultural heritage*; deity imagery reads as *religious affiliation*. The first is inviting to everyone; the second narrows the audience and misrepresents what the product is. This boundary is non-negotiable even as the aesthetic warms.

## 3. Palette — warm earth and lamplight

Replaces the cool navy palette. The SRS brand gold is **retained** but re-grounded: on warm ink it reads as *brass and lamplight* rather than modern luxury-gold.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#14100C` | Base ground — deep warm black-brown (temple stone at night) |
| `--ink-2` | `#1E1811` | Raised surface |
| `--ink-3` | `#2A2118` | Card surface |
| `--brass` | `#D4AF37` | Primary accent, CTAs (SRS brand gold, retained) |
| `--brass-lit` | `#E8C866` | Hover/highlight |
| `--brass-dim` | `rgba(212,175,55,.14)` | Selected fills, ornament washes |
| `--terracotta` | `#C1663A` | Secondary accent — temple brick, earth |
| `--maroon` | `#7A2233` | Deep accent — kumkum, used sparingly |
| `--indigo` | `#2E3B5C` | Tertiary accent — natural dye |
| `--sand` | `#E6D9BE` | Primary text — parchment, warmer than white |
| `--sand-dim` | `#A99A7C` | Secondary text |
| `--jade` | `#4E8C76` | Success — natural pigment green |
| `--border` | `rgba(212,175,55,.18)` | Default rule |
| `--border-lit` | `rgba(212,175,55,.38)` | Emphasis rule |

**Deliberate change from SRS §13**: text is `#E6D9BE` (parchment) not `#FFFFFF`, and ground is warm `#14100C` not cool `#1a1a2e`. Pure white on warm ink reads clinical and breaks the atmosphere. Contrast: `#E6D9BE` on `#14100C` ≈ 13.6:1 — comfortably WCAG AA/AAA.

## 4. Typography — carved stone and manuscript

| Level | Font | Rationale |
|---|---|---|
| Display | **Marcellus** | Classical Roman-inscriptional serif; reads as carved stone. Timeless without being costume. |
| Quote / editorial | **Cormorant Garamond** (italic) | For wisdom-quote passages — literary, manuscript-adjacent. |
| Body / UI | **Mukta** | By Ek Type (Indian foundry), designed so Devanagari and Latin harmonise. Excellent screen legibility, and gives us Devanagari support in the same family. |

**Deliberate change from SRS §13** (Poppins/Inter): geometric sans fonts are the single biggest contributor to the "generic modern SaaS" read. Poppins in particular is a tech-startup signature. Marcellus + Mukta carries the era while staying fully legible.

**Devanagari usage**: used as a small *accent* only — e.g. `गुरुकुल` set small above the Latin wordmark, or a section eyebrow. Never load-bearing for comprehension (all functional text is Latin), so the product stays usable for non-Devanagari readers.

## 5. Ornament — the discipline that keeps it from becoming gaudy

Ornament is what makes this aesthetic work, and also what most easily ruins it. Four rules:

1. **Ornament frames; content stays clear.** Decoration lives at edges, borders, section thresholds, and card tops. The interior of any content area — headline, body copy, CTA, data — stays clean and uncluttered.
2. **One ornamental gesture per section.** An arch *or* a rosette divider *or* a patterned band — not all three. When in doubt, remove one.
3. **Ornament is line, not fill.** Drawn as thin brass stroke-work at low opacity (typically 0.15–0.4), never as heavy filled graphics. This keeps it feeling engraved rather than printed-on.
4. **Hierarchy always wins.** No ornament may compete with the primary action on a screen. If a decorative element draws the eye before the CTA does, it is too strong.

**Ornament vocabulary** (all drawn as inline SVG, no image assets):
- **Cusped arch** — framing device for hero, card tops, CTA bands.
- **Rosette** — 8-fold radial lotus/chakra geometry; used as a divider centrepiece and inside icon frames.
- **Corner brackets** — manuscript-border marks on significant cards.
- **Jali lattice** — CSS-generated diamond lattice at ~4% opacity, used as a large-area background texture.
- **Diya (lamp)** — the streak/consistency motif, replacing a generic flame icon.
- **Double rule** — paired thin lines as a section threshold.

## 6. Light

Light is the emotional carrier of this direction. Every major surface has a single warm light source implied — a radial brass glow behind the hero, behind CTA bands, behind the arch. This is what produces "lamplight on stone" rather than "dark mode." Glows are wide, soft, and low-opacity; never a hard neon bloom.

## 7. What carries over unchanged from the earlier work

The reversal is **visual only**. All of the following remain exactly as specified and are unaffected:

- Information architecture and navigation model (`INFORMATION_ARCHITECTURE.md`)
- All user journeys and screen inventory (`GYM_USER_JOURNEYS.md`, `UX_ARCHITECTURE.md` §2, §5–8)
- Dashboard composition (`ADR-010`'s adopted layout patterns — sidebar shape, goals list, journey timeline, progress card)
- Spacing scale, grid, breakpoints, responsive rules (`DESIGN_SYSTEM.md` §3, `RESPONSIVE_GUIDELINES.md`)
- Motion principles and reduced-motion policy (`MOTION_GUIDELINES.md`)
- Accessibility baseline — WCAG 2.2 AA, focus states, 48px targets (`DESIGN_SYSTEM.md` §6)
- Component inventory and state system (`COMPONENT_SPECIFICATION.md`)
- Entire system/backend/API/database architecture

Only palette, typography, and ornament change.

## 8. Failure modes to watch for in review

Reject any screen where:
- Ornament appears in more than two distinct forms in one section.
- Body copy sits on top of a visible pattern (legibility loss).
- Gold covers more than roughly 10% of the visible area (it stops reading as precious).
- A decorative element is the highest-contrast thing on screen instead of the CTA.
- The result feels like a temple *website* rather than a coaching product with cultural grounding.

---

*Feeds: all screen design. Supersedes `ADR-010`'s hero decision via `ADR-011`. Palette/type changes from SRS §13 are recorded explicitly in §3 and §4 above rather than applied silently.*
