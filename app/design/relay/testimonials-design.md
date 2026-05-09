# Testimonials — Design Spec

Issue: [SAN-16](mention://issue/bc56fe4f-6a1c-49e5-9dfb-c94bbb21cbb9) — Testimonials (3 quote cards)

Companion to `testimonials-architect.md`. Resolves the ten open questions for Designer; Copywriter questions remain for the next handoff.

## At a glance

A calm `bg-primary-50` band between the (still-placeholder) `Stats` band and the eventual `CTA`. Three white cards in a single row from `md` up, stacked on phones. Quotes are the visual hero — large `Quote` glyph in `primary-200` sits behind the top-left of each card; the body type is generous and soft. Cards lift on hover with a stronger shadow and a 4-px translate. Stagger fade-up on viewport entry, ~120 ms apart, fully suppressed under `prefers-reduced-motion`.

## Layout

### Section frame

| Property | Value | Notes |
|---|---|---|
| Section tag | `<section>` with `aria-labelledby="testimonials-heading"` | Heading inside is `<h2 id="testimonials-heading">`. |
| Background | `bg-primary-50` (flat) | Resolves D7 — see [§D7](#d7-background). |
| Vertical padding | `py-24 md:py-32` | Matches the rhythm Architect noted (Q9). |
| Horizontal padding | `px-6 md:px-10` (inner container) | Mobile gutter is intentional; cards never touch the viewport edge. |
| Inner container | `mx-auto max-w-7xl` (≈ 1280 px) | Same max-width assumed across the page set. If a sibling section settles on `max-w-6xl`, switch to that — consistency wins over absolute width. |

### Heading block

| Property | Value |
|---|---|
| Alignment | **Left-aligned** (resolves Q6 — see [§Heading alignment](#heading-alignment)). |
| Eyebrow | `text-xs font-mono uppercase tracking-[0.18em] text-primary-700` |
| Heading | `text-display-md font-semibold text-ink-900 max-w-2xl mt-3` (token already carries `letterSpacing -0.01em` and `lineHeight 1.15`) |
| Heading text balance | Add `text-balance` utility (Tailwind `text-wrap: balance` via the `font-feature: balance` token noted in Project Context) so two-line headlines break evenly. |
| Gap to grid | `mt-12 md:mt-16` between heading block and the card grid. |

### Card grid

| Property | Value |
|---|---|
| Grid | `grid grid-cols-1 md:grid-cols-3` (resolves D6 — single stack on mobile, three abreast from `md` ≥ 768 px). |
| Gap | `gap-6 md:gap-8` (24 px → 32 px). |
| Row alignment | `items-stretch` so unequal-length quotes still produce equal-height cards. |

### Card

| Property | Value |
|---|---|
| Tag | `<figure>` containing `<blockquote>` and `<figcaption>`. |
| Surface | `bg-white` |
| Radius | `rounded-2xl` (matches brief and `Features` cards per Q10 assumption — Engineer to verify against `Features` once that lands). |
| Shadow (rest) | `shadow-card` (token from `tailwind.config.ts`). |
| Border | `ring-1 ring-ink-100` to keep the white card readable on the pale `primary-50` field. (Pure shadow on a near-white background washes out.) |
| Padding | `p-6 md:p-8` (resolves Q5 — 24 px on phones, 32 px from `md` up). |
| Inner stack | `flex flex-col gap-6` between the quote glyph block, the quote, and the figcaption. |
| Min height | `min-h-[260px]` so a one-sentence quote does not collapse the card height. |

## Typography

Token-anchored. Sizes are font-size tokens already defined in `tailwind.config.ts`; weights and colors are explicit.

| Element | Token / class | Notes |
|---|---|---|
| Eyebrow | `text-xs font-mono uppercase tracking-[0.18em]` | Mono draws the eye and matches developer-tool feel; tracking is wider than label-default. |
| Section heading | `text-display-md font-semibold` | 2.25rem / 1.15 LH from token. |
| Quote body | `text-lg leading-relaxed text-ink-800` | Matches brief. `font-normal`, no italics — the glyph already cues "this is a quote". |
| Speaker name | `text-sm font-medium text-ink-900` | Tightens against the role line. |
| Role + company | `text-sm text-ink-500` | Concatenated as `{role} · {company}` with a thin bullet separator. |
| Avatar initials | `text-sm font-semibold text-primary-700` tracking-wide | Two characters, uppercase, centered. |

Line lengths to check at QA: quote body should land 8–14 words per line at the desktop card width; if it consistently breaks below 8, drop to `text-base` and revisit.

## Color

| Surface | Value | Why |
|---|---|---|
| Section background | `bg-primary-50` (`#F4F5FF`) | Sets the testimonial block apart from neutral siblings without shouting. |
| Card surface | `bg-white` | Pure white pops cleanly against primary-50. |
| Card border | `ring-1 ring-ink-100` | Hairline so the white card has an edge on the tinted ground. |
| Eyebrow text | `text-primary-700` (`#3B46B8`) | Contrast vs `primary-50`: ≈ 9.6:1 — passes AAA. |
| Heading text | `text-ink-900` (`#111827`) | Contrast vs `primary-50`: ≈ 17:1 — AAA. |
| Quote body | `text-ink-800` (`#1F2937`) | Contrast vs white: ≈ 14.7:1 — AAA. Brief said `ink-800`; confirmed. |
| Name | `text-ink-900` | Contrast vs white: ≈ 19:1 — AAA. |
| Role / company meta | `text-ink-500` (`#6B7280`) | Contrast vs white: ≈ 4.83:1 — passes AA at this size (≥ 14 px non-bold). Already in the brief; do not lighten further. |
| Avatar disc | `bg-primary-100` (`#E8EBFF`) | All three cards (resolves Q4 — see [§Avatar tint](#avatar-tint)). |
| Avatar initials | `text-primary-700` (`#3B46B8`) | Contrast vs `primary-100` disc: ≈ 7.6:1 — AAA. |
| Quote glyph (decorative) | `text-primary-200` (`#D1D6FF`) at ~10–12 % opacity-feeling tint | Resolves Q2 / Q8 — see [§Quote glyph](#quote-glyph). |
| Hover shadow | `shadow-cta` token | Adds the brand-accent glow on lift. |

Do **not** introduce new color values. If a tint above ever needs to be darker for contrast, move along the same scale (`primary-700 → primary-800`) rather than minting a hex.

## Spacing rhythm

Vertical, top to bottom inside the section:

```
section padding-top         py-24 md:py-32   (96 → 128 px)
eyebrow
  ↓ 12 px (mt-3)
heading
  ↓ 48 → 64 px (mt-12 md:mt-16)
card grid (cards: gap-6 md:gap-8)
section padding-bottom      py-24 md:py-32
```

Inside a card, top to bottom:

```
p-6 md:p-8
quote glyph (decorative)
  ↓ 24 px (gap-6 in flex column)
blockquote (quote body)
  ↓ 24 px
figcaption row:
   avatar (40×40)
   ←→ 12 px
   { name on top, role · company below — gap-y of 2 px }
```

## Motion

### Entrance

GSAP-flavored intent (the architect spec mandates `framer-motion` for this one — see Engineer note below):

- **From:** `opacity: 0`, `y: 24`.
- **To:** `opacity: 1`, `y: 0`.
- **Easing:** `power2.out` ≈ framer's `[0.0, 0.0, 0.2, 1]` — i.e. our `ease-out-soft` token.
- **Duration:** 480 ms per card.
- **Stagger:** **120 ms** between cards (resolves Q7 — see [§Stagger timing](#stagger-timing)).
- **Trigger:** when the grid container's top crosses 80 % of the viewport (`whileInView` with `viewport={{ once: true, margin: "-10% 0px" }}` is fine — equivalent to GSAP `start: "top 90%"`).
- **Heading block:** identical curve, 0 ms delay. Eyebrow and heading move together as one block; do not stagger them against each other.

Engineer note: per the architect spec (D10), this is a `framer-motion` parent with `staggerChildren`. Numbers above translate as: parent variants `transition: { staggerChildren: 0.12 }`, child variants with `transition: { duration: 0.48, ease: [0, 0, 0.2, 1] }`.

### Hover (desktop, pointer: fine)

- `transform: translateY(-4px)`
- Shadow: `shadow-card → shadow-cta`
- Border ring: `ring-ink-100 → ring-primary-200`
- Quote glyph: `text-primary-200 → text-primary-300` (subtle warm-up)
- Duration: 200 ms in, 240 ms out (slightly slower restore feels grounded).
- Easing: `ease-out-soft`.
- No tilt. Tilt on a quote card reads as toy-like at this density.

Resolves Q3.

### Tap / active

- `transform: translateY(-2px) scale(0.995)` for 120 ms.
- Cards are non-interactive (no link, no button) so this is purely a tactile pointer-down acknowledgement; if Engineer prefers to drop the active state entirely because there is no `onClick`, that is acceptable.

### Reduced motion

When `useReducedMotion()` returns `true`:

- Render heading and cards in their final state. No `y` transform, no opacity ramp, no stagger.
- Hover state still applies (it's an explicit user interaction, not "auto motion") but reduce magnitude: drop the translate to 0 and keep only the shadow + ring color change.
- The `Quote` glyph never animates anywhere, regardless.

## Accessibility

- **Section landmark:** `<section aria-labelledby="testimonials-heading">` with `<h2 id="testimonials-heading">` inside.
- **Card semantics:** `<figure>` with one `<blockquote>` and one `<figcaption>`. The `figcaption` contains name, role, company, and the avatar.
- **Avatar:** `aria-hidden="true"` (decorative — the figcaption already names the speaker). Alt text on the disc is not needed because there is no `<img>`.
- **Quote glyph:** `<Quote aria-hidden focusable={false}>` — decorative, no role.
- **Heading order:** the section's `<h2>` should be the only `h2` in the section; cards do not introduce headings.
- **Focus states:** there is no focusable element inside a card. Confirm at QA that nothing inside the card accidentally becomes focusable (e.g. a link injected later); if it does, add a visible focus ring (`focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-50`).
- **Keyboard nav order:** purely document order; no `tabindex`.
- **Color contrast:** all text/background combinations above meet WCAG AA at minimum (most are AAA). The lightest combination is ink-500 on white (4.83:1), which is the brief's chosen meta color. Do not lighten.
- **Motion:** see [§Reduced motion](#reduced-motion). The whole entrance opt-out is mandatory.
- **Screen-reader rendering:** with `<blockquote>` + `<figcaption>`, common screen readers will announce the quote then "figure caption — Maya Okafor, Staff Engineer · Norther." That is the desired flow.

## Allowed icons

Verified against `lucide-react` v1.x in this project (Project Context lists `Github`/`Twitter`/`Linkedin`/etc. as **missing**, but `Quote` is present).

| Icon | Use | Notes |
|---|---|---|
| `Quote` | Decorative glyph at the top of each card. | `aria-hidden`. Sized `w-8 h-8 md:w-10 md:h-10`. Color `text-primary-200`. No fill prop. |

No other icons in this section.

## Resolved open questions

### D7 — Background

**Decision: A — flat `bg-primary-50`.**

Reason: `CTA` is still a placeholder, so we cannot reliably "ease the seam" with a gradient yet. A flat band reads cleanly as a content block in its own right and lets `CTA` choose its own background later (most likely `primary-900` or a high-contrast band, in which case any white-fade gradient would fight it). If `CTA` lands on `bg-white`, revisit with a gradient `from-primary-50 to-white` — this is a cheap one-line change.

### Quote glyph

**Decision: large display character behind the quote, top-left of each card.**

- Use the `Quote` lucide icon, sized `w-8 h-8 md:w-10 md:h-10`.
- Position: top-left of the card's content stack, in flow (not absolutely positioned). It anchors the column the quote runs in.
- Color: `text-primary-200`. Light enough to feel decorative; dark enough on `bg-white` to register as deliberate (contrast 1.4:1 — intentional, decorative; aria-hidden, so contrast minimums do not apply).
- Do not flip / mirror the close-quote variant on the bottom right. One glyph per card.

Resolves Q2 and Q8.

### Heading alignment

**Decision: left-aligned.**

Reason: matches the page rhythm Architect noted (`Stats` is left-aligned in its eventual implementation per its position in the section sequence) and avoids the "cathedral" centred heading that pulls focus from the cards. The heading is also more scannable on wide screens when it sits flush with the leftmost card's left edge.

### Avatar tint

**Decision: all three avatars use the same `bg-primary-100` / `text-primary-700` pair.**

Reason: rotating tints (e.g. one warm, one cool) implies semantic difference between speakers that does not exist — they're three peer testimonials. Single-tint avatars also reinforce brand by repeating the primary tint three times in the most attention-grabbing element of each card. Resolves Q4.

### Stagger timing

**Decision: 120 ms between cards, 480 ms per-card duration.**

Reason: 80 ms feels nearly simultaneous (defeats the purpose of stagger); 150+ ms reads as "drag" on a three-element grid. 120 ms × 3 = 360 ms total stagger window, which sits inside the 480 ms duration so the third card is well into its motion before the first finishes — feels like one orchestrated entrance, not a queue. Resolves Q7.

### Card padding rhythm

**Decision: `p-6 md:p-8`.** Resolves Q5.

### Vertical rhythm

**Decision: `py-24 md:py-32` section padding; `mt-12 md:mt-16` between heading block and grid.** Resolves Q9.

### Card corner radius

**Decision: `rounded-2xl` (16 px) as briefed.** Engineer to verify alignment with `Features` cards once that section lands; if `Features` settles on `rounded-3xl`, lift this to match. Resolves Q10.

## Out of scope (Designer-side)

- Carousel, snap-scroll, dot indicators — already excluded by Architect.
- Per-card accent variation (different tint for each card) — explicitly rejected above.
- Animated counters or any in-card data viz.
- Background SVG ornaments (e.g. blob shapes behind the band). The flat tint is the ornament.

## Handoff

Open Copywriter questions remain unchanged from the architect spec (Q1–Q8 in that doc — eyebrow, headline, three original quotes, three names, three roles, three fictional companies, initials, and the content-module shape). Designer has nothing to add to that list.
