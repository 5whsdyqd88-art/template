# Hero — Architect ADR (SAN-11)

## Purpose

The first viewport of the Relay landing page. It announces *what Relay is* in one sentence, hands the visitor two clear next steps (sign-up vs. sales), and sets the page's visual register with an abstract, motion-rich gradient composition on the right.

## Composition

**Single section file**: `components/relay/Hero.tsx`. Imported once from `app/page.tsx`. No sub-files — the whole hero is small enough that splitting it adds friction (see Decision 1).

Internal regions, top-to-bottom in source order:

1. `<section>` — the outer banner. Sets the radial background, vertical padding, and centers the inner container.
2. `Container` (inline `div`, `max-w-[1280px] mx-auto`) — establishes the page grid alignment.
3. `Grid` (CSS grid, `lg:grid-cols-5`) — left column spans 3 (≈60%), right column spans 2 (≈40%). On `< lg`, single column, right column is rendered *below* the CTAs.
4. **Left column** (text well):
   - `Badge` — pill with a small pulsing dot + eyebrow text.
   - `Headline` — `display-xl`, `ink-900`, `text-balance`, `max-w-2xl`.
   - `Subhead` — `text-[1.125rem]`, `ink-600`, `max-w-prose`.
   - `CTAPair` — primary filled button + ghost button, horizontal on `≥sm`, stacked on `< sm`.
5. **Right column** (visual):
   - `Stage` — square aspect (`aspect-square max-w-[480px] w-full`), `relative`, `overflow-hidden`, rounded.
   - Three `Blob` motion `div`s, absolutely positioned, each with `blur-3xl` and a different primary/ink tint.
   - One `CodeChip` — absolutely positioned card with `font-mono` text and `shadow-card`.

### Data flow

Static. The Hero owns no client state, accepts no props, and reads no remote data. All copy comes from a single import: `import { heroContent } from "@/content/relay/hero"` (Copywriter delivers this module — see file path conventions in Project Context). All visuals are CSS / SVG / framer-motion.

The component is a **client component** (`"use client"`) because it consumes `useReducedMotion` and `framer-motion`'s `motion.*`. Nothing about the hero needs SSR-only behavior.

## State / data dependencies

- **Static content**: imported from `app/content/relay/hero.ts` (eyebrow, headline, subhead, primaryCta, secondaryCta, codeChipText).
- **Runtime state**: none.
- **Effects**: framer-motion drift loops on the three blobs, gated on `useReducedMotion()`.

## Interactions

- **Primary CTA** (`Start for free`): `<a href="#">` with `ArrowRight` icon. On hover, button background darkens one step (`primary-500` → `primary-600`), icon translates `+2px` on x. No real route — issue spec says no-op `#`.
- **Secondary CTA** (`Talk to sales`): `<a href="#">`, ghost style. On hover, background fills `ink-50`.
- **Focus**: both CTAs receive a visible focus ring (`ring-2 ring-primary-300 ring-offset-2`) on `:focus-visible`.
- **Blobs**: continuous drift loops (translate + scale, ~9–13s, staggered, `repeat: Infinity`, `repeatType: "reverse"`). Designer specs the exact distances and timings.
- **Code chip**: static (no typewriter, no scroll-linked motion — see Decision 5). It does receive a one-shot entrance fade-up tied to `whileInView` so it animates in once when the hero enters the viewport on first load — relevant primarily on slower scroll-restoration paths.
- **Reduced motion**: when `useReducedMotion()` is true, blobs are rendered at their resting position and the entrance animation is collapsed to opacity-only.
- **No live regions**, no popovers, no menus inside the hero.

## Decisions

### 1. Single component file vs. split (`Hero` + `HeroVisual` + `CodeChip`)

| Option | Pros | Cons |
|---|---|---|
| **A. Single `Hero.tsx`** ✅ | Easiest to read; visual region is purely decorative; nothing is reused elsewhere; matches the existing flat shape of `components/relay/`. | If the visual ever grows complex (e.g. dataviz), it'll have to be split later. |
| B. Split into `Hero` + `HeroVisual` (+ `CodeChip`) | Clean separation of "text well" and "decorative stage"; easier to test each in isolation. | Premature: visual is ~30 lines of motion divs; nothing reuses `HeroVisual`; adds two extra files. |

**Recommendation: A.** Splitting is overkill for ≤120 LOC. Revisit if the visual ever becomes interactive (e.g. cursor-tracking blob, or a video) — at that point splitting earns its keep.

### 2. Animation library for blob drift: framer-motion vs. GSAP

| Option | Pros | Cons |
|---|---|---|
| **A. framer-motion** ✅ | Already in `package.json`; component-local infinite loops are a one-liner with `animate={{...}} transition={{ repeat: Infinity }}`; declarative; `useReducedMotion()` hook is built-in. | Less precise sequencing if we ever need to choreograph blobs against scroll. |
| B. GSAP + ScrollTrigger | Project Context names GSAP for scroll-linked motion; richer timeline control. | GSAP and `@gsap/react` are **not installed** (verified in `package.json`); blob drift is *not* scroll-linked, it's an idle decorative loop — GSAP would be overkill; adds a dependency for one section. |

**Recommendation: A.** The blobs aren't scroll-linked — they idle in place. framer-motion is the right tool for a per-component infinite tween, and it's already installed. The issue spec explicitly names framer-motion; honoring it. Designer should specify any *scroll-linked* hero behavior (e.g. parallax of the right column on scroll-down) separately, in which case Engineer adds GSAP at that point. **This ADR does not introduce GSAP for the hero.**

### 3. Right-column composition: gradient blobs vs. illustrated mock vs. screenshot

| Option | Pros | Cons |
|---|---|---|
| **A. Gradient blobs + code chip** ✅ | Matches the issue spec exactly; abstract → no IP risk vs. reference; easy to make motion-friendly; cheap to render; frames Relay as a developer-facing brand via the mono code chip. | Less product-specific than a UI screenshot. |
| B. Static illustrated UI mock (e.g. dashboard SVG) | More "tangible" — visitors see a fake product. | Risks looking like a copy of any well-known SaaS hero; needs Designer to invent original art; harder to keep on-brand. |
| C. Real screenshot of a Relay app surface | Most concrete. | We don't have a real product yet — this is a marketing landing for a fictional Relay; would have to be faked. |

**Recommendation: A.** Spec-aligned and avoids any IP overlap with the Twilio reference (which uses a dark video tile — explicitly REPLACE per Project Context).

### 4. Layout technique: CSS grid vs. flexbox

| Option | Pros | Cons |
|---|---|---|
| **A. CSS grid (`lg:grid-cols-5`, 3/2 split)** ✅ | Stable column ratio that doesn't shrink under content; trivial responsive collapse with `grid-cols-1` on mobile; widely understood. | Slightly less common than `flex` for two-column heroes. |
| B. Flexbox (`flex` + `basis-3/5` / `basis-2/5`) | Familiar; works fine. | More awkward to reverse/stack on mobile; ratio can drift under intrinsic content widths. |

**Recommendation: A.** Grid is what every other hero in the codebase will use; consistency wins.

### 5. Code-chip behavior: static vs. typewriter animation

| Option | Pros | Cons |
|---|---|---|
| **A. Static text** ✅ | Issue spec says "static"; renders instantly; no motion debt; predictable for screen readers. | Less "alive" than a typewriter. |
| B. Typewriter / type-in on viewport enter | Eye-catching first time. | Feels hokey on subsequent visits; a11y problem (text streams in, screen readers re-announce); spec rules it out. |

**Recommendation: A.** Honor the spec. The drift on the blobs already provides motion; the code chip is the still point.

### 6. CTA semantics — `<a>` vs. `<button>`

| Option | Pros | Cons |
|---|---|---|
| **A. `<a href="#">`** ✅ | Acts like a link (right-click works, ⌘-click works); spec says no-op `#`; matches what these CTAs *will* be in production (sign-up + contact pages). | Need to suppress page jump on click. |
| B. `<button type="button">` | Cleaner semantics for "no-op". | Becomes the wrong element when these go live; would need refactor. |

**Recommendation: A**, with `onClick={(e) => e.preventDefault()}` to suppress the `#` jump until real routes exist.

### 7. Background gradient — Tailwind utility vs. SVG vs. CSS variable

| Option | Pros | Cons |
|---|---|---|
| **A. Tailwind `bg-[radial-gradient(...)]` arbitrary value** ✅ | One line; lives with the section; uses `primary-50` token; survives dark-mode flip if we ever add one (keeps it on the `<section>` element only). | Slightly verbose. |
| B. Inline SVG noise/gradient | More texture options. | Overkill for a flat radial; Designer hasn't asked for noise. |
| C. Global CSS variable in `globals.css` | Reusable across page sections. | Premature — only the hero needs it right now. |

**Recommendation: A.** Wait for a second section to need the same gradient before promoting it.

## Open questions for Designer

Designer owns `app/design/relay/hero-design.md` next. They should resolve:

1. **Blob geometry**: exact diameters (in px or `%`), positions (top/left offsets), z-stack order, opacities, and which token feeds which blob. Spec lists `primary-300`, `primary-500`, `ink-200` — confirm the assignment and any blend modes.
2. **Drift timings**: amplitude (e.g. `±20px` x, `±30px` y, scale `0.95–1.05`?) and durations (issue suggests 9/11/13s — confirm or adjust). Easing: `ease-out-soft` or `linear` for an ambient feel?
3. **Code chip**: dimensions, padding, border, background fill (white? frosted blur over the blobs?), corner radius, exact placement on the stage (top-right? bottom-left?), and whether it has a faux window-chrome (traffic lights) or just the code line.
4. **Badge** styling: is it a pill with white background + `shadow-card`, or a soft `primary-50` fill? Pulse-dot color (`primary-500`?) and animation — pure CSS pulse vs. framer.
5. **Type ramp under `display-xl`**: the headline uses `display-xl` (3.75rem). Confirm it ramps down to `display-lg` (3rem) at `< lg` and `display-md` (2.25rem) at `< sm` — or specify your own scale.
6. **Subhead** treatment: line-height, letter-spacing, max-width.
7. **CTA spacing & sizing**: button height, horizontal padding, gap between primary and secondary, hover-state specifics (the spec says `shadow-cta` and a translating arrow — confirm exact translate distance and easing).
8. **Vertical rhythm in the left column**: gap from badge → headline → subhead → CTA pair.
9. **Mobile order**: when stacked, does the visual sit above the headline (typical), below the CTAs (spec implies this), or get hidden entirely below `sm`? Recommend below CTAs to keep the message above the fold on small phones.
10. **Focus ring** color (per Engineering Standards we want a visible one): default `ring-primary-300` is fine — confirm or override.

## Open questions for Copywriter

Copywriter delivers `app/content/relay/hero.ts` exporting `heroContent`. Required keys:

| Key | Rules | Notes |
|---|---|---|
| `eyebrow` | ≤ 6 words; brand-voice; no exclamation marks. | Spec proposed "Now in public beta" — confirm or replace. |
| `headline` | **≤ 12 words**, complete sentence, original (NOT a paraphrase of Twilio's "The platform for conversations in the AI era"). Brand voice: confident, technical, energetic. | This is the page's single most-read line. Should communicate Relay's category (developer messaging platform / multi-channel API) without using forbidden words: *powerful, next-gen, seamless, robust, cutting-edge, leverage, unlock, supercharge, blazing-fast, world-class, revolutionize, game-changing*. |
| `subhead` | One sentence, ≤ 24 words. Sets up the "what / for whom". Audience is senior engineers + CTOs. | |
| `primaryCta` | 2–4 words; action verb. | Spec is "Start for free" — keep unless Copywriter has a stronger original. |
| `secondaryCta` | 2–4 words. | Spec is "Talk to sales". |
| `codeChipText` | A short, plausible Relay SDK call. ≤ ~32 chars on one line. | Spec: `relay.send({ to: '+1…' })`. Copywriter may pick a better-feeling call (e.g. `relay.sms.send({...})`) so long as it stays under one line and reads as "obvious dev API." |

**Voice anchors for Copywriter** (re-stating from Project Context for convenience):
- Confident, technical, energetic. Never marketing fluff.
- Headlines ≤ 12 words; CTAs 2–4 words; sentences ≤ 24 words.
- No exclamation marks. Em dashes are fine.

## Out of scope

- The TopNav above the hero (separate issue / section).
- Any scroll-linked transitions handing off to the next section (that's a global concern, owned by whichever issue introduces GSAP + Lenis-driven cross-section motion).
- Dark mode of the hero.
- Internationalization of headline/CTA strings.

## Handoff

Designer is next. After Designer publishes `hero-design.md`, Copywriter writes `hero.ts`. Engineer then implements `components/relay/Hero.tsx` against both specs. Reviewer + Security + Operator follow.
