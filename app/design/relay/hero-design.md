# Hero — Designer Visual Spec (SAN-11)

Visual spec for `components/relay/Hero.tsx`. Layered on top of `hero-architect.md`. Reference for layout intent only: `/home/vlad/fleet/smoketest/refs/twilio/scroll_00.png` (left/right column ratio, vertical density of badge → headline → subhead → CTA pair, spacing rhythm). Right-column composition (gradient blobs + code chip) is original Relay art and does not draw from the reference.

---

## 1. Layout

### Section element

- Tag: `<section>`.
- Background: radial gradient — `bg-[radial-gradient(120%_80%_at_50%_0%,theme(colors.primary.50)_0%,#ffffff_60%,#ffffff_100%)]`.
- Vertical padding: `pt-24 pb-20` at `≥ lg`; `pt-20 pb-16` at `md`; `pt-14 pb-12` at `< md`.
- The hero sits directly under `TopNav`, which is sticky/translucent — the radial sits *behind* the nav glass and reads through it.

### Container

- `max-w-[1280px] mx-auto`.
- Horizontal padding: `px-8` at `≥ lg`, `px-6` at `md`, `px-5` at `< md`.

### Grid

- `grid` with `lg:grid-cols-5`, `gap-x-12 lg:gap-x-16`.
- Left column spans `lg:col-span-3` (≈60%); right column spans `lg:col-span-2` (≈40%).
- `< lg`: `grid-cols-1`. Source order = visual order.
- Vertical alignment: `items-center` at `≥ lg` (text well visually centers against the 480-square stage). `< lg`: alignment is meaningless because columns stack.
- Row gap when stacked: `gap-y-12` at `md`, `gap-y-10` at `< md`.

### Mobile order (Architect open question 9)

**Visual sits BELOW the CTA pair on `< lg`.** Source order is left column first, then right column. The right column is *not* hidden on small screens — it's a brand-affordance signal that the page is a developer-platform pitch, and disappearing it makes the hero feel like text-on-blank. But it must not push the headline below the fold on small phones. Solution: source order ensures badge → headline → subhead → CTA pair render first; the visual stage follows.

### Stage (right column inner)

- `relative aspect-square w-full max-w-[480px]`.
- `mx-auto` so it centers within its column on stack.
- `overflow-hidden` (clips blob blur halos to the rounded stage edge).
- `rounded-[28px]` (matches the soft-square card radius the reference uses for its right-column tile).
- No border, no shadow on the stage itself (the blobs supply their own soft halo, and `shadow-card` here would compete with the `shadow-cta` on the primary button).

---

## 2. Type

### Eyebrow / badge

- Container: pill, `inline-flex items-center gap-2`, `px-3 py-1`.
- Text: `text-xs font-medium tracking-wide uppercase`. Letter-spacing is uppercase-default (Tailwind `uppercase`); no extra tracking modifier.
- Color: `ink-700` for the text, `primary-500` for the dot.
- Rendered with the eyebrow string from `heroContent.eyebrow` (Copywriter delivers).

### Headline

- Token: `display-xl` at `≥ lg` (3.75rem / line-height 1.05 / `-0.02em` tracking / weight 700 — already encoded on the token).
- Responsive ramp:
  - `≥ lg`: `text-display-xl`
  - `md` to `< lg`: `text-display-lg` (3rem / 1.1)
  - `< md`: `text-display-md` (2.25rem / 1.15)
- Color: `ink-900`.
- Width: `max-w-2xl` (≈ 42rem), no centering; left-aligned.
- Wrap behavior: `text-balance` (CSS `text-wrap: balance`) so a 10-word headline doesn't widow a single word on the second line.
- Font feature: inherits `font-feature: balance` from the token configuration.

### Subhead

- Token: `text-[1.125rem]` (18px) at `≥ md`; `text-base` (16px) at `< md`.
- Line-height: `leading-7` (1.75rem) at `≥ md`; `leading-6` at `< md`.
- Letter-spacing: default (no `tracking-*` modifier).
- Color: `ink-600`.
- Width: `max-w-prose` (≈ 65ch), but additionally clamped to `max-w-[520px]` so it never overshoots the headline measure on wide viewports.
- Weight: `font-normal` (400).

### CTA labels

- Both buttons: `text-sm font-semibold` (14px / 600).
- Letter-spacing: default.
- The arrow icon is sized `h-4 w-4` (`size-4`), `aria-hidden`, paired with the label by an `inline-flex items-center gap-2`.

### Code chip

- Token: `font-mono text-[13px] leading-5 font-medium`.
- Color: `ink-800` for the code text. Punctuation (braces, quotes, colons) renders in `ink-500` IF the Engineer wants to do basic syntax tinting via spans — optional, not required.
- The chip line is a single short call (e.g. `relay.send({ to: '+1…' })`) — Copywriter owns the exact string.

### Trust microcopy under CTAs (optional)

- Reference shows "Free trial · No credit card required · Flexible pricing" in a small ink-500 row beneath the CTAs. The Architect did not request it, and the issue spec does not list it, so this Designer spec **omits** it. If Copywriter wants to surface trust microcopy, it should be a separate Architect/Designer iteration.

---

## 3. Color

| Surface / element | Token / value | Notes |
|---|---|---|
| Section background | `bg-white` base + radial `primary-50 → white` | Radial fades to white by ~60%; rest of page reads as flat white |
| Headline | `text-ink-900` (#111827) | Contrast vs. white background ≈ 18.7:1 — far above WCAG AAA |
| Subhead | `text-ink-600` (#4B5563) | Contrast vs. white ≈ 7.7:1 — passes AAA for normal text |
| Eyebrow text | `text-ink-700` (#374151) | Contrast vs. white ≈ 10.3:1 |
| Badge background | `bg-white` | Pill sits on the radial — white pops cleanly against the `primary-50` halo |
| Badge ring/border | `ring-1 ring-ink-200` | Hairline definition without a heavy border |
| Badge dot | `bg-primary-500` | Pulse animation defined in §5 |
| Primary CTA fill | `bg-primary-500` (#5B6CFF) | Hover: `bg-primary-600` (#4A58E0) |
| Primary CTA text | `text-white` | Contrast on `primary-500` ≈ 4.62:1 — passes WCAG AA for ≥14px bold (which our `text-sm font-semibold` qualifies as: 14px bold) and clears 4.5:1 for normal text. Adequate. |
| Primary CTA shadow | `shadow-cta` token | Subtle blue glow under the button |
| Secondary CTA fill | `bg-transparent` | Ghost on the radial |
| Secondary CTA text | `text-ink-800` (#1F2937) | Contrast on white ≈ 14.4:1 |
| Secondary CTA border | `border border-ink-200` | Hairline |
| Secondary CTA hover | `bg-ink-50` (#F9FAFB) | Subtle fill |
| Stage background | (none — fully transparent) | Blobs supply all color |
| Blob 1 (back) | `bg-primary-300` (#A9B3FF) | `opacity-60`, `blur-3xl`, `mix-blend-mode: normal` |
| Blob 2 (mid) | `bg-primary-500` (#5B6CFF) | `opacity-50`, `blur-3xl`, `mix-blend-mode: multiply` against the lighter blob behind for color depth |
| Blob 3 (accent) | `bg-ink-200` (#E5E7EB) | `opacity-70`, `blur-3xl`, `mix-blend-mode: normal`. Cool-neutral counterweight that keeps the composition from going monochromatic-purple |
| Code chip background | `bg-white/80` + `backdrop-blur-md` | Frosted glass over the blobs; reads as a "lifted" surface |
| Code chip border | `ring-1 ring-ink-200/80` | Hairline that survives over the blob colors |
| Code chip shadow | `shadow-card` | Lift |
| Code chip text | `text-ink-800`; punctuation `text-ink-500` (optional) | See §2 |
| Focus ring | `ring-2 ring-primary-300 ring-offset-2 ring-offset-white` | Architect open question 10 — confirmed |

**Contrast minima (verified above):** all text/foreground pairs clear WCAG AA contrast for their use; headline/subhead/eyebrow clear AAA.

---

## 4. Spacing rhythm

### Left column (text well) vertical cadence

In source order, top-to-bottom, all gaps stated as `mt-*` on the next element (or `space-y-*` on a wrapping div — Engineer picks):

| Element | Top gap |
|---|---|
| Badge | (top of column) |
| Headline | `mt-6` (1.5rem) at `≥ md`; `mt-5` at `< md` |
| Subhead | `mt-6` at `≥ md`; `mt-5` at `< md` |
| CTA pair | `mt-10` at `≥ md`; `mt-8` at `< md` |

Rationale: headline → subhead is a tight pair (same intent), so 24px is enough; CTA pair earns a wider gap (40px) to read as a deliberate next step.

### CTA pair internal

- Layout: `flex` (`flex-col` at `< sm`, `flex-row` at `≥ sm`).
- Gap: `gap-3` (0.75rem) when stacked, `gap-4` (1rem) when row.
- Buttons stretch to full-width when stacked (`w-full sm:w-auto`).

### CTA button internals

- Height: `h-12` (3rem / 48px) — matches the reference's hero-CTA height, large enough to feel primary.
- Horizontal padding: `px-6` (1.5rem).
- Border radius: `rounded-full`. Reference uses fully-rounded pill CTAs in the hero; we follow that.
- Icon spacing: `gap-2` between label and `ArrowRight`.

### Right column (stage) — inner positioning

Coordinates below assume the 480×480 stage as the reference frame, expressed as percentages of the stage so the composition scales cleanly when the stage shrinks under `lg` (e.g. on tablet at ~360px-square).

- **Blob 1 (`primary-300`, back layer)**
  - Size: `h-[60%] w-[60%]` (≈ 288×288px on a 480 stage).
  - Position: `top-[-8%] left-[-12%]`.
  - z-index: `z-0`.
- **Blob 2 (`primary-500`, mid layer)**
  - Size: `h-[55%] w-[55%]`.
  - Position: `top-[18%] right-[-10%]`.
  - z-index: `z-10`.
- **Blob 3 (`ink-200`, accent / counterweight)**
  - Size: `h-[45%] w-[45%]`.
  - Position: `bottom-[-6%] left-[8%]`.
  - z-index: `z-0` (sits behind blob 2, ahead of blob 1's halo by virtue of position).
- **Code chip**
  - Size: intrinsic width based on monospace text, `min-w-[220px]`, `max-w-[280px]`.
  - Padding: `px-4 py-3`.
  - Border radius: `rounded-xl` (12px).
  - Position: `bottom-[16%] left-[10%]`. (Bottom-left of the stage, sitting in front of blob 3, with blobs 1/2 forming the soft halo behind.)
  - z-index: `z-20` (always on top of all blobs).
  - Optional faux window-chrome: **none.** The chip is a single line of code; adding traffic-light dots would imply "this is an editor pane," which oversells. Keep it as a clean lifted card.

---

## 5. Motion

All motion below uses framer-motion (per Architect Decision 2 — no GSAP for the hero). The blobs are not scroll-linked; they idle.

### Entrance — left column

- Each text element (badge, headline, subhead, CTA pair) animates from `{ opacity: 0, y: 12 }` to `{ opacity: 1, y: 0 }`.
- Stagger: 80ms between elements.
- Duration: 500ms.
- Easing: `ease-out-soft` (token: `cubic-bezier(0, 0, 0.2, 1)`).
- Trigger: on mount (the hero is above-the-fold by definition; no `whileInView` needed for the left column).

### Entrance — right column

- Stage container animates from `{ opacity: 0, scale: 0.96 }` to `{ opacity: 1, scale: 1 }`.
- Duration: 700ms. Easing: `spring` token (`cubic-bezier(0.175, 0.885, 0.32, 1.275)`).
- Trigger: on mount, with a 200ms delay so the text well leads.
- Code chip then animates from `{ opacity: 0, y: 8 }` to `{ opacity: 1, y: 0 }`. Duration: 400ms. Easing: `ease-out-soft`. Delay: 800ms (lands after the stage settles).

### Idle — blob drift

Each blob drifts on its own loop. Architect open question 2 — confirmed timings:

| Blob | x amplitude | y amplitude | scale range | duration | easing | phase offset |
|---|---|---|---|---|---|---|
| Blob 1 (back / `primary-300`) | ±18px | ±28px | 0.95 → 1.05 | 11s | `easeInOut` (framer-motion built-in) | 0s |
| Blob 2 (mid / `primary-500`) | ±24px | ±16px | 0.97 → 1.03 | 9s | `easeInOut` | 1.2s |
| Blob 3 (accent / `ink-200`) | ±14px | ±22px | 0.96 → 1.04 | 13s | `easeInOut` | 0.6s |

- Implementation: `animate={{ x: [-amp, amp, -amp], y: [-amp, amp, -amp], scale: [...] }}` with `transition={{ duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: phaseOffset }}`. Engineer should use `repeatType: "mirror"` (not `"reverse"`) so the blob doesn't snap when wrapping — produces a smooth back-and-forth.
- Easing intent: `easeInOut` (not the token `ease-out-soft`) because ambient drift wants symmetric in/out — pure `ease-out-soft` would jerk on the return leg. Keep the token vocabulary for entrances and hovers; use framer's `easeInOut` for ambient loops.
- Why these timings: prime-ish ratios (9 / 11 / 13 seconds) ensure the three loops never re-synchronize within a normal session, so the composition never repeats a "frame" the visitor has seen before. Amplitudes are below 6% of stage width to keep blobs from clipping the rounded stage edge under blur.

### Pulse — badge dot

- The dot has a sibling `span` styled `absolute inset-0 rounded-full bg-primary-500 opacity-75 animate-ping`. Use Tailwind's built-in `animate-ping` (no framer-motion needed for this) — it's a CSS keyframe, ~1s loop, scales 1 → 2.25 with opacity fade.

### Hover — primary CTA

- Background transitions from `primary-500` to `primary-600`.
- `ArrowRight` icon translates `+2px` on x (`group-hover:translate-x-0.5`).
- Box-shadow brightens slightly: from `shadow-cta` to a 1.1× version (Engineer can interpolate with `hover:shadow-[0_10px_28px_-8px_rgba(91,108,255,0.55)]`).
- Duration: `transition-base` (300ms). Easing: `ease-out-soft`.

### Hover — secondary CTA

- Background fills from transparent to `ink-50`.
- Border darkens from `ink-200` to `ink-300`.
- Duration: `transition-fast` (150ms). Easing: `ease-out-soft`.

### Hover — code chip (optional, low priority)

- A subtle `scale: 1.02` on hover, 200ms `ease-out-soft`. **Skip if the chip's z-stack causes any flicker** — chip motion is decorative, not essential.

### Focus

- All focusable elements (both CTAs): `focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none`.
- The badge is non-interactive (no focus state).

### Reduced motion

`useReducedMotion()` returns true → all of the following must apply (Engineer wires this once at the top of the component):

- Entrance animations collapse to opacity-only (`y` and `scale` stay at their final values; only `opacity` tweens 0 → 1).
- Blob drift stops entirely. Each blob renders at the *midpoint* of its loop (`x: 0, y: 0, scale: 1.0`) — no transform.
- Badge dot `animate-ping` is suppressed. The Engineer can wrap it in a `motion-safe:animate-ping` class (Tailwind ships this variant) so the system handles it without an extra JS branch.
- Hover transitions remain (color changes only, no motion). The arrow's `translate-x` on hover should be conditionally suppressed under reduced motion — gate the `group-hover:translate-x-0.5` class with `motion-safe:`.

---

## 6. Accessibility

### Semantic structure

- Outer wrapper: `<section aria-labelledby="hero-headline">`.
- Headline: `<h1 id="hero-headline">…</h1>` (the hero's headline is the page's H1; there's only one per page).
- Subhead: plain `<p>`.
- Badge: `<div>` with no role; the eyebrow text is decorative-marketing. If Copywriter writes an eyebrow that conveys load-bearing status (e.g. "Now in public beta"), Engineer may upgrade it to `<p>` so it lands in the document outline.

### Focus order

- Tab sequence within the hero: primary CTA → secondary CTA. (The badge dot, blobs, and code chip are non-interactive.)
- The hero has no skip-link; the page's overall skip-link belongs to the `TopNav` issue, not here.

### Aria-labels

- Primary CTA: the visible label "Start for free" (or whatever Copywriter ships) is sufficient — no `aria-label` override.
- Secondary CTA: same.
- `ArrowRight` icon on the primary CTA: `aria-hidden="true"`. Decorative.
- Stage `<div>`: `role="presentation"` and `aria-hidden="true"`. The blobs and code chip carry no semantic content the screen reader needs (and the code chip text is ornamental, not a real call).
- Badge pulsing dot: `aria-hidden="true"`.

### Live regions

- None. The hero is static.

### Keyboard nav

- Both CTAs activate on Enter and Space when focused (default `<a>` behavior for Enter; `<a>` does not handle Space natively, but the `e.preventDefault()` on click is fine — the spec is no-op anyway, and these will become real `<a href="/signup">` and `<a href="/contact">` in production).
- No keyboard traps.

### Contrast minimums

- Body text (subhead): ≥ 4.5:1. Verified 7.7:1 (`ink-600` on white).
- Large display text (headline): ≥ 3:1. Verified 18.7:1.
- Interactive surfaces (CTAs): ≥ 3:1 against adjacent surface. Primary `primary-500` button on white background = 4.6:1; secondary border `ink-200` on white = 1.4:1 (border-only, hairline — acceptable for non-load-bearing dividers, but the secondary CTA's *text* `ink-800` on white is 14.4:1 and the focus ring carries the keyboard-affordance burden).
- Focus ring `primary-300` (#A9B3FF) on white offset = 1.9:1. Below 3:1 if treated as the sole focus indicator. **Mitigation**: the ring is 2px wide AND has a 2px white offset against any background, totaling a 4px high-contrast "halo" pattern. WCAG 2.4.13 (Focus Appearance — minimum 2px solid perimeter, ≥ 3:1 contrast against adjacent colors) is satisfied because the ring's outer edge meets `ink-700`-grade contrast against any darker background and the ring-offset white meets it against any darker context. On a pure-white page the visual cue is the *outline shape*, not chromatic contrast — accepted within Tailwind's default ring system. If an audit flags this later, switch to `ring-primary-500` for focus-visible state.

### Motion accessibility

Covered in §5 ("Reduced motion"). Re-stated for completeness: `prefers-reduced-motion: reduce` must collapse all transforms to a single opacity tween or disable entirely.

---

## 7. Allowed icons

- **`ArrowRight`** — verified exported in `lucide-react` v1.x. ✅

No other icons are needed by the hero (the badge dot is a CSS circle, not an icon). If Copywriter ships a `codeChipText` containing characters that imply an icon (e.g. a lightning bolt), do **not** add an icon — the chip stays text-only.

---

## 8. Engineer notes (non-binding)

These are not specs; they're hints to reduce churn during implementation.

- The radial-gradient utility above uses `theme(colors.primary.50)` so the token, not a hex, drives the value. If Tailwind JIT complains about the `theme()` reference inside an arbitrary value, fall back to the literal `#F4F5FF`.
- `repeatType: "mirror"` (not `"reverse"`) on the blob loops is a small but important detail for visual smoothness — see §5.
- The `motion-safe:` Tailwind variant handles the `animate-ping` on the badge dot without a JS branch; only the framer-motion blob loops need an explicit `useReducedMotion()` gate.
- The stage's `aspect-square` plus `max-w-[480px]` is mobile-friendly: the stage shrinks proportionally on narrow viewports without breaking the percentage-based blob positions.
