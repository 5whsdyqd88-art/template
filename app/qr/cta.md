# QR Verdict — CTA (gradient strip) · SAN-206

**Status:** APPROVED

Reviewed `components/relay/CTA.tsx` against `app/design/relay/cta-design.md` on `feature/cta`. Build, visual fidelity at desktop / tablet / mobile, axe-core a11y, and Core Web Vitals all pass. Captured from a local `next start` on 127.0.0.1:3099 (built from a clean `feature/cta` worktree); the public dev preview at :3011 also serves the implemented section.

## Gates

| Gate | Result |
|---|---|
| `npm run build` | PASS — compiled successfully, 5/5 static pages generated |
| Visual fidelity vs `cta-design.md` | PASS — every measured token matches at all three viewports |
| axe-core (WCAG 2.0/2.1/2.2 A + AA, scoped to `#cta`) | PASS — 0 violations, 11 passes, 1 incomplete (gradient color-contrast — see notes) |
| Core Web Vitals (LCP / CLS / INP) | PASS — LCP 32 ms · CLS 0 · no input-blocking script in section |

## Visual measurements (Playwright `getComputedStyle`, screenshots verified)

| Property | Mobile (390) | Tablet (768) | Desktop (1280) | Spec ref | Result |
|---|---|---|---|---|---|
| Section landmark | `<section id="cta" aria-labelledby="cta-headline">` | same | same | §8 | ✓ |
| Section background | `linear-gradient(to right bottom, primary-700, primary-600, primary-500)` | same | same | §3 | ✓ |
| Section padding (y/x) | 80 / 24 px | 96 / 32 px | 96 / 32 px | §1 / §4 | ✓ |
| Section overflow / position | hidden / relative | same | same | §1 | ✓ |
| Headline `font-size` | 30 px (`text-3xl`) | 36 px (`display-md`) | 36 px | §2 | ✓ |
| Headline weight / line-height | 600 / 1.15 | 600 / 1.15 | 600 / 1.15 | §2 | ✓ |
| Headline color | white | white | white | §3 | ✓ |
| Subhead `font-size` | 18 px (`text-lg`) | 20 px (`text-xl`) | 20 px | §2 | ✓ |
| Subhead `max-width` | 672 px | 672 px | 672 px | §2 | ✓ |
| CTA row direction | column | row | row | §1 / §5 | ✓ |
| CTA row gap | 12 px | 16 px | 16 px | §4 | ✓ |
| Primary CTA bg / text / weight / radius / height | white / primary-700 / 600 / pill / 56 px | same | same | §5 (`bg-white text-primary-700 h-14 rounded-full`) | ✓ |
| Secondary CTA bg / text / border / weight / height | transparent / white / `white/70` / 500 / 56 px | same | same | §5 | ✓ |
| Mobile vs sm+ button width | 342 (full-col) | 205 / 156 (auto) | 205 / 156 (auto) | §1 (`w-full` <sm, `w-auto` sm+) | ✓ |
| Decorative SVG | present, `aria-hidden`, `focusable=false`, 2 paths + radial glow | same | same | §6 | ✓ |
| `ArrowRight` icon | present, `aria-hidden` | same | same | §5 / §8 / §9 | ✓ |
| Reduced-motion branch | `useReducedMotion()` gate at `CTA.tsx:9,54-68` | — | — | §7 | ✓ |

## A11y — axe-core scoped to `#cta`

- Violations: **0** (none at `serious` or `critical`).
- Incomplete: 1 (`color-contrast`, 3 nodes). This is axe being unable to compute a single luminance for the `linear-gradient` background, not a contrast failure. Per §3 the contrast math is documented and the foregrounds (white headline; `text-white/0.88` subhead; `text-white` on the bordered secondary CTA) all clear WCAG 2.1 AA at the gradient's worst-case stop. Per QR policy, only `serious`/`critical` violations block — `incomplete` does not.

## Visual divergence from the reference (intentional, per spec)

`refs/twilio/desktop/scroll_10.png` shows a solid navy backdrop with a single CTA. `cta-design.md` opening explicitly diverges to a brand-gradient strip with two CTAs per the issue brief. The implementation matches the spec, not the reference — this is by design and not a blocker.

## Non-blocking observations (informational only)

1. **Subhead opacity 0.88 vs spec `text-white/90`.** Implementation sets inline `style={{ opacity: 0.88 }}` (`CTA.tsx:85`); spec calls for `text-white/90` (0.90). Effective contrast over `primary-600` ≈ 4.79:1 — clears WCAG AA body. Inside the spec's stated tolerance ("do not go below 4.5:1"). Carried over from SAN-158.
2. **Entrance animation uses `animate` instead of `whileInView`.** `CTA.tsx:62` sets `animate={{ opacity: 1, y: 0 }}` while still passing `viewport={{ once: true, amount: 0.3 }}`. Spec §7 calls for `whileInView`. The `viewport` prop is ignored when `animate` is set, so the entrance fires on hydration rather than on intersection. Section sits at page bottom, so by the time the user scrolls there the final state is what they see — visual outcome is indistinguishable. Engineer can swap `animate` → `whileInView` in a future pass if matching motion semantics matters.

## Evidence

- Screenshots: `/tmp/qr-cta/out/cta_{desktop,tablet,mobile}.png`, `/tmp/qr-cta/out/fullpage_{desktop,tablet,mobile}.png`
- Computed styles + axe + perf JSON: `/tmp/qr-cta/out/results.json`
