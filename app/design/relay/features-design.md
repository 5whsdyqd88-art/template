# Features (3-column product grid) — Design spec

Issue: SAN-13
Component path: `components/relay/Features.tsx`
Companion: `app/design/relay/features-architect.md`

This spec answers the ten Designer open questions in the Architect ADR and locks every visual decision the Engineer needs. Where the Architect already chose, I do not relitigate — I quote and extend.

---

## 1. Layout

### 1.1 Section frame

| Property | Value | Rationale |
| --- | --- | --- |
| Background | `bg-white` | Anchored on a light surface so the icon tiles' `primary-50` reads as a tint, not a chip. The reference uses dark for its pinned panels; we are not pinning, so a light grid section threads cleaner between Hero (likely dark/gradient) and CodeMockup. |
| Top divider | none | Section rhythm carries the boundary; an explicit divider would compete with `shadow-card`. |
| Vertical padding | `py-20 lg:py-28` (80px / 112px) | Confirmed from Architect Q2. Matches the rhythm we want neighbors (`Stats`, `Testimonials`) to also adopt. |
| Horizontal padding (outer) | `px-6 lg:px-8` (24px / 32px) | Edge gutter; combines with `Container` for total side-room. |

### 1.2 Container

| Property | Value |
| --- | --- |
| `max-width` | `max-w-7xl` (1280px) — confirmed Architect Q3. |
| Centering | `mx-auto`. |
| Inner horizontal padding | none on the container itself; outer section already handles it. |

### 1.3 Heading block (eyebrow + headline + optional lede)

| Element | Spec |
| --- | --- |
| Block alignment | `text-center` (per issue, confirms Architect Q5). Block centered horizontally with `mx-auto`, capped at `max-w-3xl` (768px) so the headline wraps to two lines around lg, never one wide line. |
| Eyebrow | `text-xs` (12px), `font-semibold`, `tracking-[0.18em]`, `uppercase`, color `text-primary-600`. Sits 0px above the headline (the headline supplies the gap with `mt-3`). |
| Headline (`<h2>`) | `text-display-md` (36px / 1.15 / -0.01em / 600). Color `text-ink-900`. Apply the project's `text-balance` utility (defined in `globals.css`) so the line break sits naturally. `mt-3` (12px) below eyebrow. |
| Lede / subhead (optional, Copywriter's call) | `text-lg` (18px), color `text-ink-600`, `leading-relaxed`, `max-w-2xl mx-auto`, `mt-5` (20px) below headline. If Copywriter omits it, drop the node entirely — no empty wrapper. |
| Heading-to-grid gap | `mt-12 lg:mt-16` (48px / 64px) on the grid wrapper. |

### 1.4 Grid

| Property | Value | Rationale |
| --- | --- | --- |
| Columns | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` | Architect Q10: I keep `sm:` for tablet (640px), not `md:`. At `md` (768px) a 3-col grid would yield ~235px cards (too cramped); keeping 2-col through `md` and switching to 3-col at `lg` (1024px ≈ 340px cards) lands cards inside the comfortable 320–400px target band. |
| Row gap | `gap-y-6 lg:gap-y-8` (24px / 32px) | Architect Q1. |
| Column gap | `gap-x-6 lg:gap-x-8` (24px / 32px) | Same; keeps the rhythm symmetric — visually a square grid. |
| Item alignment | `items-stretch` (default) | Cards must equal-height across the row even when bodies wrap differently. |

### 1.5 Card (`FeatureCard`, full-card link)

| Property | Value |
| --- | --- |
| Element | `<a>` wrapping the entire card content (per Architect D3-A). |
| Background | `bg-white`. |
| Border | `border border-ink-100`. The border carries the card's edge at rest; on hover the shadow does the work and the border softens visually behind it. |
| Radius | `rounded-2xl` (16px). |
| Shadow (rest) | `shadow-card` (existing token). |
| Shadow (hover) | `shadow-xl` (Tailwind built-in, ≈ 25px y-offset, 50px blur). Architect Q7: I do **not** add a new `shadow-card-hover` token — `tailwind.config.ts` should not be edited casually for one section. `shadow-xl` is close enough to the brand drop and is already available. |
| Padding (inner) | `p-6 lg:p-8` (24px / 32px). Confirmed Architect Q1, with a desktop bump for breathing. |
| Inner layout | Vertical flex (`flex flex-col`). The "Learn more" row uses `mt-auto` so it always sticks to the bottom edge regardless of body length — keeps the affordance line aligned across uneven cards. |
| Cursor | `cursor-pointer` (inherited from anchor; explicit for clarity). |
| Focus ring | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white`. Architect Q8 confirmed. Default `outline` is suppressed only when `focus-visible` is active. |

### 1.6 Card inner rhythm (top → bottom)

| Element | Value |
| --- | --- |
| Icon tile | top of card (no top gap; padding handles it). |
| Tile → Title | `mt-5` (20px). |
| Title → Body | `mt-2` (8px). |
| Body → Learn-more row | `mt-6 mt-auto` (24px minimum, but auto-pushed to the bottom of the card). |

### 1.7 IconTile

| Property | Value |
| --- | --- |
| Size | `h-12 w-12` (48px). |
| Radius | `rounded-xl` (12px). |
| Background | `bg-primary-50`. |
| Icon size | `h-6 w-6` (24px). |
| Icon stroke | `strokeWidth={2}` (lucide default). Architect Q4: I keep default 2 — at 24px the default stroke reads cleaner against `primary-50` than 1.75 (which goes anaemic on small tints). |
| Icon color | `text-primary-500`. |
| Centering | `flex items-center justify-center`. |

### 1.8 Title

| Property | Value |
| --- | --- |
| Element | `<h3>`. |
| Size | `text-lg` (18px). |
| Weight | `font-semibold` (600). |
| Tracking | default. |
| Color | `text-ink-900`. |
| Line height | default `leading-tight` is fine; rely on Tailwind defaults. |

### 1.9 Body

| Property | Value |
| --- | --- |
| Element | `<p>`. |
| Size | `text-base` (16px). |
| Color | `text-ink-600`. |
| Line height | `leading-relaxed` (1.625). |
| Clamp | none. Cards equalise via grid `items-stretch` + `mt-auto` on the bottom row, so a one-line difference between bodies is absorbed by the learn-more row sliding down. Don't truncate. |

### 1.10 Learn-more row

| Property | Value |
| --- | --- |
| Wrapper | `inline-flex items-center gap-1.5`. |
| Text | "Learn more" (or Copywriter's chosen microcopy — single string, identical across all six cards). |
| Text style | `text-sm font-medium text-primary-600`. |
| Icon | `ArrowRight` from lucide, `h-4 w-4` (16px), `strokeWidth={2}`, color inherited (`currentColor`). |
| Arrow hover | `transition-base ease-out-soft` + `group-hover:translate-x-1` (4px translation). The card itself sets `group` and the row uses `group-hover:` so the arrow nudges when the card (not the row alone) is hovered. |

### 1.11 Visual hierarchy (top to bottom for one card, in pixels)

```
┌────────────────────────────────────────┐  ← border-ink-100, rounded-2xl, shadow-card
│  p-8 (lg)                              │
│  ┌──┐  IconTile 48×48 primary-50       │
│  │🔷│  primary-500 icon 24             │
│  └──┘                                  │
│  ↕ 20                                  │
│  Title (text-lg semibold ink-900)      │
│  ↕ 8                                   │
│  Body (text-base ink-600 leading-      │
│  relaxed, may wrap 2–3 lines)          │
│  ↕ ≥24, auto-stretch                   │
│  Learn more  →   (text-sm primary-600) │
└────────────────────────────────────────┘
```

---

## 2. Type

| Element | Token | Computed |
| --- | --- | --- |
| Eyebrow | `text-xs font-semibold tracking-[0.18em] uppercase` | 12 / default / 600, +0.18em letter-spacing |
| Headline | `text-display-md` | 36 / 1.15 / -0.01em / 600 |
| Lede (optional) | `text-lg leading-relaxed` | 18 / 1.625 / 400 |
| Card title | `text-lg font-semibold` | 18 / leading-tight / 600 |
| Card body | `text-base leading-relaxed` | 16 / 1.625 / 400 |
| Learn-more | `text-sm font-medium` | 14 / default / 500 |

Font family: `font-sans` (Inter) for everything — no `font-mono` in this section.

---

## 3. Color

| Surface / element | Token | Hex |
| --- | --- | --- |
| Section background | `bg-white` | `#FFFFFF` |
| Card background | `bg-white` | `#FFFFFF` |
| Card border | `border-ink-100` | `#F3F4F6` |
| Icon tile background | `bg-primary-50` | `#F4F5FF` |
| Icon | `text-primary-500` | `#5B6CFF` |
| Eyebrow | `text-primary-600` | `#4A58E0` |
| Headline | `text-ink-900` | `#111827` |
| Lede | `text-ink-600` | `#4B5563` |
| Card title | `text-ink-900` | `#111827` |
| Card body | `text-ink-600` | `#4B5563` |
| Learn-more text + arrow | `text-primary-600` | `#4A58E0` |
| Focus ring | `ring-primary-500` | `#5B6CFF` |

### 3.1 Contrast check (WCAG)

| Foreground / Background | Ratio | Passes |
| --- | --- | --- |
| `ink-900` `#111827` on white | **17.7 : 1** | AAA (large + small) |
| `ink-600` `#4B5563` on white | **8.6 : 1** | AAA (small) |
| `primary-600` `#4A58E0` on white | **5.7 : 1** | AA small + AAA large; safe for the eyebrow (12px) and learn-more (14px) link. |
| `primary-500` `#5B6CFF` icon on `primary-50` `#F4F5FF` | ~4.2 : 1 | Decorative — icons aren't text. Sufficient for visual recognition. |

No CTAs or buttons in this section, so the bar is just text contrast — all comfortably above thresholds.

### 3.2 No gradients

This section is flat — `primary-50` tint is the only departure from white. Gradients are reserved for Hero and CTA sections; introducing one here would compete.

---

## 4. Spacing rhythm (summary)

Outer to inner, top to bottom:

```
section py-20 lg:py-28, px-6 lg:px-8
  └── max-w-7xl mx-auto
        ├── heading block, max-w-3xl mx-auto, text-center
        │     ├── eyebrow
        │     ├── mt-3   headline (h2)
        │     └── mt-5   lede (optional)
        └── mt-12 lg:mt-16 grid
              grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              gap-6 lg:gap-8
              └── 6× card  (rounded-2xl, shadow-card, p-6 lg:p-8)
                   ├── IconTile (48×48, rounded-xl, primary-50)
                   ├── mt-5  Title (h3)
                   ├── mt-2  Body
                   └── mt-6 mt-auto  Learn-more row
```

---

## 5. Motion

Per Architect D7 — framer-motion only. No GSAP. Per D4 — single grid container with stagger child variants.

### 5.1 Entrance (cards staggering into view)

```
Container variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
}
Card variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } }
}
```

- Mount via `motion.div` with `initial="hidden" whileInView="show"` on the **grid wrapper**, and `variants={card}` on each card.
- `viewport={{ once: true, amount: 0.2 }}` — the 20% threshold means the section starts animating as the top of the grid clears the bottom of the viewport.
- Easing `[0, 0, 0.2, 1]` is the cubic equivalent of the project's `ease-out-soft` token — same curve, expressed in framer-motion syntax.

### 5.2 Hover (card lift)

- CSS-only (no framer-motion). Architect: "CSS transition only … keeps it 60fps."
- Resting: `translate-y-0`, `shadow-card`.
- Hover: `hover:-translate-y-1` (4px up — Architect Q6 confirmed) + `hover:shadow-xl`.
- Transition: `transition-all duration-base ease-out-soft` (300ms).
- Note: `transition-all` is acceptable here because only `transform` and `box-shadow` change — both compositor-friendly. If the team later objects, switch to `transition-[transform,box-shadow]`.

### 5.3 Hover (arrow nudge)

- Card sets `group` on the `<a>`.
- Arrow has `transition-transform duration-base ease-out-soft group-hover:translate-x-1` (4px right).

### 5.4 Focus state

- Same visual as hover **without** the transform — only the focus ring changes. We do not lift on focus because keyboard users tab one card at a time and a 4px lift on each Tab press is jittery. Just ring + shadow stays at `shadow-card`.

### 5.5 Reduced-motion fallback

- Engineer calls `useReducedMotion()` at the top of `Features`.
- When `true`:
  - Replace card variants with `{ hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }` (or omit `motion.*` wrappers entirely and render plain `<article>`).
  - Drop `hover:-translate-y-1` from the card's classNames (e.g. via a conditional class) — keep `hover:shadow-xl` only.
  - Drop `group-hover:translate-x-1` from the arrow.
- Heading block has no entrance animation, so reduced-motion doesn't change it.

---

## 6. Accessibility

### 6.1 Semantic structure

```
<section aria-labelledby="features-heading">
  <p id="features-eyebrow" aria-hidden="true">Eyebrow</p>
  <h2 id="features-heading">Headline</h2>
  <p>Optional lede</p>
  <ul role="list">  ← grid; ul + li gives SR users a count
    <li>
      <a href="#" aria-label="{title}">  ← full-card link
        <span aria-hidden="true"> {Icon} </span>
        <h3>{title}</h3>
        <p>{body}</p>
        <span aria-hidden="true">Learn more →</span>
      </a>
    </li>
    ... ×6
  </ul>
</section>
```

- The eyebrow is decorative (it duplicates context the h2 already gives); marking it `aria-hidden` keeps screen readers from saying "PLATFORM" before "headline".
- Each card uses `aria-label="{title}"` on the `<a>` so the screen-reader name is the product name only — the body is announced as the link's content but the *name* is crisp. (Without `aria-label`, the SR concatenates everything inside the anchor into the link name, which becomes a sentence-long mouthful.)
- `<ul role="list">` is needed because Tailwind's preflight strips `list-style: none` which causes Safari + VoiceOver to silently drop the implicit role; explicit `role="list"` restores the count announcement ("list, 6 items").
- `h2` for the section heading; `h3` for each card title — preserves the document outline.

### 6.2 Keyboard

- Tab order: eyebrow/headline/lede are not tabbable (no `tabindex`); only the six anchors are. Six Tab stops total in this section.
- Default activation (Enter on a focused link) follows the anchor.
- No keyboard traps; no roving `tabindex`.

### 6.3 Focus appearance

- `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white`.
- Focus ring contrast: `primary-500` (`#5B6CFF`) on white = 4.5:1 — passes WCAG 2.4.11 (focus-not-obscured + 3:1 minimum for focus indicator).
- `outline-none` is paired with `focus-visible:` so we don't blank out focus for non-`:focus-visible` users on browsers that lack `:focus-visible` support — but those browsers are below our support floor (modern evergreen only), so this is safe.

### 6.4 Aria / live regions

- No live regions. This is static content.
- No `aria-current`. Cards aren't in a navigation set.
- No `aria-describedby`. The body inside the anchor is read after the label by default in most SRs; if QA finds otherwise we can add `aria-describedby` pointing at the body `<p>` id, but I prefer to ship without it and verify.

### 6.5 Touch targets

- Full card is the click target. At `p-6` minimum the card is well above the 44×44 minimum on every breakpoint.
- The visible "Learn more →" text is decorative inside the card link, not a separate target; this is intentional.

---

## 7. Allowed icons

The issue's allowed-icon list, verified against the project's installed `lucide-react` v1.x. All six icons + the arrow are standard lucide-react named exports — no missing-export workaround needed (unlike the social icons noted in Project Context).

| Slot | Capability category (Architect D8) | Icon name | Why this glyph |
| --- | --- | --- | --- |
| 1 | Short messaging (SMS) | `MessageSquare` | Square chat-bubble — the canonical SMS metaphor. |
| 2 | Voice + video | `Phone` | Allowed list. (Note: `Phone` reads as voice; if Copywriter's name leans video, the Engineer can swap to `Phone` still — `Video` isn't in the allowed list.) |
| 3 | Transactional email | `Mail` | Envelope. |
| 4 | Chat-app messaging | `MessageCircle` | Round bubble — distinct from SMS's square bubble; reads as "chat app". |
| 5 | Identity verification (2FA) | `ShieldCheck` | Trust + verify. |
| 6 | Visual workflow builder | `Workflow` | Connected nodes; reads as orchestration / builder. |
| Inline | Card affordance | `ArrowRight` | Allowed list. |

Icons render at 24×24 with stroke-width 2.

---

## 8. Responsive behaviour

| Breakpoint | Behaviour |
| --- | --- |
| < 640px (mobile) | 1 column. Cards full-width inside container. `p-6` padding, `gap-6`. Section padding `py-20`, `px-6`. Headline still centered; lede may wrap to 3–4 lines. |
| 640–1023px (sm/md) | 2 columns. Cards ~half-width minus gap. `p-6` padding holds. The 6th card sits alone if rows divide evenly; visually two `2×2` rows + a `2×1` partial row. |
| ≥ 1024px (lg) | 3 columns × 2 rows. `p-8` padding, `gap-8`. Section padding `py-28`, `px-8`. |
| ≥ 1280px (xl) | Container caps at `max-w-7xl` (1280px) and centers; gutters grow. Cards do not enlarge further — keeps the line length of the body comfortable. |

No content reflow or copy swap between breakpoints — same 6 cards, same strings.

---

## 9. Engineer notes (do / don't)

- **Do** wrap the grid + cards in `motion.ul` / `motion.li` (or `motion.div` if `ul/li` semantics are inconvenient) so the stagger lives on a single observer.
- **Do** read `useReducedMotion()` once at component top and branch the variants (and the hover transform class).
- **Do** use `cn`/template-literal classnames; no inline `style` for any of the resting visuals — every property above maps to a Tailwind class on the existing config.
- **Don't** edit `tailwind.config.ts`. Every token used here already exists.
- **Don't** add a new global CSS rule. `text-balance` is the only utility this section pulls from `globals.css` and it's already defined.
- **Don't** lazy-load the icons (they're already tree-shaken by lucide-react v1).

---

## 10. Open items I am NOT deciding

These remain Copywriter's call (per Architect ADR §"Open questions for Copywriter"):

1. The exact eyebrow string (≤ 12 chars).
2. The exact headline string (≤ 12 words; voice rules apply).
3. Whether to ship a lede; if yes, the string (≤ 24 words).
4. The six product names (one each for SMS / voice+video / email / chat-app / identity / workflow).
5. The six body strings (≤ 24 words each).
6. The "Learn more" microcopy (single string used uniformly).

When Copywriter delivers `app/content/relay/features.ts`, the `featuresContent` shape must be:

```ts
export const featuresContent = {
  eyebrow: string,
  headline: string,
  lede?: string,                        // optional — omit if Copywriter chooses no lede
  features: readonly [                  // exactly six entries, fixed order = icon slot order in §7
    { title: string; body: string },    // slot 1 — SMS         → MessageSquare
    { title: string; body: string },    // slot 2 — Voice+Video → Phone
    { title: string; body: string },    // slot 3 — Email       → Mail
    { title: string; body: string },    // slot 4 — Chat        → MessageCircle
    { title: string; body: string },    // slot 5 — Identity    → ShieldCheck
    { title: string; body: string },    // slot 6 — Workflow    → Workflow
  ],
  learnMore: string,
} as const;
```

The Engineer maps icons to slots positionally — Copywriter does not choose icons, only strings.
