# QR Verdict — Stats (3-number band)

**Branch:** `v2-feature/stats-3-number-band`
**Component:** `components/relay/Stats.tsx`
**Design spec:** `app/design/relay/stats-3-number-band-design.md`

## Verdict: CHANGES REQUESTED

## Method

- `npm run build` — passed (Next.js 14.2.35, compiled successfully).
- Served the production build via `next start` on `127.0.0.1:3211`.
- Playwright screenshots at 1280 (desktop), 768 (tablet), 390 (mobile), with extra widths 900 / 1024 to bracket the failure.
- `@axe-core/playwright` scoped to `section[aria-label="Key statistics"]` at the same three viewports.
- Lighthouse 12.8.2 mobile run against the home page (the Stats section is in-route).

## Visual

| Viewport | Result |
|---|---|
| Desktop (1280) | Pass — three clean columns, dividers visible, type hierarchy matches §2. |
| Tablet (768) | **Fail — see blocker below.** |
| Mobile (390) | Pass — single column, dividers correctly suppressed (mobile rule in §1 Grid). |

### Blocker — tablet (768)

The numbers in columns 1 and 2 visually overlap: `99.99%` overruns its cell into `4.2B+`, and the `md:border-l` divider between them is obscured. At 768px the inner container resolves to ~704px wide, the three grid cells become ~234px wide each with `px-8` (~170px content area), and the prescribed `md:text-display-xl` (`3.75rem` / 60px bold, per `tailwind.config.ts`) on the string `99.99%` is wider than the cell — so the text overflows past the cell boundary into the adjacent column.

This violates §1 *Layout* — which establishes three distinct grid cells separated by `md:border-l` dividers — because the content of cell 1 visibly crosses into cell 2 at the lowest md viewport (768px exactly). At 900px and above the layout resolves cleanly, so the defect is bracketed to ~768–~880px.

Screenshot: `stats-tablet.png` (also reproduced at width 768 in `stats-w768.png`).

This is not a stylistic preference — the dividers and column structure are explicit in §1, and overlapping number glyphs render the section unreadable at the standard tablet breakpoint.

## Accessibility

axe-core scoped to `section[aria-label="Key statistics"]`:

| Viewport | minor | moderate | serious | critical |
|---|---|---|---|---|
| 1280 | 0 | 0 | 0 | 0 |
| 768  | 0 | 0 | 0 | 0 |
| 390  | 0 | 0 | 0 | 0 |

Clean. The animated counter span carries `aria-hidden="true"` and the `sr-only` final-value span is present, per §4.

(Whole-page axe surfaces one `serious` color-contrast violation and a `page-has-heading-one` moderate, both originating in unrelated placeholder sections — not in scope for this section's QR.)

## Performance (Lighthouse mobile, home route)

| Metric | Value | Target | Pass |
|---|---|---|---|
| LCP  | 2.3 s | < 2.5 s | yes |
| CLS  | 0     | < 0.1   | yes |
| TBT  | 60 ms | (INP proxy; target INP < 200 ms) | yes |
| Performance score | 0.99 | — | — |

INP is a field metric and not directly emitted by a Lighthouse lab run; TBT (60 ms) is well under the 200 ms ceiling that maps to INP.

## Summary

Build is green, axe is clean inside the section, Core Web Vitals are within targets. The blocker is a layout overflow at the md=768px viewport caused by the `md:text-display-xl` prescription in §2 colliding with the 3-column grid geometry at the smallest md breakpoint. Engineer should defer the display-xl jump to a higher breakpoint (e.g. `lg:` / ~1024px) or otherwise prevent the number glyphs from overrunning the cell.
