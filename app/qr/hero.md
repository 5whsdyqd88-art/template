# Hero — Quality Reviewer verdict (SAN-331)

**Verdict: CHANGES REQUESTED**

Build (`npm run build`) passes. Hero renders standalone (verified on a temporary `/qr-hero-preview` route — the production `/` route returns HTTP 500 due to a sibling component error, but that is out of Hero's scope).

Inputs reviewed: `app/design/relay/hero-design.md`, `components/relay/Hero.tsx`. Screenshots at 1440 / 768 / 390. Axe-core (WCAG 2 AA + best-practice). Lighthouse mobile lab run.

---

## Blockers

### Visual fidelity

All three viewports show the right-column visual stage **missing**: 480px stage div collapses to `0 × 0` because `w-full` is absent. Confirmed via DOM measurement.

- **all viewports / stage** — `Hero.tsx:157` omits `w-full` on the stage container. `hero-design.md §1` (line 35): *"Stage (right column inner): `relative aspect-square w-full max-w-[480px]`."* Without `w-full`, all blob + code-chip composition is invisible.

Responsive prefixes are inverted (mobile-first violated), so every `<lg` viewport gets desktop sizes:

- **mobile (390) / `<h1>`** — measured `font-size: 60px` (text-display-xl). `hero-design.md §2` (lines 55–58): *"`< md`: `text-display-md`"* (= 36px). Implementation `text-display-xl lg:text-display-xl md:text-display-lg sm:text-display-md` cascades so the **base/smallest viewport** receives the **largest** token; each word of the headline now wraps to its own line, hero stretches to ~1041px tall.
- **mobile (390) / subhead `<p>`** — measured 18px / line 28px. `hero-design.md §2` (lines 66–67): *"`text-[1.125rem]` (18px) at `≥ md`; `text-base` (16px) at `< md`."* Implementation `text-[1.125rem] lg:text-[1.125rem] md:text-base` inverts the ramp.
- **mobile (390) / container** — measured `padding-left: 32px`. `hero-design.md §1` (line 19): *"`px-5` at `< md`"* (= 20px). Implementation `px-8 lg:px-6` has no `<md` rule and puts more padding on mobile than on desktop.
- **tablet (768) / container** — measured 32px. Spec wants `px-6` (24px) at md.
- **tablet (768) / subhead** — measured 16px / 24px. Spec wants 18px / 28px at ≥md (`md:text-base md:leading-6` is the wrong direction).
- **desktop (1440) / container** — measured `padding-left: 24px`. `hero-design.md §1` (line 19): *"`px-8` at `≥ lg`"* (= 32px). Implementation `lg:px-6` inverts this.
- **all viewports / vertical padding** — `py-24 lg:py-20 md:py-16 sm:py-14` on the grid div. `hero-design.md §1` (line 13): *"`pt-24 pb-20` at `≥ lg`; `pt-20 pb-16` at `md`; `pt-14 pb-12` at `< md`."* Implementation uses `py-*` (symmetric, never `pt-/pb-` split) and the prefix order makes mobile the largest. Mobile receives `py-24` = 96px instead of pt-14/pb-12 (56/48).
- **mobile (<sm) / CTA pair top gap** — class list `lg:mt-10 md:mt-10 sm:mt-8` provides **no base** `mt-*`. `hero-design.md §4` (line 134): *"CTA pair `mt-10` at `≥ md`; `mt-8` at `< md`."* At `< sm` (<640px) the pair has zero top gap.

### Accessibility

- `<a>.group` (primary CTA, `Start for free`) — **axe `color-contrast` (serious)**. Measured 4.17:1 (`#ffffff` on `#5B6CFF`), threshold 4.5:1 for normal text. The design.md §3 claim of "≈ 4.62:1" was optimistic — the actual rendered contrast falls below WCAG AA. `font-semibold` (600) does not satisfy WCAG's "bold" definition (≥ 700), so the large-text 3:1 path does not apply.

### Performance

- **mobile LCP** — Lighthouse mobile lab (simulated): **2561 ms**, threshold **2500 ms** (+61 ms / 2.4% over). Likely caused by the H1's `framer-motion` `initial={{ opacity: 0, y: 12 }}` deferring content paint until hydration finishes; on simulated Moto G4 / 4G this pushes LCP past 2.5s. CLS 0, TBT 4.5 ms — both well within budget.

---

## Notes (non-blocking, spec divergences worth fixing while addressing the blockers)

- `<section>` missing `aria-labelledby="hero-headline"` (`hero-design.md §6` line 251). Axe does not flag this at `serious`, so it's not an a11y blocker — but it is a clear spec rule.
- Stage div missing `role="presentation" aria-hidden="true"` (`hero-design.md §6` line 266). Same disposition as above.
- CTA timing functions written as `ease-[0,0,0.2,1]` produce invalid CSS (`cubic-bezier(...)` wrapper is required). Transitions silently fall back to browser default.
- `group-hover:motion-safe:translate-x-0.5` — variant order works but is non-idiomatic; `motion-safe:group-hover:translate-x-0.5` is the conventional ordering.
- Subhead carries both `max-w-prose` and `max-w-[520px]`; the latter wins, so the former is dead.

---

## Verification snapshot

| Metric | Measurement | Target | Pass |
|---|---|---|---|
| `npm run build` | success | success | ✓ |
| axe critical | 0 | 0 | ✓ |
| axe serious | 1 (color-contrast on primary CTA) | 0 | ✗ |
| Lighthouse mobile LCP | 2561 ms | < 2500 ms | ✗ |
| Lighthouse mobile CLS | 0 | < 0.1 | ✓ |
| Lighthouse mobile TBT | 4.5 ms | (INP < 200 ms proxy) | ✓ |
| Visual fidelity vs `hero-design.md` | 7 blockers above | within tolerance | ✗ |

Screenshots: `/tmp/qr-hero-shots/hero_{desktop_1440,tablet_768,mobile_390}.png` (local artifacts, not committed).
