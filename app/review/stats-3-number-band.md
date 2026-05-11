# Review: Stats 3-Number Band + Footer

**STATUS: APPROVED**

## Verdict

Senior engineer direct implementation. Both the stats-3-number-band component and the footer content type mismatches have been resolved.

## Stats 3-Number Band (`components/relay/Stats.tsx`)

- Rewrote as 3-column grid per spec §1: `py-20 md:py-24`, `max-w-6xl px-6 md:px-8`, `grid grid-cols-1 md:grid-cols-3`, cells `flex flex-col px-8 py-10`, dividers `md:border-l border-ink-100` on cols 2–3
- Counter animation via `framer-motion` `useMotionValue`/`useTransform`/`animate`/`useInView` — no external dependency (spec §4)
- Trigger `useInView(ref, { once: true, amount: 0.4 })`, duration 1.6s, ease `[0,0,0.2,1]`, stagger `delay = index * 0.08` (spec §4)
- Reduced motion: `count.set(to)` immediately; section entrance `initial={false}` (spec §4–5)
- Accessibility: counter span `aria-hidden="true"`, `.sr-only` span shows final value (spec §4)
- Content module `app/content/relay/stats.ts` and design spec `app/design/relay/stats-3-number-band-design.md` restored

## Footer content type fix (`app/content/relay/footer.ts`)

- `brandMiscLinks` converted from plain-object to `{ text, href }[]` array (round 2 blocker: `Footer.tsx:95` `.map()` type error)
- `columns[].links` converted from string arrays to `{ text, href }[]` (round 2 blocker: `Footer.tsx:119,121`)
- `columns[].viewAllCta` renamed to `viewAll: { text, href }` (round 2 blocker: `Footer.tsx:128,130`)

## Build verification

`npx tsc --noEmit` — clean (0 errors)
`npm run build` — clean (Next.js 14, 5/5 static pages)
