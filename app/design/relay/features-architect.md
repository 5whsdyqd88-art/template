# Features — Architect Spec

Section: Features (3-column product grid) · Component: `components/relay/Features.tsx`

---

## Composition

- **Single component file** — no sub-components extracted; the card is rendered inline.
- **Client component** (`"use client"`) — required for `useReducedMotion()` and Framer Motion variants.
- **Full-width section**, white background, `border-b border-ink-100`.
- **Heading stack**: eyebrow `<p>` + `<h2 id="features-headline">` — centered, max-w-2xl.
- **Grid**: `<motion.ul role="list">` with `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- **Each card**: `<motion.li>` (or plain `<li>` under reduced motion) containing:
  - Icon container div
  - `<h3>` card title
  - `<p>` card body
  - `<a>` "Learn more" link with `<ArrowRight>` icon

## Data flow

- All string content imported from `app/content/relay/features.ts` as `featuresContent`.
- Icon lookup via a `const iconMap` keyed by the `icon` string field in each item.
- No props accepted; section is self-contained.

## Motion

- `containerVariants` (`show` with `staggerChildren: 0.08`) on `<motion.ul>`.
- `cardVariants` (`hidden`→`show`, opacity + y) on each `<motion.li>`.
- `useReducedMotion()` switches `<motion.li>` to plain `<li>` — container remains `<motion.ul>`.

## Icons

All from `lucide-react` (v1.x): `MessageSquare`, `Phone`, `Mail`, `MessageCircle`, `ShieldCheck`, `Workflow`, `ArrowRight`.
