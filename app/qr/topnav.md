# TopNav — Quality Reviewer Verdict

Issue: SAN-148 (umbrella SAN-10) · Branch: `feature/topnav` · Commit: `a0be48d` · Component: `components/relay/TopNav.tsx` · Spec: `app/design/relay/topnav-design.md`

## Verdict: CHANGES REQUESTED

`npm run build` passes. Visual review against the design spec finds multiple blockers across desktop and tablet, plus broken hover/motion behaviors and a broken mobile drawer. Accessibility and performance gates were NOT run — the visual layer is currently broken severely enough that fixes will materially change the rendered DOM and any axe/Lighthouse numbers taken now would be invalidated by the rebuild. Re-run after the visual blockers are cleared.

Build: `next build` succeeds (51.2 kB / 139 kB First Load JS for `/`).

## Blockers

### 1. Visual / desktop — "Sign in" ghost link is invisible
**Spec:** §3 CTA pills table (line 128) requires Sign in to render its text label `text-ink-700`, with hover to `ink-900`. §6 Tab order lists "Sign in" as item 3 in the desktop sequence.
**Code:** `components/relay/TopNav.tsx:240-250`. `GhostLink` renders `<a aria-label={children}>` and self-closes — `children` is never inserted between the tags, so the anchor is visually empty (and zero width).
**Evidence:** `screenshots/qa/topnav/desktop_resting_full.png` and `desktop_scrolled_header.png` — the CTA cluster shows only "Contact sales" and "Start building"; no "Sign in" between brand cluster and the outlined pill.

### 2. Visual / desktop — "Start building" arrow wraps onto a second line inside the pill
**Spec:** §1 (header `h-[72px]` locked, single-line content), §5.5 (Start for free: arrow always visible at rest, hover translate-x 0→2px). Arrow is meant to sit inline-trailing the label.
**Code:** `components/relay/TopNav.tsx:296-303`. The pill body is `<span class="inline-flex items-center gap-2"><motion.span ...>{children}</motion.span></span>` and `children` is `"Start building " <ArrowRight />`. The `motion.span` defaults to inline display, so the trailing `<svg>` collapses below the text inside an `h-9` pill. Fix: render the arrow as a direct sibling inside the outer inline-flex (not nested inside the motion.span), or set the motion.span to `display:inline-flex; align-items:center; gap:.5rem`.
**Evidence:** `screenshots/qa/topnav/desktop_resting_full.png`, `tablet_resting_header.png` — arrow visible below the "Start building" label inside the primary pill.

### 3. Visual / tablet (768) — three-region grid breaks; nav and CTA cluster collide
**Spec:** §1 Three-region grid, §1 Responsive breakpoints (Tailwind `md` ≥768 → desktop layout). The center nav must be "absolute-centered visually via `flex-1 flex justify-center`"; CTA cluster sits to the right with `gap-3`.
**Code:** `components/relay/TopNav.tsx:108-114`. The nav is `<nav className="hidden md:flex flex-1 items-center max-w-md">` containing `<div className="flex items-center gap-8 lg:gap-10">…</div>`. Two off-spec choices: (a) the `max-w-md` (28rem / 448px) cap is not in the spec — it is what causes the inner div with five 14px-medium nav items + carets at `gap-8` to overflow horizontally; (b) `justify-center` is missing on both the `<nav>` and the inner `<div>`, so the items pile against the left edge against the brand cluster.
**Evidence:** `screenshots/qa/topnav/tablet_resting_header.png` — "Pricing ▾" overlaps "Contact sales" (which has wrapped to two lines), and the brand wordmark "Relay" abuts "Products" with no gap. Layout is unusable at the spec's stated `md` breakpoint.

### 4. Visual / interaction — OutlinedPill ("Contact sales") hover state is dead
**Spec:** §3 CTA pills table line 129 requires hover to flip `bg transparent → bg-ink-900`, `text-ink-900 → text-white`, `border-ink-200 → border-ink-900`. §5.5 ("Hover: bg, text, border all transition together. 200ms ease-out-soft.")
**Code:** `components/relay/TopNav.tsx:257`. `const isHovered = false;` is a hard-coded constant; the `${isHovered ? "bg-ink-900 text-white border-ink-900" : ""}` branch is unreachable.

### 5. Visual / interaction — PrimaryPill ("Start building") hover state is dead
**Spec:** §3 line 130 + §5.5 require hover to swap `bg-primary-500 → bg-primary-600` and darken the shadow ~30%, plus the arrow nudge.
**Code:** `components/relay/TopNav.tsx:278`. Same pattern: `const isHovered = false;`. The `${isHovered ? "bg-primary-600" : ""}` and the shadowColor ternary are unreachable. Resting `bg-primary-500` is what ships.

### 6. Motion — PrimaryPill arrow nudge cannot animate
**Spec:** §5.5 ("Arrow nudge: ArrowRight always visible at rest. On hover translate-x 0 → 2px, 180ms ease-out-soft").
**Code:** `components/relay/TopNav.tsx:299` sets `transition={{ duration: 0, ease: reducedMotionEasing }}` — duration is hard-coded to 0 (always instant, even outside reduced-motion). Combined with #5, the arrow never moves at all.

### 7. Visual / mobile drawer — CTA stack renders side-by-side and Sign in is missing
**Spec:** §4 Drawer geometry (Q9): "CTA stacking: full-width (`w-full`), same vertical order: Sign in → Contact sales → Start for free, `gap-3`."
**Code:** `components/relay/TopNav.tsx:410-418`. The drawer passes `className="block w-full ..."` to `GhostLink`, `OutlinedPill`, `PrimaryPill`, but none of those three components accept or forward `className` from props (each destructures only `{ href, children, scrolled }` — see lines 240, 256, 277). The classes are silently dropped, so the pills render at natural width and lay out side-by-side. `GhostLink` is also empty (per blocker #1), so "Sign in" is missing from the drawer entirely.
**Evidence:** `screenshots/qa/topnav/mobile_drawer_open.png` — "Contact sales" and "Start building" appear on one row, both at natural width; no "Sign in" row above them.

### 8. Visual / nav underline geometry off-spec
**Spec:** §4 Underline geometry table — "Position: absolute, bottom of label, `bottom: -2px` from baseline."
**Code:** `components/relay/TopNav.tsx:188-193`. The motion.div uses `className="absolute bottom-0 left-0 ..."` (`bottom-0` = 0px) instead of `-bottom-0.5` / `bottom: -2px`. Hover underline rides flush against the label baseline rather than 2px below. Minor visually but it's a stated geometry rule and trivially fixable.

## Other observations (non-blocking, for the engineer's reference)

- `NavItem` re-implements the label color toggle inline with `style={{ color: isHovered ? "rgb(26,26,26)" : "rgb(82,82,82)" }}` (line 177) instead of the Tailwind `text-ink-700 hover:text-ink-900` already declared on the same element. The inline style wins, so the focus-ring color contract per §5.4 (Q12 — swap `ring-primary-300` ↔ `ring-primary-500` from `scrolled`) is not implemented either: the focus-visible rules on `NavItem` (line 176) declare `ring-2 ring-offset-2 ring-offset-white` but no ring color and no scrolled-state branch. Not flagged as a blocker because the focus ring still appears (browser default ring color), but it does not match spec §5.4.
- `OutlinedPill` and `PrimaryPill` accept `scrolled` but never read it. Spec §3 has Outlined/Primary pills behaving identically across resting/frosted bar states, so this prop is effectively dead — fine to remove or to use it for the focus-ring swap mentioned above.
- Header entrance (§5.7 — optional) is not implemented. Optional, no action needed.

## Not run (gated by the visual blockers above)

- axe-core scan against the rendered page. The layout collapses at tablet and several CTAs are broken; serious/critical findings discovered now would be re-introduced or invalidated by the visual fixes.
- Lighthouse CI (LCP / CLS / INP). Same reason — the rebuilt DOM after fixes will change layout-shift profile.

Re-run both after a fresh build with the blockers above resolved.
