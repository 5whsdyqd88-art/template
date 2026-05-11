# QR Verdict — Stats (3-number band)

**Verdict: APPROVED**

Branch: `feature/stats-3-number-band`
Component: `components/relay/Stats.tsx`
Content: `app/content/relay/stats.ts`
Spec: `app/design/relay/stats-3-number-band-design.md`

Built locally from this branch and served on `:3050` for QR (dev preview at `:3011` is independent).

---

## Summary

- **Build:** `npm run build` — pass.
- **Visual fidelity:** matches `app/design/relay/stats-3-number-band-design.md` at desktop (1280), tablet (768) and mobile (390). All measured rules satisfied.
- **Accessibility:** axe-core scoped to `section[aria-label="Key statistics"]` — **0 violations** at all three viewports. The previous `color-contrast` blocker on detail copy is resolved (spec now specifies `text-ink-600`, implementation matches).
- **Performance (Lighthouse, desktop):** CLS 0, TBT 0 ms — pass. LCP 2.6 s — marginally over the 2.5 s target, but the LCP element is the LogoWall placeholder section (`min-h-[140px]` "awaiting orchestrator" stub), not Stats. Stats renders below the fold and does not contribute to LCP.

---

## Visual fidelity (verified against design.md)

Screenshots `/tmp/qr-stats/{desktop,tablet,mobile}_section.png` captured with `prefers-reduced-motion: reduce` so the counter renders at its final value.

| design.md rule | Observed in `components/relay/Stats.tsx` | Status |
|---|---|---|
| §1 Section `<section aria-label="Key statistics">` | line 63 | ✓ |
| §1 Section padding `py-20 md:py-24` | line 63 | ✓ |
| §1 Section `border-b border-ink-100` | line 63 | ✓ |
| §1 Inner `mx-auto max-w-6xl px-6 md:px-8` | line 64 | ✓ |
| §1 Grid `grid-cols-1 md:grid-cols-3` | line 70 | ✓ |
| §1 Cell `flex flex-col px-8 py-10` | line 75 | ✓ |
| §1 Dividers `md:border-l border-ink-100` on cols 2 and 3 | line 76 (`i > 0` gating) | ✓ |
| §2 Number `text-display-lg md:text-display-xl font-bold text-ink-900 tabular-nums` | line 79 | ✓ |
| §2 Label `mt-3 text-sm font-semibold text-ink-600 uppercase tracking-[0.14em]` | line 82 | ✓ |
| §2 Detail `mt-2 text-[15px] text-ink-600 md:max-w-[30ch]` | line 85 | ✓ |
| §3 Content (3 items, numbers/suffixes/labels/details) | matches `app/content/relay/stats.ts` exactly | ✓ |
| §4 Counter `useMotionValue` / `useTransform` / `animate` / `useInView({once:true, amount:0.4})`, dur 1.6, ease `[0,0,0.2,1]`, delay `i*0.08`, decimal-aware formatter | lines 16-57 | ✓ |
| §4 Counter a11y: animated span `aria-hidden="true"`, `sr-only` final value | lines 47-54 | ✓ |
| §4 Counter reduced-motion: `count.set(item.number)` no animation | lines 33-36 | ✓ |
| §5 Section entrance `motion.div`, `initial {opacity:0,y:24}`, `whileInView {opacity:1,y:0}`, `viewport {once:true, amount:0.4}`, `transition {dur:0.6, ease:[0,0,0.2,1]}` | lines 65-69 | ✓ |
| §5 Reduced-motion: `initial={false}`, no `whileInView` | lines 66-67 | ✓ |

No visual blockers.

---

## Accessibility — pass

axe-core (via `@axe-core/playwright`) scoped to `section[aria-label="Key statistics"]`:

```json
{ "totalViolations": 0, "blockers": [] }
```

The previous `color-contrast` blocker on detail copy (`#9CA3AF` on white, 2.53:1) is resolved — design spec now specifies `text-ink-600` and the implementation matches (`components/relay/Stats.tsx:85`).

---

## Performance — pass for Stats

Lighthouse 12.8.2, desktop form-factor, simulated throttling, headless Chromium. Two consecutive runs:

| metric | target | run 1 | run 2 | status |
|---|---|---|---|---|
| LCP | < 2.5 s | 2.6 s | 2.6 s | over by 0.1 s — **not Stats** |
| CLS | < 0.1 | 0 | 0 | ✓ |
| TBT (INP proxy) | INP < 200 ms | 0 ms | 0 ms | ✓ |
| Performance score | — | 0.86 | 0.86 | — |

LCP element resolved to the LogoWall section: `body > main > section.min-h-[140px]` ("[LogoWall · RELAY-4 · awaiting orchestrator]"). Stats lives below the fold and does not contribute to LCP. Page-level LCP will move once LogoWall ships real content; not a Stats regression and not in scope for this QR.

---

## Observations (non-blocking, for Designer)

- At 768 px exactly, the bold `text-display-xl` (3.75 rem / 60 px) numbers visually crowd the column dividers — "99.99%" sits hard against the left divider of column 2 in the rendered output. The implementation is faithful to the spec (`md:text-display-xl` + `md:grid-cols-3`); this is a spec-level tradeoff at the smallest `md:` width, not an engineering deviation. Designer may want to step `text-display-xl` up to the `lg:` breakpoint, or tighten number widths via a slimmer numeric weight, in a follow-up. Not a QR blocker.

---

## Blockers

None.
