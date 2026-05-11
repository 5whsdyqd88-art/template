# CTA (gradient strip) — Architect Spec

Issue: SAN-17 · Component: `components/relay/CTA.tsx` · Already wired into `app/page.tsx`

## Purpose

A single conversion-focused panel near the bottom of the page that gives the visitor exactly two paths forward — self-serve start, or talk-to-sales — after they have scrolled through the proof and product sections. It is the page's "ask," visually distinct from every section above it via a saturated brand gradient.

## Composition

One default-exported React component, `CTA`, in `components/relay/CTA.tsx`. Single file, no sub-components extracted.

Internal structure (top-down):

1. `<section>` — full-bleed, the gradient lives here.
2. Decorative SVG layer — absolutely-positioned, `aria-hidden`, behind content. Two or three low-opacity curve paths.
3. Centered content stack (max-width container, mx-auto):
   - Headline (`<h2>`, `display-md`, white, balanced)
   - Subhead (`<p>`, `text-lg`, white at ~80% opacity)
   - CTA pair (flex row → wraps to column on narrow widths)
4. Primary CTA — solid white bg, `primary-700` text, contains label + `ArrowRight` icon.
5. Secondary CTA — transparent bg, white border, white text, no icon.

Both CTAs are `<a>` elements with `href` placeholders (`#start`, `#contact`) — anchor handoff points are an Open Question below.

Data flow: copy strings imported from `app/content/relay/cta.ts` (Copywriter artifact). No props, no children.

## State / data dependencies

- **Static.** No API, no client state, no derived computation.
- Content module: `app/content/relay/cta.ts`, exporting `ctaContent` per the Project Context content-module convention.
- One runtime-conditional behavior: `useReducedMotion()` from framer-motion gates the entrance animation. No other state.

## Interactions

- **Scroll entrance** — content stack fades up on first viewport entry (one-shot, not scrubbed). Threshold around 30% visible. Honors `prefers-reduced-motion`: when reduced, content is rendered in its final state with no transform/opacity transition.
- **CTA hover** — primary lifts subtly (translate-y + shadow); secondary fills to a translucent white wash. Both transitions sit on the existing `transition-base` token with `ease-out-soft`.
- **CTA focus-visible** — both CTAs show a focus ring with sufficient contrast against the gradient (white ring with a thin dark inset, or a halo at ~50% white). Designer to finalize.
- **CTA active** — depress feel only on the primary (slight scale-down). Secondary stays static on press.
- **Decorative SVG** — purely visual, `aria-hidden="true"`, no interaction. No parallax in v1 (see Decision D3).

No clicks/scrolls trigger anything beyond navigation; no live regions; no forms.

## Decisions

### D1. Animation library: framer-motion vs GSAP

The Project Context allows both: GSAP for scroll-linked/timeline work, framer-motion for "fade in once when entering viewport." This entrance is the latter — a single one-shot transform-and-fade as the section reaches the viewport.

- **Alt A — framer-motion (`motion.div` + `whileInView`).** Ergonomic, already loaded for other sections, integrates cleanly with `useReducedMotion()`. Single hook, single JSX wrapper.
- **Alt B — GSAP `useGSAP` + ScrollTrigger.** More powerful, but the CTA needs none of that power. Adds a `ScrollTrigger.refresh()` lifecycle to worry about and a heavier mental model for what is essentially one timeline node.

**Recommendation: A (framer-motion).** Reserve GSAP for sections doing pin/scrub/parallax (Hero, Features, CodeMockup). Treat the CTA as a "viewport-entrance" component.

### D2. Decorative background — inline SVG vs CSS-only vs raster

The brief asks for "subtle decorative SVG curves in background (low-opacity)."

- **Alt A — inline SVG paths**, absolutely positioned, two or three sweeping curves at ~6–10% white opacity. Lightweight, scales perfectly, color-controllable from the component.
- **Alt B — CSS-only radial/conic gradients** layered on top of the linear gradient. Cheaper, but harder to land an organic curve shape; tends to look like a "blob" not a "curve."
- **Alt C — raster PNG/WebP asset.** Defeats the "low-opacity curves" intent, adds a network round-trip, and bloats the bundle for what is essentially three Bezier paths.

**Recommendation: A (inline SVG).** Two or three paths is enough; keep the SVG as a sibling to the content stack with `pointer-events-none` and `aria-hidden`.

### D3. Parallax / scroll-linking on the decorative SVG

The reference site has scroll-linked drift on decorative elements throughout the page.

- **Alt A — no parallax in v1.** The CTA strip is short, sits near the page bottom, and is on screen for a fraction of a viewport-height of scroll. The motion budget barely registers.
- **Alt B — light parallax** (translate-y a few percent across the section's scroll range) via GSAP ScrollTrigger.

**Recommendation: A.** Skip it for v1. If the page feels static here after the rest is in, revisit as a follow-up issue. Adding GSAP for one decorative drift here costs more than it returns.

### D4. CTA elements — `<a>` vs `<button>` vs Next `Link`

- **Alt A — `<a href="...">`** with placeholder hrefs. Simple, correct semantics for navigation, no client JS needed.
- **Alt B — `<button>`.** Wrong — these go somewhere, they don't perform an in-page action.
- **Alt C — Next `Link`.** Correct *if* the destinations are in-app routes. Today both destinations are unknown (Open Question Q1), and using `Link` with a hash href adds no value over `<a>`.

**Recommendation: A** for now. Engineer should swap to `Next/Link` when the destinations resolve to real in-app routes.

### D5. Heading level

`<h2>` is correct. The Hero owns `<h1>`, every mid-page section is `<h2>`. Don't promote to `<h1>` for "emphasis."

### D6. Reduced-motion strategy

- **Alt A — disable entrance animation entirely** (final state rendered immediately). Simple, no surprise.
- **Alt B — replace transform with a short opacity-only fade.** Still respects intent ("don't move things") but adds a tiny attention cue.

**Recommendation: A.** Reduced-motion users have asked the OS to stop moving things; honor that fully. Hover/focus transitions on the buttons stay (those are interaction feedback, not autoplay).

### D7. Section anchor / id

The CTA section should expose a stable `id` (e.g. `id="cta"`) so the TopNav can deep-link to it if desired. Cheap to add now, painful to retrofit. Adopt.

## Open questions for Designer

1. **Gradient direction and stops.** The brief says "primary-700 → primary-500" — diagonal (e.g. `bg-gradient-to-br`), horizontal, or vertical? Does a third stop add depth?
2. **Decorative SVG curve shapes** — count, opacity (start with ~8% white?), bleed off the edges yes/no, layered behind content with no clipping.
3. **CTA button shapes and sizes** — radius, height, horizontal padding, gap between primary and secondary on desktop and stacked on mobile. Does the primary CTA's icon sit before or after the label?
4. **Focus-ring treatment on the gradient backdrop** — single white ring, double ring, or offset shadow?
5. **Vertical rhythm** — `py-24` is the brief's starting point; confirm or adjust per the rest of the page's section cadence.
6. **Mobile breakpoint behavior** — at what width do the CTAs stack? Does the headline drop a tier (e.g. `display-md` → `text-3xl`)?
7. **Subhead width** — does the subhead get a `max-w-2xl` constraint, or fill the container?

## Open questions for Copywriter

Content keys to populate in `app/content/relay/cta.ts` exporting `ctaContent`:

1. `headline` — ≤ 12 words, no exclamation mark, no forbidden words. The brief offers "Build what's next, ship it sooner" as a starting point; an original alternative is welcome.
2. `subhead` — one line, ≤ 24 words, plain declarative.
3. `primaryCta` — 2–4 words, action verb. Starting point: "Start building."
4. `secondaryCta` — 2–4 words. Starting point: "Contact sales."
5. (Optional) `microcopy.aria.section` — accessible name for the `<section>` if the headline alone isn't sufficient.

Voice rules from Project Context apply: confident, technical, energetic; no marketing fluff; no exclamation marks; em dashes are fine.

## Acceptance criteria mapping

Issue's acceptance criteria → spec coverage:

- *Full-width section with gradient* → Composition step 1 + D1/D2.
- *Both CTAs visible* → Composition steps 4–5 + D4.
- *Strong color contrast on text* → D6 + Designer Q4 (focus ring) and the primary's `primary-700` text on white bg.

## Out of scope

- A/B variant testing of CTA copy.
- Form-inline variant (e.g. email capture) — not in this issue.
- Internationalization — content module is single-locale for v1.
- Analytics events on CTA click — handled centrally elsewhere when wired.
