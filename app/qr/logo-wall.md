# Quality Reviewer verdict — LogoWall (SAN-12)

**Status:** CHANGES REQUESTED
**Branch / commit reviewed:** `feature/logowall` @ `978d92f`
**Inputs:** `app/design/relay/logo-wall-design.md`, `components/relay/LogoWall.tsx`, `content/relay/logo-wall.ts`

## Build gate

`npm run build` — **PASS**. Compiled successfully, type check clean, 5/5 static pages generated. Route `/` first-load JS 128 kB.

## Visual fidelity

Note: per `logo-wall-design.md` §1, LogoWall is Relay-original — there is no Twilio reference at this position to diff against. Visual gate is fidelity to `logo-wall-design.md` rules.

| Viewport | Result |
|---|---|
| Desktop 1280 | Matches §1–§3: white surface, `max-w-6xl` container, eyebrow above row, single-line wrap of 7 wordmarks, all Title Case, Hummingbird is the lone mono. ✓ |
| Tablet 768 | Wraps to 6 + 1 (Hummingbird drops to row 2). §1.4 says "the `flex-wrap` lets the browser decide; do not hard-break with `<br>` or hidden classes" — implementation correctly defers to flex. ✓ |
| Mobile 390 | Wraps to 4 + 3. §1.4 contemplates 2+2+3 / 3+2+2 / 4+3 natural-flow outcomes and ends "Acceptable". ✓ |

No horizontal overflow at any viewport (scrollWidth == clientWidth at 1280/768/390).

Per-wordmark style spot check (computed styles match the §3 lookup):
- Norther: `font-weight: 600`, `letter-spacing: -0.025em`, `font-family: Inter` ✓
- Mira: `font-weight: 300`, `font-style: italic`, `letter-spacing: 0.025em` ✓
- Quarry: `font-weight: 700`, `letter-spacing: -0.05em` ✓
- Arcade: `font-weight: 400`, `letter-spacing: 0.1em` ✓
- Jove: `font-weight: 600`, `font-style: italic` ✓
- Hummingbird: `font-weight: 300`, `font-family: JetBrains Mono` (the §3 #7 mono accent) ✓
- Eyebrow: `text-transform: uppercase`, `letter-spacing: 0.18em`, `font-weight: 500` ✓

Copy substitutions vs design illustrative names — Beacon → Cove, Pylon → Quarry — are Copywriter prerogative; the styling slots (medium/normal for #3, bold/tighter for #4) match §3 intent.

## Accessibility — BLOCKER

axe-core 4.11.4 scan, scoped to `section[aria-labelledby="logo-wall-eyebrow"]`, ruleset `wcag2a/aa, wcag21a/aa, wcag22aa, best-practice`.

**1 violation, severity `serious`, on all three viewports:**

- **Rule:** `color-contrast` (serious)
- **Affected nodes:** all 7 `<span>` wordmarks (`Norther`, `Mira`, `Cove`, `Quarry`, `Arcade`, `Jove`, `Hummingbird`)
- **Measured:** 2.53 : 1 (`#9ca3af` on `#ffffff`)
- **Required:** 4.5 : 1 (normal weight) / 3 : 1 (bold ≥ 18px)
- **All 7 wordmarks fail.** Even `Quarry` at `font-bold` only needs 3 : 1 but still falls short at 2.53 : 1.

Design spec §2.2 and §6.3 acknowledge this as a deliberate "decorative placeholder" trade-off. Per QR role rules ("axe-core scan: fail on serious or critical"), this is a hard block regardless of design intent — the QR gate is independent of the design's self-assessment.

Design spec §6.3 already documents the remediation path:
> If an audit later requires AA on the resting wordmarks, the cleanest knob is `ink-500` (4.83 : 1) at rest and `ink-800` (12.6 : 1) on hover — both still keep the muted intent.

Recommended fix: swap `text-ink-400` → `text-ink-500` and `hover:text-ink-700` → `hover:text-ink-800` in `Wordmark`. Eyebrow at `text-ink-500` already passes (4.83 : 1).

No other axe violations. 11 a11y rules pass at each viewport. Semantic structure (`<section aria-labelledby>` + `<ul aria-label>` + `<li><span>`) matches design §6.1.

## Performance — CWV PASS

Lighthouse 12 on `http://127.0.0.1:4099/`, mobile form factor, simulated throttling.

| Metric | Value | Target | Verdict |
|---|---|---|---|
| LCP | 2.4 s | < 2.5 s | ✓ |
| CLS | 0 | < 0.1 | ✓ |
| TBT (INP proxy) | 3 ms | < 200 ms | ✓ |
| FCP | 0.8 s | n/a | — |
| Speed Index | 0.8 s | n/a | — |
| Performance score | 0.98 | n/a | — |

Lighthouse lab cannot measure real-user INP; TBT 3 ms on a static page is a strong indicator that INP is well under target.

## Blockers (must fix to ship)

1. **a11y** — `color-contrast` (serious) on all 7 wordmark `<span>`s in `components/relay/LogoWall.tsx` line 33 — measured 2.53 : 1 (`text-ink-400` on `bg-white`), required 4.5 : 1 (normal) / 3 : 1 (bold). Apply the design.md §6.3 remediation: `text-ink-500` rest, `hover:text-ink-800` hover.

## Out of scope for this gate (not blockers)

- Variant of the entrance animation (`animate={[0,1]}` keyframes vs the design's `whileInView`+`once: true`). Code Reviewer accepted; final state is identical, no scroll-back replay observed.
- Beacon/Pylon → Cove/Quarry copy substitution (Copywriter prerogative; design names were illustrative).

## Artifacts

Local screenshots and JSON reports produced during this review:
- `qr-out/{desktop,tablet,mobile}_logowall.png` (section-only)
- `qr-out/{desktop,tablet,mobile}_fullpage.png` (full page)
- `qr-out/report.json` (axe results + computed styles per viewport)
- `qr-out/lh-mobile.json` (Lighthouse report)

These are not committed (large binaries / transient); cited here for traceability of the verdict.
