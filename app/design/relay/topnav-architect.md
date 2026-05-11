# TopNav (sticky scroll-aware header) — Architect ADR

Issue: SAN-10 · Component: `components/relay/TopNav.tsx` · Already wired into `app/page.tsx` (sibling to `<main>`, ahead of `<Footer>`)

## Purpose

Persistent top-of-page navigation. Anchors brand identity at the top-left, exposes the five primary product/marketing destinations in the center, and presents the visitor's two next steps (sign in vs. start) at the right. Transitions from a transparent overlay over the hero into a frosted, bordered bar once the user scrolls past the first few pixels — the only chrome that remains visible while every other section scrolls past.

## Composition

**Single component file**: `components/relay/TopNav.tsx`. Default-exported React client component (`"use client"` — needs `useState`, `useEffect`/`useScroll`, framer-motion hooks, refs).

Internal regions, top-down in source order:

1. `<header>` — fixed, `top-0 left-0 right-0`, `z-50`, height `72px`. The scroll-aware backdrop styles live here.
2. `Container` (`max-w-7xl mx-auto px-6`) — establishes the same horizontal grid as Hero/CTA. Flex row, `items-center`, `justify-between`, full-height.
3. **Brand cluster** (left): icon chip + wordmark.
   - `Zap` icon (lucide-react), sized ~`h-5 w-5`, sitting in a tinted square chip (rounded, `primary-50` fill, `primary-500` stroke).
   - Wordmark `<span>Relay</span>` in `ink-900`, semibold, `tracking-tight`.
   - The whole cluster is wrapped in a single `<a href="#top">` (Decision D7).
4. **Center nav** (`hidden md:flex`): `<nav>` with five `NavItem` instances rendered from a static array.
   - Each `NavItem` is an `<a>` containing a label + `ChevronDown` icon.
   - Hover: caret rotates / lifts; underline scales in (Decision D4).
   - The center nav is the *flex grow* region — gaps between items live here.
5. **CTA cluster** (right, `hidden md:flex items-center gap-3`):
   - "Sign in" — ghost link, `ink-700` → `ink-900` on hover, no border, no fill.
   - "Contact sales" — outlined pill (`border border-ink-200`, rounded-full), fills `ink-900`-text on hover.
   - "Start for free" — primary pill (`bg-primary-500 text-white`, rounded-full, `shadow-cta`) with trailing `ArrowRight` icon that nudges on hover.
6. **Mobile cluster** (`md:hidden`): single `Menu` icon button on the right; brand stays on the left.
7. **MobileDrawer** (sibling, conditionally rendered via `AnimatePresence`):
   - Scrim (`fixed inset-0 bg-ink-900/40`), click-to-close.
   - Panel (`fixed top-0 right-0 h-full w-[min(360px,85vw)] bg-white`), slides in from the right with framer-motion.
   - Inside: header row with brand + `X` close button, then a vertical stack of the five nav items, then the three CTAs stacked full-width.
   - Body scroll locked while open (Decision D6).

The `NavItem` and `CtaPill` are inline component declarations inside the same file — small enough that promoting them to siblings is overkill (Decision D1).

### Data flow

Static. The TopNav owns:
- A `scrolled: boolean` flag derived from `window.scrollY > 8`.
- A `mobileOpen: boolean` flag for the drawer.

Both are local component state. No props, no children, no remote data.

Copy strings — nav labels, CTA labels, brand wordmark — come from a single import: `import { topNavContent } from "@/content/relay/topnav"` (Copywriter delivers this module per Project Context conventions).

## State / data dependencies

- **Static content**: `app/content/relay/topnav.ts` exporting `topNavContent` (see Open Questions for Copywriter for required keys).
- **Runtime state**:
  - `scrolled` — drives backdrop styles. Updated via a passive `scroll` listener (Decision D2).
  - `mobileOpen` — drives drawer presence + body-scroll lock.
- **Effects**:
  - One `useEffect` registering a passive `scroll` listener that sets `scrolled` (cleans up on unmount). Initial value seeded from `window.scrollY` so a back-button restoration to mid-page renders the bar in its correct visual state.
  - One `useEffect` toggling `document.body.style.overflow` while `mobileOpen` is true.
  - `useReducedMotion()` from framer-motion gates entrance/transition durations.

No global store, no router subscription. The TopNav is read-only relative to app state.

## Interactions

- **Scroll → backdrop transition** (the headline behavior).
  - At `scrollY ≤ 8`: header is `bg-transparent`, no border, no blur. The hero gradient bleeds under it.
  - At `scrollY > 8`: header gains `bg-white/80`, `backdrop-blur-md` (`backdrop-filter: blur(12px)`), and a 1px `border-b border-ink-100`.
  - The transition between the two states is animated (framer-motion on the `<header>` itself), not a hard flip. Duration ~`200ms`, easing `ease-out-soft`.
- **Brand-cluster click**: navigates to `#top` (returns to the hero). Cursor shows pointer.
- **Nav item hover** (desktop):
  - Caret (`ChevronDown`) rotates 180° (or shifts down a few px — Designer picks; Decision D4 names tradeoffs).
  - Underline beneath the label scales from 0 → 100% width, `origin-left`, ~150ms.
  - Color shifts from `ink-700` → `ink-900`.
- **Nav item focus-visible**: visible focus ring (`ring-2 ring-primary-300 ring-offset-2`).
- **Nav item click**: `<a href="#section-id">` — anchors to the corresponding page section (Decision D8).
- **Sign in / Contact sales / Start for free** — all `<a href="#">` placeholders for v1. Hover/focus/active states per Designer spec; all share the same focus-ring treatment as nav items.
- **Mobile menu button click**: opens drawer.
- **Drawer scrim click / X button click / nav-item click inside drawer / Escape key**: closes drawer.
- **Drawer enter/exit**: framer-motion slide (`x: 100% → 0%`) + fade. Scrim fades independently.
- **Reduced-motion**:
  - Scroll-aware backdrop transition collapses to a hard flip (no animated `backdrop-filter` interpolation, which is also a perf trap on some browsers — see Decision D3).
  - Drawer enter/exit collapses to opacity-only fade (no slide).
  - Nav-item underline still scales (it's interaction feedback, not autoplay) — but Designer may shorten it.
- **No live regions, no popovers, no megamenus** in v1 (Decision D5).

## Decisions

### D1. File granularity — single file vs. split (`TopNav` + `NavItem` + `MobileDrawer` + `CtaPill`)

| Option | Pros | Cons |
|---|---|---|
| **A. Single `TopNav.tsx`** ✅ | Whole component is ~150–200 LOC; nothing here is reused outside the header; matches the flat shape of `components/relay/`; Engineer ships one file end-to-end. | If `MobileDrawer` ever grows into a real navigation surface (megamenu, search, account), it'll have to be split later. |
| B. Split `TopNav.tsx` + `MobileDrawer.tsx` (and maybe `NavItem.tsx`) | Cleaner unit boundaries; easier to test the drawer in isolation. | Premature: drawer is a thin slide+fade panel; promoting it to its own file just doubles the import surface. |

**Recommendation: A.** Match the rest of the codebase. Split if and when the drawer earns its own state machine (search, multi-level nav). `NavItem` and `CtaPill` stay as inline declarations inside the file.

### D2. Scroll detection — `window.scroll` listener vs. framer-motion `useScroll` vs. `IntersectionObserver` sentinel

| Option | Pros | Cons |
|---|---|---|
| **A. Passive `scroll` listener + `useState` boolean** ✅ | Trivially small, well-understood, zero ScrollTrigger complexity, no observer setup; threshold is binary so we don't need every-frame updates; pairs naturally with `useReducedMotion()`. | Listener fires on every scroll event — but we early-return when state hasn't changed, so React only re-renders on the boundary crossing. |
| B. framer-motion `useScroll` + `useTransform` | Reactive, less imperative. | Overkill — we want a discrete on/off, not an interpolation. Pulls in framer-motion's scroll machinery for one boolean. |
| C. `IntersectionObserver` on a sentinel `<div>` placed at the top of the page | No scroll listener at all; observer is the modern recommendation for "did we leave the top." | Requires injecting a sentinel into `app/page.tsx` (cross-cutting); adds a layer of indirection for what is one boolean. |

**Recommendation: A.** Passive `scroll` listener with a `requestAnimationFrame`-throttled state setter, or simply a state setter guarded by the previous value. Cheapest correct option. (Passive listener + early return is the typical Lenis-friendly pattern; Lenis dispatches normal scroll events that bubble to `window`.)

### D3. Backdrop-blur strategy

| Option | Pros | Cons |
|---|---|---|
| **A. `backdrop-blur-md` + `bg-white/80` toggled by class on `scrolled`** ✅ | Native CSS, GPU-accelerated, two utilities; works in every modern browser; honours reduced-motion via Tailwind class swap. | iOS Safari has historically had backdrop-blur composition quirks; mitigated by ensuring the `<header>` has `transform: translateZ(0)` or simply `will-change: backdrop-filter` if needed (Engineer to verify). |
| B. SVG/canvas-driven blur layer beneath the header | Total control of the blur radius and color. | Massively overengineered; perf-expensive; visually indistinguishable from native backdrop-filter. |
| C. No blur, just a solid `bg-white` swap | Simpler; works everywhere. | Loses the frosted-glass character that the reference site uses; under-delivers on the "match motion patterns" mandate. |

**Recommendation: A.** Stay native. If iOS Safari shows artifacts during QA, Engineer applies `transform: translateZ(0)` to the header — that's a known stabilizer. Reduced-motion users still get the final blurred state; we only skip *animating* the transition for them.

### D4. Nav-item hover affordance — caret rotation vs. underline scale vs. both

The issue spec says "ChevronDown on hover for caret" and "hover shows chevron tilt or underline."

| Option | Pros | Cons |
|---|---|---|
| **A. Both — caret rotates 180° AND underline scales in** ✅ | Two independent affordances reinforce each other; matches the layered micro-interactions on the reference site; the caret hints "this is a menu trigger" even though we're not building megamenus in v1 (Decision D5). | Slightly busier than picking one. |
| B. Caret rotation only | Subtler. | On a desktop nav, an underline is the universal "this is hoverable" cue — losing it makes the bar feel less responsive. |
| C. Underline only, no caret | Cleanest. | The issue spec explicitly names a chevron; removing it deviates from the brief and from the reference. |

**Recommendation: A.** Both affordances, both subtle. Designer decides exact angles, distances, and durations.

### D5. Megamenus / dropdown panels — v1 scope

The reference site reveals product menus on hover. The issue spec mentions chevrons but does not require dropdown content.

- **Alt A — no dropdown panels in v1.** Chevrons are decorative + serve as a hint. Each nav item links to its anchor section.
- **Alt B — full hover-revealing megamenus.** Significant scope: panel content, hover-intent timing, focus management, mobile fallback.

**Recommendation: A.** Ship the chrome and motion in v1; megamenus are a separate issue if and when product nav grows. This keeps the TopNav surface small and avoids inventing categories that don't exist for Relay yet. The chevrons stay (they hint at the *future* megamenu without committing us to building it now).

### D6. Mobile drawer — body scroll-lock

- **Alt A — toggle `document.body.style.overflow = "hidden"` while drawer is open.** Standard pattern; cheapest; reverts cleanly on close.
- **Alt B — install a focus-trap library + scroll-lock library** (e.g. `react-focus-lock`, `body-scroll-lock`). Robust to edge cases (iOS rubber-banding, focus escape).
- **Alt C — leave scroll unlocked.** Drawer is fixed-positioned, so the page underneath can still scroll, which feels broken on touch.

**Recommendation: A** for v1. Manual scroll-lock + a small `useEffect` that returns focus to the menu trigger on close. If iOS rubber-banding becomes a complaint, Engineer revisits with B. Lenis's smooth-scroll provider should be paused while the drawer is open — Engineer to verify whether toggling `body.overflow` is sufficient with our current Lenis config; if not, we expose a Lenis pause via the layout's provider (separate, tiny issue).

### D7. Brand cluster — link to `#top` vs. plain `<div>` vs. soft-router `<Link>`

- **Alt A — `<a href="#top">`** ✅ Universal "go home" affordance; on a single-page site, `#top` returns to the hero. Right-click and ⌘-click work.
- **Alt B — Plain `<div>` with no link.** Loses the well-known "click the logo to go to the top" interaction.
- **Alt C — Next `<Link href="/">`.** Correct *if* this is ever multi-route. For now it's a single page; `<a href="#top">` does the same with no Next overhead.

**Recommendation: A.** Engineer should also ensure the hero `<section>` (or `app/page.tsx`'s top wrapper) has an `id="top"` anchor; if not, scrolling falls back to `window.scrollTo({ top: 0 })` via an `onClick` handler that calls `e.preventDefault()` then scrolls.

### D8. Nav item destinations — anchors vs. routes vs. no-ops

The five labels (Products / Solutions / Developers / Company / Pricing) don't have real destinations in this prototype.

- **Alt A — `<a href="#section-id">` mapping to existing in-page sections** for ones that match (e.g. *Pricing* → `#pricing` if a pricing section exists; *Developers* → `#code` for the CodeMockup section). For ones that don't (*Products*, *Solutions*, *Company*), use `href="#"` with `onClick={(e) => e.preventDefault()}`.
- **Alt B — All `href="#"` placeholders, no anchor mapping.** Simplest; loses the "scroll-spy" payoff that scroll-aware navs typically have.
- **Alt C — Build out fake routes.** Out of scope.

**Recommendation: A.** Wire up anchors where corresponding sections exist; treat the rest as no-ops. Engineer maps labels → anchors; Designer confirms which mapping is desired. (Future: scroll-spy that highlights the active nav item — out of scope for v1.)

### D9. Animation library — framer-motion vs. GSAP

The issue spec names framer-motion explicitly. Project Context allows GSAP for "scroll-linked timeline" work, framer-motion for component-local entrances and one-shot transitions.

- **Alt A — framer-motion** ✅ Already installed; `AnimatePresence` for the drawer is idiomatic; `useReducedMotion` is built in; the backdrop transition is a discrete state change (boolean → boolean), not a scrubbed timeline. There's no scroll-driven *interpolation* here — just a class swap that we soften.
- **Alt B — GSAP + ScrollTrigger.** Wrong tool for a binary state change; ScrollTrigger shines when something needs to scrub continuously across a scroll range.

**Recommendation: A.** Honour the spec. GSAP is reserved for sections that actually scrub (Hero parallax, Features pinning, etc.).

### D10. Header semantics + landmark structure

- Outer element is `<header role="banner">` (the implicit role of `<header>` at the root level is already `banner` — no explicit role needed).
- Center nav is `<nav aria-label="Primary">` so screen-reader users can list both this and the footer's `<nav aria-label="Footer">` distinctly.
- Mobile drawer panel is `role="dialog" aria-modal="true" aria-label="Menu"`; close button has `aria-label="Close menu"`; Escape closes; focus moves into the drawer on open and back to the trigger on close.

This is non-negotiable a11y plumbing — Designer/Engineer don't need to relitigate it, but Designer should ensure visible focus styles on every interactive element work against both the transparent and frosted backdrops.

### D11. z-index policy

- `<header>` sits at `z-50`. Drawer scrim at `z-50` as well (sibling to header but rendered after — natural stacking) and panel at `z-50` above the scrim. The Hero and below sit at default stacking.
- A page-level `Toast` or modal would need to sit above `z-50` later. Not relevant to this section but flagged so the Engineer working on a future modal knows to use `z-60+`.

## Open questions for Designer

Designer owns `app/design/relay/topnav-design.md` next. They should resolve:

1. **Resting (transparent) state colors.** The hero has a light gradient backdrop. Are nav-item labels `ink-700` resting / `ink-900` hover? Does the brand wordmark stay `ink-900` against the gradient or shift to `ink-800` for legibility? What about the "Sign in" ghost link?
2. **Frosted (scrolled) state.** Confirm `bg-white/80` + `backdrop-blur-md` + `border-b border-ink-100`. Or do we want a faint shadow (`shadow-card`) instead of (or in addition to) the border?
3. **Brand chip styling.** Pill / square / rounded-rectangle? Fill `primary-50` or transparent? Stroke vs. fill `Zap` icon? Wordmark size and weight (Inter `semibold` vs `bold`)?
4. **Caret micro-interaction.** Rotate 180° (current spec) vs. rotate 90° vs. translate-y down 2px? Duration (~150ms `ease-out-soft`)? Should the underline ride beneath the *label only* or beneath label + caret?
5. **Underline geometry.** Thickness (1px / 1.5px / 2px), color (`primary-500` / `ink-900`), origin (`origin-left`), distance below the baseline.
6. **CTA pill geometry.** Height (commonly `h-9` / `36px` for marketing nav), horizontal padding, border radius (`rounded-full` vs. `rounded-lg`), gap between the three. Confirm `shadow-cta` for the primary pill.
7. **Primary CTA arrow nudge.** Translate-x distance on hover, easing, whether the arrow scales-in from `opacity-0` or is always visible.
8. **Mobile breakpoint.** Tailwind's `md` is `768px`. Confirm or adjust. At what width does the drawer width transition from `w-[85vw]` to `w-[360px]`?
9. **Drawer panel.** Width (`min(360px, 85vw)` proposed), corner radius (square edges flush to viewport vs. rounded-l), interior padding, divider treatment between sections, full-width CTA stacking.
10. **Mobile drawer entrance.** Exact slide distance, duration, easing. Does the brand+close header sit on top of (sticky inside the drawer) or just above the nav list?
11. **Scroll-aware transition duration.** Spec'd at ~200ms — confirm or adjust against the rest of the site's motion language.
12. **Focus-ring color** on transparent vs. frosted backgrounds. `ring-primary-300` on white surfaces is fine; against the hero gradient, may need a halo or thicker offset.
13. **Logo-mark anchor (`#top`).** Should clicking the brand smooth-scroll (Lenis) or hard-jump? Answer affects Engineer's `onClick` handler.

## Open questions for Copywriter

Copywriter delivers `app/content/relay/topnav.ts` exporting `topNavContent`. Required keys:

| Key | Rules | Notes |
|---|---|---|
| `brand` | One word; PascalCase; no exclamation. | Locked: `"Relay"`. Listed for completeness so Engineer doesn't hardcode the wordmark. |
| `nav` | Array of 5 `{ label, href }`. Each label 1–2 words, no exclamation. | Spec proposes Products / Solutions / Developers / Company / Pricing. Confirm or replace with originals; respect the brand-voice rules and forbidden-word list. |
| `signIn` | 1–2 words. | Spec: "Sign in". Keep unless Copywriter has a stronger original. |
| `contactSales` | 2–3 words. | Spec: "Contact sales". |
| `startCta` | 2–4 words; action verb. | Spec: "Start for free". |
| `mobileMenuLabel` | Short accessible label for the open-menu button. | Suggested: "Open menu". |
| `mobileMenuCloseLabel` | Short accessible label for the close button. | Suggested: "Close menu". |

**Voice rules** (re-stating from Project Context for convenience):
- Confident, technical, energetic. Never marketing fluff.
- Headlines ≤ 12 words; CTAs 2–4 words.
- No exclamation marks. Em dashes are fine.
- Forbidden words: *powerful, next-gen, seamless, robust, cutting-edge, leverage, unlock, supercharge, blazing-fast, world-class, revolutionize, game-changing*.

## Out of scope

- **Megamenus / hover-revealing dropdown panels.** Chevrons are decorative in v1; if/when product nav grows, file a follow-up issue (`TopNav megamenus`).
- **Scroll-spy** — highlighting the active nav item based on which section is in view. Cheap to add later; not a v1 ask.
- **Search.** Reference sites often add a search affordance to the bar; Relay doesn't have search yet.
- **Locale switcher / region picker.** Not required.
- **Auth-aware nav** — distinguishing logged-in vs. logged-out is irrelevant for a marketing landing.
- **Dark mode** — not in scope until the page as a whole opts into it.

## Acceptance criteria mapping

The issue lists five acceptance criteria. This ADR addresses each:

| Criterion | Where this ADR resolves it |
|---|---|
| Renders without errors at vlad:3010 | Composition + framework choice (Next 14 App Router, client component) is consistent with the rest of `components/relay/`; gates (`tsc --noEmit`, `next build`) are Engineer's verification step. |
| Scrolling visibly transitions backdrop | Decisions D2 + D3. |
| Hover on each nav item shows chevron tilt or underline | Decision D4 (both, layered). |
| Mobile drawer opens/closes | Composition (item 7) + Decision D6 (scroll-lock + a11y). |
| Vision QA matches reference's top strip | Layout (item 1–6) keeps the reference's grid: brand left, nav center, CTAs right; frosted-on-scroll matches the reference's pattern. Brand and copy are original (Project Context "REPLACE" rule). |

## Handoff

Designer is next. After Designer publishes `topnav-design.md` (visual spec — exact dimensions, colors, motion timings), Copywriter writes `topnav.ts`. Engineer then implements `components/relay/TopNav.tsx` against both specs. Reviewer + Security + Operator follow.
