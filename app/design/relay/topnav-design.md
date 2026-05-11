# TopNav (sticky scroll-aware header) — Visual Spec

Issue: SAN-10 · Component: `components/relay/TopNav.tsx` · ADR: [`topnav-architect.md`](./topnav-architect.md)

This spec resolves every Designer-owned open question in the ADR. Engineer consumes this verbatim once Copywriter ships `topnav.ts`.

---

## 1. Layout

### Outer header

| Property | Value | Notes |
|---|---|---|
| Position | `fixed top-0 left-0 right-0` | Per ADR §Composition. |
| Height | `h-[72px]` (`4.5rem`) | Locked. Resting and scrolled states share this height — no shrink-on-scroll. |
| z-index | `z-50` | Per Decision D11. |
| Width | full viewport, no horizontal margins | Backdrop fills edge-to-edge so the blur/border read as a continuous bar. |

### Inner container

| Property | Value |
|---|---|
| Max width | `max-w-7xl` (1280px) |
| Mx | `mx-auto` |
| Horizontal padding | `px-6` mobile, `lg:px-8` ≥1024px |
| Layout | `flex items-center justify-between h-full` |
| Children order | brand cluster → center nav → CTA cluster (desktop) · brand cluster → mobile menu button (mobile) |

### Three-region grid (desktop, ≥`lg`)

The flex row resolves to three logical zones:

```
[ brand left | center nav (flex-grow, justify-center) | CTA cluster right ]
```

- **Brand cluster** — fixed natural width (~120px), `flex items-center gap-2`.
- **Center nav** — absolute-centered visually via `flex-1 flex justify-center`. This keeps it dead-center even when the brand and CTA clusters have unequal widths.
- **CTA cluster** — fixed natural width, `flex items-center gap-3`.

### Mobile (<`lg`)

- Brand left, mobile menu button right.
- No center nav, no CTA cluster.
- Header height unchanged.

### Responsive breakpoints

| Tailwind | Width | Behavior |
|---|---|---|
| default | <640px | Mobile layout. Drawer width `w-[85vw]`. |
| `sm` | ≥640px | Mobile layout. Drawer width `w-[85vw]`. |
| `md` | ≥768px | Mobile layout. Drawer width `w-[85vw]`. |
| `lg` | ≥1024px | Desktop layout (center nav + CTA cluster appear). `lg:px-8` kicks in. |

Drawer width transition: `w-[min(360px,85vw)]` for the entire mobile range. Resolved via the `min()` clamp; no breakpoint change needed.

---

## 2. Type

Inter throughout (`font-sans` token). All weights/sizes use Tailwind defaults except where called out.

| Element | Class | Computed | Weight | Tracking | Line-height intent |
|---|---|---|---|---|---|
| Brand wordmark "Relay" | `text-base font-semibold tracking-tight` | 16px | 600 | -0.01em | tight, single line |
| Center nav label | `text-sm font-medium` | 14px | 500 | default | single line |
| "Sign in" ghost link | `text-sm font-medium` | 14px | 500 | default | single line |
| "Contact sales" pill label | `text-sm font-medium` | 14px | 500 | default | single line |
| "Start for free" pill label | `text-sm font-semibold` | 14px | 600 | default | single line |
| Drawer brand wordmark | `text-base font-semibold tracking-tight` | 16px | 600 | -0.01em | matches header |
| Drawer nav label | `text-base font-medium` | 16px | 500 | default | larger than desktop for touch ergonomics |
| Drawer CTA label | inherit pill spec | — | — | — | — |

No display-* tokens in this section (those are reserved for headlines).

---

## 3. Color

### Header surface — resting state (`scrollY ≤ 8`)

| Surface | Value | Rationale |
|---|---|---|
| Background | `bg-transparent` | Hero gradient bleeds under. |
| Bottom border | none | No chrome at rest. |
| Shadow | none | — |

### Header surface — frosted state (`scrollY > 8`)

| Surface | Value | Rationale |
|---|---|---|
| Background | `bg-white/80` | Per ADR Decision D3. |
| Backdrop filter | `backdrop-blur-md` (12px) | Per ADR Decision D3. |
| Bottom border | `border-b border-ink-100` | 1px hairline. |
| Shadow | none | **Resolved Q2:** border only. A `shadow-card` at the same time stacks visually with the blur and reads heavy; the border alone is the cleaner reference match. |

### Brand cluster

| Element | Resting | Scrolled |
|---|---|---|
| Chip background | `bg-primary-50` | `bg-primary-50` |
| Chip border | none | none |
| Chip border-radius | `rounded-md` (6px) | same |
| Chip size | `h-8 w-8` (32×32) with icon `h-5 w-5` centered | same |
| `Zap` icon | stroke `text-primary-500`, fill none, `stroke-width: 2` | same |
| Wordmark color | `text-ink-900` | `text-ink-900` |

**Resolved Q3:** rounded-rectangle chip (6px radius), `primary-50` fill, stroked `Zap` in `primary-500`. Wordmark stays `ink-900` in both states — over the hero gradient (light, ~`primary-50` blend) the contrast still clears WCAG AA. Wordmark weight `font-semibold` (600), not bold.

### Center nav items

| State | Resting bar | Frosted bar |
|---|---|---|
| Label color, idle | `text-ink-700` | `text-ink-700` |
| Label color, hover | `text-ink-900` | `text-ink-900` |
| Caret color | inherits label | inherits label |
| Underline color | `bg-ink-900` | `bg-ink-900` |
| Underline thickness | 1.5px (`h-[1.5px]`) | same |

**Resolved Q1:** label color is unified across both states (`ink-700` → `ink-900` on hover). The hero gradient at the top of the page is light enough that `ink-700` reads cleanly without darkening. The "Sign in" ghost link follows the same idle/hover pair.

### CTA pills

| Pill | Background | Text | Border | Hover background | Hover text | Hover border |
|---|---|---|---|---|---|---|
| Sign in (ghost) | transparent | `text-ink-700` | none | transparent | `text-ink-900` | none |
| Contact sales (outlined) | transparent | `text-ink-900` | `border border-ink-200` | `bg-ink-900` | `text-white` | `border-ink-900` |
| Start for free (primary) | `bg-primary-600` | `text-white` | none | `bg-primary-700` | `text-white` | none |

The primary pill carries `shadow-cta` at rest and a deeper variant on hover (see §5 Motion).

### Contrast (WCAG AA targets)

| Pairing | Computed ratio | Standard | Pass? |
|---|---|---|---|
| `text-white` on `bg-primary-500` (#FFFFFF on #5B6CFF) | 4.17:1 | AA body 4.5:1 | **no** — do not use for body-size text |
| `text-white` on `bg-primary-600` (#FFFFFF on #4A58E0) | 5.50:1 | AA body 4.5:1 | yes — primary pill resting bg |
| `text-ink-900` on `bg-white/80` (assume blend ~#FCFCFD) | 17.5:1 | — | yes |
| `text-ink-900` on `bg-ink-900` (white-on-dark for hover Contact Sales) | 17.4:1 (inverted: `text-white` on `bg-ink-900`) | AA body 4.5:1 | yes |
| `text-ink-700` on hero gradient (`primary-50`-tinted) | ~10:1 | AA body 4.5:1 | yes |
| `text-ink-700` on `bg-white/80` | 10.7:1 | AA body 4.5:1 | yes |

---

## 4. Spacing rhythm

### Horizontal

| Gap | Value | Where |
|---|---|---|
| Brand chip ↔ wordmark | `gap-2` (8px) | inside brand cluster |
| Between center nav items | `gap-8` (32px) | `<nav>` flex gap on `md`, `gap-10` (40px) at `lg` |
| Inside each nav item (label ↔ caret) | `gap-1` (4px) | inline flex |
| Between CTA cluster items | `gap-3` (12px) | flex gap |
| Inside primary CTA (label ↔ arrow) | `gap-2` (8px) | inline flex |
| Container outer padding | `px-6` mobile, `lg:px-8` ≥`lg` | header inner container |

### Vertical / pill geometry

**Resolved Q6 (CTA pill geometry):**

| Pill | Height | Px x Py | Radius | Notes |
|---|---|---|---|---|
| Sign in (ghost) | `h-9` (36px) | `px-2 py-2` | n/a | Hit target only; no border. |
| Contact sales (outlined) | `h-9` (36px) | `px-4` | `rounded-full` | 1px border included in height. |
| Start for free (primary) | `h-9` (36px) | `px-4` | `rounded-full` | `shadow-cta` at rest. |

All three share the same `h-9` baseline so they sit on a single line.

### Underline geometry (nav items)

**Resolved Q5:**

| Property | Value |
|---|---|
| Thickness | `h-[1.5px]` |
| Color | `bg-ink-900` |
| Width | `100%` of label only (label-only, **not** label+caret) |
| Position | absolute, bottom of label, `bottom: -2px` from baseline |
| Origin | `origin-left` |
| Resting transform | `scale-x-0` |
| Hover transform | `scale-x-100` |

The underline rides under the label only; the caret sits beside the label and is decorative — including it under the underline reads as a wider hover surface than the label actually is.

### Drawer geometry

**Resolved Q9:**

| Property | Value |
|---|---|
| Width | `w-[min(360px,85vw)]` |
| Height | `h-full` |
| Position | `fixed top-0 right-0` |
| Background | `bg-white` (opaque) |
| Border-radius | `rounded-l-2xl` (16px on left edge only) — soft inner edge against the scrim, square against the viewport edge |
| Border | `border-l border-ink-100` (subtle separator) |
| Shadow | `shadow-card` to lift it off the scrim |
| Interior padding | `px-6 py-6` |
| Internal gap (sections) | `gap-6` between brand-row, nav-list, CTA-stack |
| Internal gap (nav items) | `gap-1` between rows; each row `py-3` for touch target ≥44px |
| Divider between nav-list and CTA-stack | `border-t border-ink-100`, `pt-6` after |
| CTA stacking | full-width (`w-full`), same vertical order: Sign in → Contact sales → Start for free, `gap-3` |

The drawer's brand+close header is a static row at the top of the panel — **not** sticky inside the drawer. The drawer content does not scroll in v1 (8 elements fit comfortably even at 568px viewport height). Should that change, the brand row gains `sticky top-0 bg-white z-10`.

### Scrim

| Property | Value |
|---|---|
| Position | `fixed inset-0` |
| Background | `bg-ink-900/40` |
| z-index | `z-50` (sibling to drawer panel) |

---

## 5. Motion

All scroll-driven behaviour here is a **discrete state change** (boolean flip), not a scrubbed timeline — framer-motion is the right tool (Decision D9). GSAP-flavoured language only appears where motion is genuinely scroll-linked; nothing here is.

### 5.1 Scroll-aware backdrop transition (resting ↔ frosted)

| Property | From (resting) | To (frosted) | Duration | Easing |
|---|---|---|---|---|
| `backgroundColor` | `rgba(255,255,255,0)` | `rgba(255,255,255,0.8)` | 200ms | `ease-out-soft` |
| `backdropFilter` | `blur(0px)` | `blur(12px)` | 200ms | `ease-out-soft` |
| `borderBottomColor` | `rgba(229,231,235,0)` | `rgba(229,231,235,1)` (`ink-100`) | 200ms | `ease-out-soft` |

**Resolved Q11:** 200ms is correct — long enough to feel intentional, short enough not to lag the scroll. Matches `transition-base` direction without using its full 300ms (the user is mid-scroll; faster wins).

`useReducedMotion` fallback: drop all three to `0ms` (hard flip). The `backdrop-filter` interpolation is also a known perf trap on some browsers — collapsing to a flip is doubly correct here.

### 5.2 Brand cluster — entrance / hover

- **Entrance** (page mount): brief fade — `opacity 0 → 1`, 250ms `ease-out-soft`, no slide.
- **Hover**: cursor `pointer`. No transform on the cluster itself. The chip stays still — restraint reads more polished than a wiggle.
- **Active (mousedown)**: `scale: 0.98`, 80ms `ease-out-soft`.
- Reduced-motion: skip the entrance fade; remove the active-press scale.

### 5.3 Nav-item caret micro-interaction

**Resolved Q4:** rotate the caret. No translate.

| Property | Resting | Hover | Duration | Easing |
|---|---|---|---|---|
| Caret rotation | `rotate(0deg)` | `rotate(180deg)` | 180ms | `ease-out-soft` |
| Label color | `text-ink-700` | `text-ink-900` | 150ms | `ease-out-soft` |
| Underline `scaleX` | `0` | `1` (origin-left) | 200ms | `ease-out-soft` |

Why rotation, not tilt-down: rotation reads as "this menu opens" — it's the conventional megamenu cue, even though we don't open one in v1 (Decision D5). A 2px translate-y is too subtle on a 14px caret.

Reduced-motion: rotation duration → 80ms, underline duration → 0ms (instant on/off — still functional, no animation). Keep the color change instant.

### 5.4 Nav-item focus-visible

| Property | Value |
|---|---|
| Ring | `ring-2 ring-primary-300 ring-offset-2 ring-offset-white` |
| Ring on transparent header (resting state, over hero gradient) | `ring-2 ring-primary-500 ring-offset-2 ring-offset-transparent` — slightly darker ring + transparent offset because the white offset would punch a halo against the gradient |

**Resolved Q12:** swap the ring shade based on whether the bar is frosted (`ring-primary-300` over white) or transparent (`ring-primary-500` over the gradient). The Engineer derives this from the same `scrolled` state already in scope. Body of label/caret keeps its own color shift independently of the focus ring.

### 5.5 CTA pills — hover / focus / active

#### Sign in (ghost)

- Hover: color shift only (see §3 table). 150ms `ease-out-soft`.
- Focus-visible: same ring spec as nav items.
- Active: no transform.

#### Contact sales (outlined)

- Hover: `bg`, `text`, `border` all transition together. 200ms `ease-out-soft`.
- Focus-visible: ring spec as nav items.
- Active: `scale: 0.98`, 80ms.

#### Start for free (primary)

- Resting shadow: `shadow-cta` (token).
- Hover: `bg-primary-500 → bg-primary-600`, shadow darkens by ~30% (Engineer: bump shadow color to `rgba(74,88,224,0.55)` on hover via inline style or extend a `shadow-cta-hover` token — Designer recommends inline since this is the only consumer right now). Duration 200ms `ease-out-soft`.
- Active: `scale: 0.98`, 80ms.
- **Arrow nudge** (resolved Q7): `ArrowRight` always visible at rest. On hover translate-x `0 → 2px`, 180ms `ease-out-soft`. The arrow does not fade in — it lives there as a CTA affordance from the start.

#### All pills, reduced-motion

- All transitions collapse to instant property swaps. The active-press `scale` is removed entirely (no transform). Arrow nudge: skip the translate; arrow stays at rest position.

### 5.6 Mobile drawer

**Resolved Q10:**

| Phase | Property | From | To | Duration | Easing |
|---|---|---|---|---|---|
| Scrim enter | `opacity` | 0 | 1 | 180ms | `ease-out-soft` |
| Panel enter | `x` (translate) | `100%` | `0%` | 320ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` (custom — slightly springy land) |
| Panel enter | `opacity` | 0.95 | 1 | 320ms | matches above |
| Scrim exit | `opacity` | 1 | 0 | 160ms | `ease-out-soft` |
| Panel exit | `x` | `0%` | `100%` | 220ms | `ease-out-soft` (faster on exit — convention) |
| Body scroll-lock | `document.body.style.overflow` | `''` | `'hidden'` | instant | — |

The slight panel-fade-in (0.95 → 1 opacity) hides any subpixel render flash on the leading edge. Easing is `(0.2, 0.8, 0.2, 1)` — gentle overshoot character without being literally past 100%. (Stays inside `spring` family but tighter than the default `spring` token.)

Reduced-motion fallback: scrim and panel both opacity-only (no translate). 120ms enter, 80ms exit. Body scroll-lock unchanged (functional, not motion).

### 5.7 Header entrance on page load

Optional. If included, `opacity 0 → 1, y -8 → 0`, 280ms `ease-out-soft`, no stagger. Reduced-motion: skip entirely.

---

## 6. Accessibility

### Landmarks (locked by ADR Decision D10)

- `<header>` — implicit `banner` role.
- Center `<nav aria-label="Primary">`.
- Drawer panel: `role="dialog" aria-modal="true" aria-label="Menu"` (label string supplied by Copywriter via `mobileMenuLabel`).
- Mobile open button: `aria-label="Open menu"` (string from Copywriter).
- Drawer close button: `aria-label="Close menu"` (string from Copywriter).
- Drawer scrim: `aria-hidden="true"`.

### Focus management

- Tab order, desktop:
  1. Brand cluster anchor
  2. Each center nav item (5)
  3. Sign in
  4. Contact sales
  5. Start for free
- Tab order, mobile (drawer closed):
  1. Brand cluster anchor
  2. Open menu button
- Tab order, mobile (drawer open):
  1. Close button (focus moves here on open)
  2. Each drawer nav item (5)
  3. Sign in
  4. Contact sales
  5. Start for free
  - `Escape` closes drawer and returns focus to the open-menu button.
  - Focus is trapped inside the drawer while open (Engineer: a small `useEffect` cycling focusable children at the boundaries; no library required for this surface size).

### Visible focus styles

See §5.4. Every interactive element MUST show a `ring-2` halo on `focus-visible`. No `:focus` styles that get hidden by `outline:none`-style resets.

### Hit targets

- Desktop nav items: ≥36px tall (label `h-9` row).
- Mobile drawer nav items: ≥44px tall (`py-3` + `text-base`).
- Mobile menu button: `h-11 w-11` (`44×44`) tap target with the icon centered at `h-6 w-6`.
- Close button inside drawer: `h-11 w-11`.

### Contrast

All pairings clear WCAG AA per §3 table. The frosted-state translucent background (`white/80` over hero gradient) was the only non-trivial check — the hero gradient resolves light enough that the blended surface stays effectively white, and `ink-700`/`ink-900` text easily clears 4.5:1.

### Live regions

None in v1 (no async state updates, no toasts inside the nav).

### Reduced-motion

`@media (prefers-reduced-motion: reduce)` and framer-motion's `useReducedMotion()` both honored. Behaviors per §5; summary:

- Backdrop transition → instant flip.
- Caret rotation → faster (80ms), underline → instant.
- All `scale` micro-presses → removed.
- Drawer → opacity-only fade, no slide.
- Arrow nudge → removed.
- Header entrance → skipped.

---

## 7. Allowed icons (lucide-react v1.x verification)

All icons listed in the issue spec are confirmed present in the installed `lucide-react@1.x`:

| Icon | Use | Verified |
|---|---|---|
| `Zap` | brand chip | ✓ exported |
| `ChevronDown` | per nav item | ✓ exported |
| `Menu` | mobile open button | ✓ exported |
| `X` | drawer close button | ✓ exported |
| `ArrowRight` | "Start for free" trailing | ✓ exported |

No social icons (`Github`, `Twitter`, `Linkedin`, etc.) are needed in this section — those exclusions in Project Context are not load-bearing here.

---

## 8. Resolved open questions (cross-reference)

| ADR Q# | Topic | Resolution |
|---|---|---|
| Q1 | Resting-state nav colors | `ink-700` idle / `ink-900` hover, unified across both bar states. Brand wordmark stays `ink-900`. Sign in follows nav. |
| Q2 | Frosted-state chrome | `bg-white/80` + `backdrop-blur-md` + `border-b border-ink-100`. **No** shadow. |
| Q3 | Brand chip | `rounded-md` 6px square, `bg-primary-50`, stroked `Zap` in `primary-500`. Wordmark `font-semibold` (not bold). |
| Q4 | Caret micro-interaction | Rotate 180°, 180ms `ease-out-soft`. Underline rides under label only. |
| Q5 | Underline geometry | 1.5px `bg-ink-900`, label-width, `origin-left`, 2px below baseline. |
| Q6 | CTA pill geometry | All `h-9`, `rounded-full`, `px-4`. `gap-3` between pills. `shadow-cta` on primary. |
| Q7 | Arrow nudge | Always visible at rest; translate-x 2px on hover, 180ms. |
| Q8 | Desktop breakpoint | Tailwind `lg` (1024px). Three-region grid activates at `lg`; `md`–`lg` range uses mobile/drawer layout. |
| Q9 | Drawer panel | `w-[min(360px,85vw)]`, `rounded-l-2xl`, opaque white, `border-l border-ink-100`, `shadow-card`, `px-6 py-6`. |
| Q10 | Drawer enter/exit | Slide+fade enter 320ms, slide exit 220ms; scrim opacity 180/160ms. Brand+close row static, not sticky. |
| Q11 | Backdrop transition duration | 200ms `ease-out-soft`. |
| Q12 | Focus ring | `ring-primary-300` ring-offset white when frosted; `ring-primary-500` ring-offset transparent when resting. Engineer derives from `scrolled`. |
| Q13 | Brand `#top` smooth-scroll | **Smooth-scroll** via Lenis (the layout already provides it). Engineer's `onClick` calls `lenis.scrollTo(0, { duration: 0.8 })` if a Lenis instance is exposed; otherwise falls back to native `window.scrollTo({ top: 0, behavior: 'smooth' })`. Reduced-motion users get `behavior: 'auto'` (instant). |

---

## 9. Out-of-scope reminders

- No megamenus. Caret is decorative (Decision D5).
- No scroll-spy active-state on nav items.
- No search affordance.
- No locale switcher.
- No dark mode.

These deliberately remain absent from this spec — the visual language above accounts for v1 only.
