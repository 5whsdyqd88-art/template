# TopNav — Quality Reviewer Verdict (SAN-359)

Issue: SAN-359 · Umbrella: SAN-10 · Branch: `feature/topnav` · HEAD: `95aeda8` · Component: `components/relay/TopNav.tsx` · Spec: `app/design/relay/topnav-design.md`

## Verdict: CHANGES REQUESTED

`npx next build` passes. Axe is clean on all three viewports (0 serious/critical violations — the prior `color-contrast` finding on the primary CTA is resolved by the `primary-500 → primary-600` change in `64e9bc2`). CWV is well within targets. Tablet layout is now correct: `lg:` (not `md:`) gates the desktop layout, so 768px renders the mobile/hamburger layout per spec §1 — the prior tablet-collapse blocker is resolved.

One new visual blocker remains: at desktop, the primary CTA's trailing `ArrowRight` wraps onto a second line inside the pill, so the label and the arrow are no longer on a single line.

### Environment

- Built against worktree `/tmp/topnav-senior-wt` at `95aeda8` (the shared `/home/vlad/fleet/smoketest/repo` checkout is on `dev` and another worktree already had `feature/topnav` checked out).
- The integrated `/` route returns HTTP 500 (`TypeError: g is not a function` from `app/page.js` — a crash inside one of the other section components, not TopNav). To exercise TopNav in isolation, this review built against a temporary, **uncommitted** route at `app/qrpreview/topnav/page.tsx` and served it via `next start -p 3031`. The crash on `/` is not a TopNav blocker but the umbrella owner should know it persists since the previous QR pass.
- Screenshots, axe JSON, and CWV JSON: `/tmp/qr-topnav-359/`.

## Blockers

### 1. Visual / desktop (1440px) — primary CTA arrow wraps below the label

**Screenshots:** `/tmp/qr-topnav-359/desktop_resting.png`, `/tmp/qr-topnav-359/desktop_frosted.png` (both states reproduce the wrap).

The "Start building" pill renders with the label on line 1 and the `ArrowRight` SVG on line 2, inside the same 36px-tall pill. The bounding boxes confirm it:

```
<a> pill                              : x=1201.3  y=18  w=126.7  h=36   (single line tall, content overflows internally)
  <span motion outer (scale-press)>   : x=1201.3  y=18  w= 94.7  h=36   display=block
    <span class="inline-flex gap-2">  : x=1201.3  y=18  w= 94.7  h=36   display=inline-flex (single child)
      <span motion inner (arrow nudge)>: x=1201.3 y=18  w= 94.7  h=36   display=block ← THE PROBLEM
        "Start building"               : line 1 (~y 18–34)
        <svg ArrowRight>               : line 2 (y=38, w=16  h=16) ← wraps below the text
```

The inner `<motion.span>` (arrow-nudge wrapper, `TopNav.tsx:304–308`) computes `display: block` once framer-motion attaches its `style.transform`, which forces the text + svg siblings inside it into an inline-flow block context. Since the block fills the 94.7px available inside the pill's `px-4` and the natural width of "Start building" (~98px at `text-sm font-semibold`) + space + 16px svg exceeds 94.7px, the svg wraps. The outer `inline-flex items-center gap-2` (`TopNav.tsx:303`) has only **one** flex child (the inner motion.span) so its `gap-2` has nothing to apply between — and the inline-flex parent does not propagate down into the block child.

**Design rule violated:**

- §2 *Type* table: `"Start for free" pill label … line-height intent: single line`.
- §5.5 *CTA pills — Start for free*: "**Arrow nudge** (resolved Q7): `ArrowRight` always visible at rest. On hover translate-x `0 → 2px`, 180ms `ease-out-soft`. The arrow does not fade in — it lives there as a CTA affordance from the start." — the affordance only reads if the arrow is inline beside the label.
- §4 *Vertical / pill geometry*: "All three share the same `h-9` baseline so they sit on a single line." — pill height stays 36px but the **internal** content wraps, defeating the intent.

**Resolution paths (Engineer's call, no architect needed):**

(a) Restructure `PrimaryPill` so the label and `ArrowRight` are **siblings inside the `inline-flex items-center gap-2` span**, not nested under a single `motion.span`. Apply the arrow-nudge `motion.span` to the **arrow only** (or use `motion.svg`):

```tsx
// PrimaryPill body
<span className="inline-flex items-center gap-2">
  <span>{children /* label only */}</span>
  <motion.span animate={{ x: isHovered ? 2 : 0 }} transition={...}>
    <ArrowRight className="h-4 w-4" />
  </motion.span>
</span>
```

This requires changing `TopNav` to pass label + arrow separately (e.g. accept a `trailingIcon` prop, or split `{topNavContent.startCta}` and `<ArrowRight />` as two children and have the pill render only the label inside the nudge wrapper). The `gap-2` then has two siblings to lay out and the inline-flex stays one line.

(b) Force the inner motion.span back to inline behaviour: add `style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}` (or a Tailwind `inline-flex items-center gap-2 whitespace-nowrap` className) to the inner `motion.span`. Cheaper change but couples to framer-motion's display defaults.

(c) Add `whitespace-nowrap` to the `<a>` (`TopNav.tsx:234`). Cheapest, but only masks the symptom — the inner block layout is still wrong and any narrower pill (e.g. with longer copy) would clip rather than wrap.

Option (a) is the cleanest; (b) is the smallest diff.

## What passed

- **Build:** `npx next build` is clean (no TS errors, no compile errors).
- **Tablet (768px) layout:** mobile/hamburger layout activates correctly at `<lg`; brand + 44×44 hamburger button only, no overflow. Spec §1 *Mobile (<lg)* and Resolved Q8 (desktop activates at `lg` = 1024px).
- **Mobile (390px) layout:** brand left, hamburger right, drawer opens to `w-[min(360px,85vw)]` opaque white panel with `rounded-l-2xl` left edge, scrim with `bg-ink-900/40`, nav rows with `py-3` (≥44px touch target), divider, then full-width vertical CTA stack: Sign-in / Contact-sales / Start-building. Matches §1.4, §4 *Drawer geometry*, §5.6.
- **Desktop (1440px) layout — non-CTA-pill regions:** brand chip (32×32 `rounded-md` `bg-primary-50` with stroked `Zap` in `primary-500`), 5 center nav items with carets at `gap-8…10`, Sign-in ghost link, Contact-sales outlined pill — all correct per §3, §4. Frosted state (`scrollY > 8`) flips backdrop transparent → `bg-white/80 backdrop-blur-md` and adds `border-b border-ink-100`, matching §3 *Header surface — frosted state* and §5.1.
- **Primary CTA color contrast (the prior blocker):** `bg-primary-600` (#4A58E0) with `text-white` clears WCAG AA body at 5.50:1 — axe reports zero `color-contrast` violations on desktop, tablet, and mobile. Resolved.
- **Accessibility (axe-core, wcag2a/aa + wcag21a/aa + wcag22aa):** **0 violations of any impact level** at desktop (1440×900), tablet (768×1024), and mobile (390×844). JSON dumps at `/tmp/qr-topnav-359/axe_{desktop,tablet,mobile}.json`.
- **Core Web Vitals (Playwright `PerformanceObserver`, headless Chromium against `next start`):**
  - Desktop — **LCP 496 ms** (target < 2500), **CLS 0.0000** (target < 0.1), INP not triggered by synthetic interaction.
  - Mobile — **LCP 84 ms**, **CLS 0.0000**, INP not triggered.
  - `lighthouse` / `lhci` not installed on this host; `PerformanceObserver` numbers above are the canonical CWV signals. Substantial headroom under targets.

## What didn't get verified end-to-end

- **INP** — synthetic hover/scroll didn't trigger an interaction event observable by `event-timing`. The TopNav's interactive surface is small (caret rotations, pill hovers, drawer open) and the underlying transitions are framer-motion CSS transforms that don't block the main thread. No regression risk flagged, but call out that this metric isn't measured here.
- **The `:3011` dev preview** does not yet carry `feature/topnav` (umbrella `/` 500 prevents the auto-deploy from finishing a clean build), so visual review used the isolated `qrpreview` route described above.

## Re-review checklist

After the Engineer restructures `PrimaryPill` (option (a) or (b) above):

1. Re-run `npx next build` — expect clean.
2. Re-screenshot at 1440 / 768 / 390 — expect "Start building" label + `ArrowRight` on a single line, pill width grows to fit.
3. Re-run axe — expect to remain at 0 serious/critical (no contrast regression from the structural change).
4. Re-measure CWV — no regression expected (the change is structural HTML, not styling).

No spec amendment required; the rule was always single-line.
