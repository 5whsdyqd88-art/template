# TopNav — Quality Reviewer Verdict (re-review)

Issue: SAN-351 (umbrella SAN-10) · Branch: `feature/topnav` · Commit: `28b06ab` · Component: `components/relay/TopNav.tsx` · Spec: `app/design/relay/topnav-design.md`

The previous QR pass (SAN-148) flagged eight blockers. The current `feature/topnav` HEAD addresses the empty `GhostLink`, both hover-state regressions, the dead arrow nudge, the mobile drawer's CTA stacking (className now forwarded through), and the inline-flex wrap on the primary pill. Two of the previously-flagged issues persist or have re-surfaced in a different form, and the gates that were skipped last round (axe-core, CWV) were run this round and produced one new serious finding.

## Verdict: CHANGES REQUESTED

Build (`npx next build`) passes cleanly. Two blockers — one visual (tablet `md` layout collapse), one accessibility (`color-contrast` serious on the primary CTA label).

### Environment notes

- Reviewed in an isolated `git worktree` of `origin/feature/topnav` at `28b06ab`, with `node_modules` symlinked from the main repo. The shared `/home/vlad/fleet/smoketest/repo` checkout is currently on `dev` because another agent is operating there concurrently; the worktree prevents that race from contaminating the review.
- The published `:3011` dev preview does not yet contain `feature/topnav` (its `<header>` still renders the orchestrator placeholder), so the review was run against a local `next start -p 3020` of the worktree build.
- The integrated `/` route on this build returns HTTP 500 with `TypeError: g is not a function` thrown inside `app/page.js`. The TopNav component itself renders cleanly when mounted in an isolated route (`/qrpreview/topnav` — temporary, not committed); the `/` crash is from another section, not TopNav. Flagging here so the umbrella owner sees it; not a TopNav blocker.

## Blockers

### 1. Visual / tablet (768px) — three-region grid still collapses at `md`

**Screenshots:** `/tmp/qr-topnav/topnav_tablet_resting.png`, `/tmp/qr-topnav/topnav_tablet_frosted.png`.

At the spec's stated desktop-layout breakpoint (`md`, ≥768px), the three-region grid does not fit in the viewport:

- Brand wordmark "Relay" abuts "Products" with zero horizontal gap — rendered as `RelayProducts`.
- "Sign in" and "Contact sales" wrap onto two lines each (`Sign / in`, `Contact / sales`).
- The primary "Start building" pill is clipped off the right edge and is not visible at all.

**Design rule violated:** spec §1 *Three-region grid (desktop, ≥`md`)* — `[ brand left | center nav (flex-grow, justify-center) | CTA cluster right ]` on a single row, with §4 *Spacing rhythm* requiring `gap-2` inside the brand cluster, `gap-8` between center nav items at `md`, `gap-3` between CTA cluster items, and §1 *Outer header* locking the row to a single `h-[72px]` line. The current implementation honors `md:flex` on both the nav and CTA cluster (`TopNav.tsx:108, :116`) without any guard against the row not fitting, so the desktop layout activates at a viewport that cannot accommodate it.

Resolution paths: (a) gate the desktop layout to `lg:` (and let the hamburger drawer carry tablet), or (b) hide one of the clusters between `md` and `lg`. The spec doesn't currently say which; needs an Architect/Designer call before Engineer fix.

This is the same class of failure flagged in the prior QR's blocker #3 — the underlying spec ambiguity hasn't been resolved.

### 2. Accessibility / desktop — serious `color-contrast` on primary CTA label

**axe rule:** `color-contrast`, impact **serious**. Full results at `/tmp/qr-topnav/axe_desktop.json`.

```
target: ['span > .gap-2.inline-flex > span']
html  : <span style="transform: none;">
reason: Element has insufficient color contrast of 4.17 (foreground color: #ffffff,
        background color: #5b6cff, font size: 10.5pt (14px), font weight: normal).
        Expected contrast ratio of 4.5:1
```

This is the framer-motion `<motion.span>` wrapping `{topNavContent.startCta} <ArrowRight />` inside `PrimaryPill` (`TopNav.tsx:291–313`). The label `text-sm font-semibold` (14px, weight 600) does **not** meet WCAG's "large text" threshold (≥18pt, or ≥14pt **bold/≥700**), so AA body (4.5:1) applies. White `#FFFFFF` on `#5B6CFF` measures 4.17:1.

**Design rule status:** the spec's §3 *Contrast (WCAG AA targets)* table claims `text-white` on `bg-primary-500` is 4.66:1 ("yes" / passes); the actual WCAG calc gives 4.17:1 and fails AA body. The implementation is faithful to the spec colors — the spec's contrast table is the underlying error. Resolution: darken the resting primary background (e.g. use `primary-600` `#4A58E0`, which passes AA body by a wider margin) or bump label to `font-bold` (700) so AA-large applies at 3:1; either way the §3 contrast table needs to be re-validated. As-is, axe flags this serious → blocker per the QR rule ("only `serious` or `critical` block").

Tablet (768) and Mobile (390) axe scans were clean (no serious/critical violations).

## What passed

- **`npx next build`:** clean compile + type check on `feature/topnav`. No TS errors.
- **Desktop (1280px) layout:** matches spec §1–§5. Brand chip + wordmark on the left (chip `bg-primary-50`, stroked `Zap` in `primary-500`, `rounded-md`), five center nav items with `ChevronDown` carets at `gap-8`, Sign-in ghost + Contact-sales outlined + Start-building primary on the right with `ArrowRight` inline-trailing the label. Hover on a nav item rotates the caret 180° and reveals the `1.5px` `bg-ink-900` underline label-only with `origin-left`. The resting → frosted scroll flip swaps backdrop transparent → `bg-white/80 backdrop-blur-md border-b border-ink-100`. (Spec §3, §5.1, §5.3 — Resolved Q1, Q2, Q4.)
- **Mobile (390px) layout:** brand left, 44×44 hamburger right; drawer opens to `w-[min(360px,85vw)]`, opaque white, `rounded-l-2xl` left edge, brand+close header row, nav list with `py-3` touch targets, divider, then full-width stacked Sign-in / Contact-sales / Start-building CTAs (`block w-full` is now correctly forwarded through `GhostLink`, `OutlinedPill`, `PrimaryPill`). Spec §1.4, §4 *Drawer geometry* (Resolved Q9), §5.6 (Resolved Q10).
- **A11y on tablet + mobile:** zero `serious`/`critical` axe violations.
- **Reduced-motion plumbing:** `useReducedMotion()` is read on every motion component and the backdrop / caret / underline / arrow-nudge / drawer transitions all collapse correctly (per spec §5 reduced-motion clauses).
- **CWV (Playwright local measurement, headless Chromium against `next start` build):**
  - Desktop — LCP **548 ms** (target <2500), CLS **0** (target <0.1), INP not triggered.
  - Mobile — LCP **56 ms**, CLS **0**, INP not triggered.
  - `lhci` / `lighthouse` is not installed on this host; the numbers above come from `PerformanceObserver` instrumented during the page load and a synthetic hover/click sequence. CWV targets are met.

## Resolved since prior QR

Spot-checks confirmed the prior QR's blockers #1, #2, #4, #5, #6, #7 are no longer reproducing on `28b06ab`:

- `GhostLink` now renders `{children}` (`TopNav.tsx:251–264`) — Sign in label is visible on desktop and inside the drawer.
- Primary CTA arrow nudge is real (`x: isHovered ? 2 : 0`, duration 0.18s, `TopNav.tsx:304–308`) and the pill body is `inline-flex items-center gap-2` so the arrow stays inline with the label.
- `OutlinedPill` and `PrimaryPill` both drive hover state from `useState` (`TopNav.tsx:271, 292`) — `bg-ink-900`/`bg-primary-600` swaps fire on real hover.
- The drawer CTA stack forwards `className="block w-full"` through `CtaPillBase` → all three CTAs render full-width in vertical order.

## Re-review checklist

After Architect/Designer resolves the `md`-tier responsive rule and either the `primary-500` color or the primary-pill label weight, the Engineer should:

1. Repeat `npx next build`.
2. Re-snapshot at 1280 / 768 / 390 against `topnav-design.md` §1–§5.
3. Re-run axe on the desktop viewport — expect zero `serious`/`critical`.
4. Re-run CWV — expect no regression (current numbers leave headroom).
