# CTA (gradient strip) — Visual Spec

Issue: SAN-17 · Component file: `components/relay/CTA.tsx` · Architect spec: `app/design/relay/cta-architect.md`

This spec resolves the seven Designer Open Questions in the architect doc and locks every visual decision the Engineer needs. Copywriter handles all string content separately.

Reference for layout intent only: `refs/twilio/scroll_10.png` (centered headline + subhead + single CTA over a saturated, dark backdrop) and `refs/twilio/scroll_11.png` / `scroll_12.png` for cadence around the strip. We diverge from the reference's solid navy backdrop in favour of a brand-gradient strip per the issue brief.

---

## 1. Layout

### Section container

- Element: `<section id="cta" aria-labelledby="cta-headline">`
- Width: full-bleed, edge-to-edge (`w-full`).
- Height: content-driven. No min-height.
- Padding: `py-20` mobile · `md:py-24` (96px) desktop. No `lg:py-*` step — the rhythm holds at 24.
- Side gutters: `px-6` mobile · `md:px-8` desktop. Inner content uses its own max-width container, see below.
- Overflow: `overflow-hidden` (the decorative SVG bleeds off all four edges and must be clipped).
- Position: `relative` (anchors the absolutely-positioned decorative layer).

### Inner content stack

- Wrapper: `mx-auto max-w-3xl` (768px) — applies to headline + subhead + CTA row. The CTA row sits inside the same wrapper so the column rhythm is shared.
- Alignment: `text-center`, items horizontally centered.
- Vertical rhythm:
  - headline → subhead: `mt-5` (20px)
  - subhead → CTA row: `mt-10` desktop · `mt-8` mobile (40 / 32px)

### Grid summary

```
section (full-bleed, gradient bg, py-24, overflow-hidden, relative)
├── decorative SVG layer (absolute inset-0, z-0, pointer-events-none, aria-hidden)
└── inner wrapper (relative, z-10, mx-auto, max-w-3xl, text-center)
    ├── h2#cta-headline    (display-md desktop / text-3xl mobile)
    ├── p subhead           (text-lg mobile / text-xl desktop)
    └── div CTA row         (flex, gap-3 / md:gap-4, flex-col sm:flex-row, justify-center, items-stretch sm:items-center)
        ├── a primary CTA
        └── a secondary CTA
```

### Responsive breakpoints

| Breakpoint | Section padding | Headline size | CTA row direction | CTA width |
|---|---|---|---|---|
| `< sm` (<640px) | `py-20 px-6` | `text-3xl` (1.875rem) | column, full-width buttons | `w-full` |
| `sm` (640–768) | `py-20 px-6` | `text-3xl` | row, auto width | `w-auto` |
| `md+` (≥768) | `py-24 px-8` | `display-md` (2.25rem) | row | `w-auto` |

There is no separate `lg`/`xl` step — the strip is intentionally constant past `md`.

---

## 2. Type

| Element | Token / class | Weight | Line-height | Tracking | Notes |
|---|---|---|---|---|---|
| Headline (`<h2 id="cta-headline">`) | `display-md` desktop · `text-3xl` mobile | 600 (per token) | 1.15 | `-0.01em` (per token) | `text-balance`, `font-sans` (Inter), color white at 100%. |
| Subhead (`<p>`) | `text-lg` mobile · `md:text-xl` | 400 | 1.5 (`leading-relaxed`) | default | `text-pretty`, `mx-auto max-w-2xl` (672px), color white at 0.88 opacity (see §3 contrast). |
| Primary CTA label | `text-base` (1rem) | 600 (`font-semibold`) | 1 (`leading-none`) | default | `font-sans`. |
| Secondary CTA label | `text-base` | 500 (`font-medium`) | 1 | default | `font-sans`. |

`font-feature-settings: "ss01", "cv11"` is fine to inherit from `app/layout.tsx` if already set globally; do not add at the component level.

Why `display-md` and not `display-lg`: this is a closing nudge, not the page's headline. Going larger steals attention from the Hero's `display-xl`.

---

## 3. Color, gradient, contrast

### Background gradient

- Class: `bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500`
- Direction: top-left → bottom-right (`135°` equivalent). Diagonal reads more energetic than horizontal/vertical and matches the brand voice.
- Three stops (resolves Q1 — yes to a third stop). The `via-primary-600` (#4A58E0) anchors the centred content over the darker midtone, which is what makes the contrast math work for the subhead.
- Stops are evenly distributed — no custom percentages.

### Text colors

| Element | Foreground | Background under it | Computed contrast | WCAG |
|---|---|---|---|---|
| Headline | `text-white` (1.0) | primary-700 → primary-500, sitting over ~primary-600 | ≈ 5.8:1 against primary-600; ≥ 4.3:1 against the brightest endpoint | AA large ✓ AAA at darker end |
| Subhead | `text-white/90` | over ~primary-600 | ≈ 4.9:1 | AA body ✓ |
| Primary CTA label | `text-primary-700` | white CTA bg | ≈ 9.0:1 | AAA ✓ |
| Primary CTA icon | `text-primary-700` | white CTA bg | same | ✓ |
| Secondary CTA label | `text-white` | gradient (worst case primary-500) | ≈ 4.3:1 | AA large ✓ — label is `text-base` so this is the tightest case in the spec; do not lower the opacity below 1.0 |

Do not use `text-white/80` for the subhead — at the bright end of the gradient it dips below 4.5:1 for body text.

### Surface colors

| Surface | Value |
|---|---|
| Primary CTA bg (rest) | `bg-white` |
| Primary CTA bg (hover) | unchanged — lift + shadow does the work, see §5 |
| Secondary CTA bg (rest) | `bg-transparent` |
| Secondary CTA bg (hover) | `bg-white/10` |
| Secondary CTA border | `border border-white/70` |

### Decorative-layer color

- All decorative paths: `stroke="white"` only. Opacity per path in §6.

---

## 4. Spacing rhythm

Vertical:
- Section padding: `py-20` / `md:py-24`.
- Headline → subhead: `mt-5` (20px).
- Subhead → CTA row: `mt-10` desktop / `mt-8` mobile.

Horizontal (inside the inner wrapper):
- CTA row gap: `gap-3` mobile / `md:gap-4` (12 / 16px).
- CTA buttons: `px-7 py-4` (28px / 16px) → ~56px button height with `text-base leading-none`.
- On mobile (<640px) buttons are `w-full` so they share the column width; gap collapses to vertical `gap-3`.

Horizontal (outside the inner wrapper):
- Section side padding: `px-6` mobile / `md:px-8` desktop.

---

## 5. CTAs — shape, size, states

### Primary CTA

- Tag: `<a href="#start">` (per architect D4).
- Shape: pill (`rounded-full`).
- Size: `h-14` (56px), `px-7`, `text-base font-semibold leading-none`.
- Layout: `inline-flex items-center justify-center gap-2`.
- Children: `<span>{ctaContent.primaryCta}</span>` then `<ArrowRight aria-hidden="true" className="h-4 w-4" />`.
  - Icon goes AFTER the label (resolves Q3). It signals forward motion; placing it before the label reads as a "back" affordance in left-to-right reading order.
  - Stroke width is the lucide default (2). Do not override.
- Colors: `bg-white text-primary-700`.
- Shadow (rest): `shadow-cta` (the project's CTA shadow token, sized for primary-blue glow on light bg — it works on the gradient because the rgba alpha keeps it subtle).
- Hover: `hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(91,108,255,0.55)]` with `transition duration-300 ease-out-soft`. The translate-y is the lift; the shadow grows slightly to anchor it.
- Active: `active:translate-y-0 active:scale-[0.98]` (depress).
- Focus-visible: see "Focus ring" below.
- On mobile: add `w-full` so it spans the column.
- Cursor: default (it's an anchor, the browser handles it).

### Secondary CTA

- Tag: `<a href="#contact">`.
- Shape: pill (`rounded-full`).
- Size: `h-14`, `px-7`, `text-base font-medium leading-none`.
- Layout: `inline-flex items-center justify-center`.
- Children: `<span>{ctaContent.secondaryCta}</span>` only — no icon.
- Colors (rest): `bg-transparent text-white border border-white/70`.
- Hover: `hover:bg-white/10 hover:border-white` with `transition duration-300 ease-out-soft`. No translate, no shadow — the secondary should feel quieter than the primary.
- Active: no scale (architect D-spec — only the primary depresses).
- Focus-visible: see "Focus ring" below.
- On mobile: `w-full`.

### Focus ring (resolves Q4 — single white ring with offset)

Same on both CTAs:

```
focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-white
focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600
```

The `ring-offset-primary-600` punches a band of midtone gradient between the button edge and the white ring, giving the ring a clear silhouette against both the white button (primary case) and the gradient (secondary case). A double ring or shadow halo was considered and rejected — single ring + offset is the cleanest, most-conventional pattern and tests well across the gradient's full luminance range.

---

## 6. Decorative SVG layer

One `<svg aria-hidden="true" focusable="false">`, absolutely positioned, full-bleed.

- Wrapper: `<svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice">`.
- Two curve paths (resolves Q2 — count: 2; opacity range: 0.08–0.10; bleed: yes; clipped by the section's `overflow-hidden`).

Path 1 — upper sweep, bleeds top + sides:
```
<path
  d="M -120 180 Q 360 -40 720 220 T 1560 200"
  stroke="white" stroke-opacity="0.10" stroke-width="1.5" fill="none"
/>
```

Path 2 — lower sweep, bleeds bottom + sides, mirrored direction:
```
<path
  d="M -120 460 Q 360 260 720 480 T 1560 420"
  stroke="white" stroke-opacity="0.07" stroke-width="1.5" fill="none"
/>
```

Optional third element (do include — it adds the depth the brief asks for without becoming a third "curve"):

A radial highlight in the upper-right corner using an inline `<defs><radialGradient>`:
```
<defs>
  <radialGradient id="cta-glow" cx="80%" cy="0%" r="60%">
    <stop offset="0%"  stopColor="white" stopOpacity="0.18" />
    <stop offset="100%" stopColor="white" stopOpacity="0" />
  </radialGradient>
</defs>
<rect x="0" y="0" width="1440" height="600" fill="url(#cta-glow)" />
```

Layer order (back → front) inside the SVG: `<rect>` glow → Path 2 → Path 1.

No SVG animation. Parallax is explicitly out for v1 (architect D3).

---

## 7. Motion

Stack: framer-motion only (architect D1).

### Entrance — content stack

- The inner wrapper is a `motion.div`.
- `initial={{ opacity: 0, y: 24 }}`
- `whileInView={{ opacity: 1, y: 0 }}`
- `viewport={{ once: true, amount: 0.3 }}` (one-shot when 30% of the section is visible, matches architect's threshold).
- `transition={{ duration: 0.6, ease: [0.0, 0.0, 0.2, 1] }}` — the `ease-out-soft` cubic-bezier from `tailwind.config.ts`, expressed as a tuple for framer-motion.

### Stagger (light)

If implemented as three children inside one `motion.div` with `staggerChildren`:
- `transition={{ staggerChildren: 0.08, delayChildren: 0 }}`
- Each child uses the same `initial` / `animate` variants.

If you find the staggered version visually fussier than the single-block version in dev, drop the stagger and animate the wrapper as a single block — both readings of the section are acceptable. Default to single-block for simplicity; only stagger if the section feels flat in motion review.

### Hover / active / focus

These are CSS transitions, not framer-motion. Spec already in §5. Token: `transition duration-300 ease-out-soft`.

### Reduced motion (resolves architect D6 fully)

- Use `useReducedMotion()` from framer-motion at the top of the component.
- When `true`:
  - Render the inner wrapper as a plain `<div>` (or pass `initial={false}` and `animate={false}` to the `motion.div`) so no transform/opacity transition runs and the final state paints immediately.
  - Keep all hover/focus/active CSS transitions — they are interaction feedback, not autoplay, and the OS preference does not ask us to disable them.
- Do not animate the decorative SVG ever — it is static for both motion modes.

---

## 8. Accessibility

- Section landmark: `<section id="cta" aria-labelledby="cta-headline">`.
- Headline: `<h2 id="cta-headline">` — the section's accessible name comes from this id.
- Decorative SVG: `aria-hidden="true" focusable="false"`. No `role`.
- ArrowRight icon: `aria-hidden="true"` — the button label carries the meaning.
- Focus order: primary CTA first, secondary CTA second. DOM order matches visual order on both desktop (row) and mobile (column).
- Focus rings: see §5.
- Keyboard: both CTAs are native `<a>`, so Tab/Shift-Tab and Enter work without JS.
- Color contrast: see §3 table — every text/background pair meets at least WCAG 2.1 AA for its size.
- No live region, no ARIA roles beyond the landmark — the section has no dynamic content.
- No focus trap, no `tabindex` overrides, no skip links added (the page-level skip link in `app/layout.tsx` covers this).

---

## 9. Allowed icons

Verified against lucide-react v1.x exports:

| Icon | Used where | Verified export? |
|---|---|---|
| `ArrowRight` | trailing icon on the primary CTA | ✓ exported by lucide-react v1.x |

No other icons are used in this section. Per the architect spec the brief explicitly limits this section to ArrowRight.

---

## 10. Engineering hand-off notes (visual-only — no code)

- Component file: `components/relay/CTA.tsx` (the existing scaffold is a placeholder — replace its body wholesale).
- This component must declare `"use client"` because it uses `useReducedMotion()` and a `motion.div`.
- Content import path: `import { ctaContent } from "@/content/relay/cta"` — Copywriter delivers this module separately. Until it lands, do not stub the strings inline; wait for the content module so the build doesn't ship placeholder copy.
- Do not edit `tailwind.config.ts` — every token referenced here already exists.
- Do not add new shadow or color tokens — the component composes `shadow-cta` and an inline `shadow-[...]` for the hover state; that's the only deviation from tokens, and it is justified because the hover shadow is a one-off intensity bump, not a reusable surface.
- The `<a>` placeholder hrefs (`#start`, `#contact`) stay until the route map lands — see architect Q (CTA destinations) and D4. When routes resolve, swap to `next/link` `<Link>`.

---

## 11. What this spec does NOT decide

These belong to other roles and are intentionally left open:

- All copy strings — Copywriter (`app/content/relay/cta.ts`).
- Final destination URLs for the two CTAs — Architect / Engineer when route map lands.
- Analytics event names on click — Engineer / centralized analytics module.
- Whether to add scroll-linked parallax on the decorative SVG — deferred (architect D3); revisit only if the page feels static here after the rest of the page lands.
