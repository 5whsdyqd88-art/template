# LogoWall — Architect spec (SAN-12)

## Purpose

Establish credibility immediately under the hero with a single-row trust strip: a quiet eyebrow label sitting above seven monochrome placeholder wordmarks. Visual rhythm is "calm, low-saturation, breathing room"; it is the first non-hero surface a visitor lands on, so it must read as a moment of pause rather than a second hero.

## Composition

Single component file: `components/relay/LogoWall.tsx`.

> **Path note.** The Project Context table lists `app/components/relay/<Name>.tsx`, but the repo's actual `tsconfig` paths and `app/page.tsx` imports resolve `@/components/relay/*` to a top-level `components/` folder (see `app/page.tsx:1-9`, existing footer ADR §Composition). Every shipped section lives under `components/relay/`. We follow the repo, not the table — flagging here so the Designer and Engineer don't drift.

The file exports one default React component. Internal structure (all inline in the same file, no extra component files):

- `<LogoWall>` — root `<section>` with `py-16`, white background, centered container.
  - `<Label>` — small uppercase eyebrow, centered, `ink-500`-tone.
  - `<WordmarkRow>` — flex row of seven `<Wordmark>` `<span>` elements; wraps on mobile.
- `<Wordmark>` — inline `<span>` with mixed Tailwind weight/tracking classes; no icon, no anchor.

Content module: `content/relay/logo-wall.ts` — owned by Copywriter. Exports a typed `logoWallContent` with the eyebrow string and the seven wordmark labels (plus per-wordmark style hints; see D3). The component imports a single object:

```ts
import { logoWallContent } from "@/content/relay/logo-wall";
```

The component contains zero string literals beyond aria-labels and (if marquee variant is rejected) no inline strings at all.

Data flow: top-down, static. Content module → component → JSX. No props, no hooks for data, no fetch, no client state beyond the reduced-motion gate.

## State / data dependencies

Static. The only runtime concerns are:

- One `useReducedMotion()` (framer-motion) read for the entrance animation gate. This forces `"use client"` at the top of the file.
- No localStorage, no theming, no i18n, no route awareness, no IntersectionObserver beyond what framer-motion's `whileInView` already wraps.

The seven wordmark labels and the eyebrow live entirely in `content/relay/logo-wall.ts`. The component is otherwise prop-less and renders identically on every visit.

## Interactions

- **Hover on wordmark**: text color transitions from `ink-400` → `ink-700`. No scale, no underline, no lift. Designer locks duration; default `transition-colors duration-fast`.
- **Focus**: wordmarks are *not* interactive (decorative; see D4). No focus ring, no tabindex.
- **Entrance**: when the section enters the viewport, the row fades and lifts in. `whileInView` once, gated by `useReducedMotion()`. Designer specs distance/duration/stagger.
- **Click**: none. The wordmarks are not links.
- **No scroll-linked motion** (no GSAP / ScrollTrigger). Framer-motion `whileInView` is the right fit for a one-shot reveal. The page already burns its scroll-link motion budget on Hero and Features.
- **Marquee**: rejected as the default — see D2. If product later wants motion, revisit.

## Decisions

### D1. Server component vs. client component

- **Option A** — keep `LogoWall.tsx` as a server component; no JS ships for static markup.
- **Option B** — mark `"use client"`; lets us use framer-motion's `whileInView` and `useReducedMotion()`.
- **Recommendation: B.** The issue explicitly mandates framer-motion entrance with reduced-motion respect. Cost is a few KB of JS for a one-shot reveal; the LogoWall is above-the-fold-or-just-below it on most viewports, but it is also small (one row), so the bundle hit is negligible. Splitting static markup from the motion wrapper into two files would fragment a 60-line component for no win.

### D2. Static centered row vs. horizontal marquee

- **Option A** — static centered row, all seven wordmarks visible at once on desktop, wrap-allowed on mobile.
- **Option B** — slow horizontal marquee, hover-pause; keeps the row alive even with a small set of logos.
- **Option C** — duplicated infinite marquee à la "trusted by" strips on dev-tool sites (looped via translate keyframe).
- **Recommendation: A.** Three reasons: (1) the page already has GSAP-flavored scroll-linked motion budgeted for Hero, Features, and CodeMockup — adding a marquee here makes the upper third feel busy; (2) seven wordmarks fit comfortably across `max-w-6xl` on desktop, so a marquee solves a problem we don't have; (3) the issue's own spec says "Optional: very slow horizontal marquee on hover-pause; static is fine" — when the spec calls a feature optional and the rest of the page leans calm, omit. If Designer wants gentle drift later, a 60s linear translate is one CSS keyframe away.

### D3. Inline wordmark constants vs. content module

- **Option A** — hard-code the seven label strings inline in `LogoWall.tsx`.
- **Option B** — export `logoWallContent` from `content/relay/logo-wall.ts` (Copywriter owns).
- **Recommendation: B.** Project Context mandates copy in content modules. The eyebrow string is real copy ("Trusted by teams shipping every day" or whatever Copywriter lands on); the wordmarks are brand-name strings, which still count as copy even though they're invented placeholders. Keeping them in the content module means Copywriter can swap any of the seven without touching the component. Shape:

  ```ts
  export const logoWallContent = {
    eyebrow: "...",                // single line, uppercase rendering decided in component
    wordmarks: [
      { label: "Norther",     weightHint: "semibold" },
      { label: "Mira",        weightHint: "light",      trackingHint: "wider" },
      { label: "Beacon",      weightHint: "medium" },
      { label: "Pylon",       weightHint: "bold",       trackingHint: "tight" },
      { label: "Arcade",      weightHint: "regular",    italic: true },
      { label: "Jove",        weightHint: "semibold",   trackingHint: "widest" },
      { label: "Hummingbird", weightHint: "light",      mono: true },
    ],
  } as const;
  ```

  The shape is a *suggestion* — Copywriter confirms the seven labels (default to the issue's list: Norther, Mira, Beacon, Pylon, Arcade, Jove, Hummingbird), and Designer locks the per-wordmark style hints (D5). The component maps `weightHint` / `trackingHint` / `italic` / `mono` to fixed Tailwind classes via a small lookup; no dynamic class concatenation that defeats Tailwind's JIT.

### D4. `<span>` vs. `<a>` for each wordmark

- **Option A** — `<span>`. Decorative-only; not focusable; no tab order.
- **Option B** — `<a href="#">`. Matches Footer's no-op-link pattern and gives keyboard reachability.
- **Recommendation: A.** These are placeholder wordmarks for fake companies, not real customer links. Making them anchors implies "click to learn more about $brand" and creates dead nav. They should announce as decorative text. If Designer flags screen-reader awkwardness ("seven wordmarks read out as 'Norther Mira Beacon...'"), wrap the row in `<div role="list">` and each in `role="listitem"`, with the parent labelled by the eyebrow via `aria-labelledby`. Better: an `<ul aria-label="Customer logos">` wrapping `<li>` elements that each contain a `<span>`. See open question Q5 for Designer.

### D5. Per-wordmark visual variation strategy

- The issue says "wordmarks rendered as simple `<span>` with mixed font-weights/letter-spacing to suggest variety."
- **Option A** — let Designer choose seven distinct combinations of weight / tracking / italic, all using `font-sans` (Inter).
- **Option B** — Option A *plus* allow exactly one wordmark to use `font-mono` (JetBrains Mono) as a single accent that nods to the developer audience.
- **Option C** — full freedom: any of the seven can be mono; varied case (lowercase / Title Case / ALL CAPS).
- **Recommendation: B.** Option C produces a circus row that fights the "calm pause" intent. Option A leans too uniform — every wordmark is Inter and the eye groups them as one block. Option B gives the row a single texture-break (one mono wordmark) that re-reads as "we know our audience codes" without becoming a typographic sample sheet. Designer locks which wordmark gets the mono treatment; Architect's bias is the last one ("Hummingbird") because mono on a long word reads more legibly than mono on "Jove". Mixed case is rejected: keep all seven Title Case or all UPPERCASE, Designer's call (Q3).

### D6. Mobile wrap strategy

- **Option A** — `flex-wrap` with row gap and column gap; wordmarks reflow into 2–3 rows on narrow viewports.
- **Option B** — horizontal `overflow-x-auto` with `scroll-snap-x mandatory`; user swipes to see the rest.
- **Option C** — fewer wordmarks on mobile (hide the last 3 with `hidden sm:inline`).
- **Recommendation: A.** The issue's acceptance criteria say "no overflow on mobile (wrap allowed)." A is the literal reading. B introduces interaction the user didn't ask for; C drops content silently and breaks the "seven wordmarks" contract. Designer locks the gap (likely `gap-x-8 gap-y-6` or thereabouts) and the breakpoint at which the row is comfortably one line again.

### D7. Hover behavior

- Issue says: `ink-400` resting, `ink-700` on hover.
- **Option A** — color-only transition, no transform.
- **Option B** — color + tiny `scale-[1.02]` lift.
- **Option C** — color + soft drop-shadow on hover.
- **Recommendation: A.** The wordmarks are not interactive (D4). Adding scale or shadow on hover signals affordance the user can't act on. Color-only is the cheapest, calmest, most accessible cue and matches the muted intent. `transition-colors duration-fast` (`150ms` per token) under `ease-out-soft`.

### D8. Section background and dividers

- Issue says white background, `py-16`, no border mentioned.
- The current placeholder `LogoWall.tsx` has `border-b border-ink-100` — that comes from the scaffold-stage divider helper, not a real design choice.
- **Option A** — pure white, no border. Hero ends, LogoWall opens, Features begins; let the surrounding sections own their own boundaries.
- **Option B** — keep a top + bottom `border-ink-100` to bracket the strip.
- **Option C** — top border only (separates from Hero), no bottom (lets Features sweep up).
- **Recommendation: A.** The reference's analogous "calm strip beneath hero" relies on whitespace and tonal contrast, not lines. A border re-introduces visual weight that the eyebrow + light wordmarks are deliberately avoiding. If Designer wants separation, an extra `pt-20` on the next section is the right knob. Engineer should remove the placeholder's `border-b` when wiring up.

### D9. Entrance animation pattern

- **Option A** — one `<motion.div>` wrapping the whole section with one fade-up (eyebrow + row reveal together).
- **Option B** — staggered: eyebrow fades first, then the row of wordmarks reveals together, then... that's it.
- **Option C** — staggered: eyebrow fades first, then *each wordmark* reveals one after the other with a 50–80 ms stagger.
- **Recommendation: B.** Option A is fine but flat — the eyebrow and row appear identically and the eyebrow loses its "label sets up the row" framing. Option C is too theatrical for a quiet trust strip; one-by-one wordmark reveals make the row feel like a feature when it should feel like furniture. Option B (label first, row second) keeps the hierarchy that *the reader* perceives — "what am I looking at? trusted by teams. ah, these teams." — without showboating. framer-motion variants on a parent + two children is the minimum-viable pattern. Designer locks distance (`y: 8`–`y: 16`), duration (~`400ms`), and the inter-stage delay (~`120ms`). Reduced-motion gate skips the transform entirely.

### D10. Eyebrow rendering: literal uppercase string vs. CSS uppercase

- The issue says "text-sm uppercase tracking-widest." Copywriter writes the eyebrow as a normal-case sentence; the component applies `uppercase` via Tailwind.
- **Option A** — `className="uppercase tracking-widest"`, content stays sentence-case in the content module. Easy to read and edit.
- **Option B** — Copywriter writes the string already uppercased in the content module.
- **Recommendation: A.** Content modules should hold human-readable copy. Letting CSS do the casing means a future redesign that switches to small-caps or sentence-case is a single class swap. Screen readers also tend to mis-pronounce ALL-CAPS strings as initialisms.

### D11. Where does the LogoWall end and the next section begin?

- Out of scope for this ticket — the section ends at its own `</section>`. But the Designer's spec should confirm the visual rhythm assumption: Hero ends with its own padding, LogoWall has `py-16` of its own (~64 px), Features starts with its own top padding. Three additive paddings can compound into too much air. Designer should verify against the as-built Hero and the Features design once both exist; if it feels too airy, Architect's bias is to *trim Features' top padding*, not LogoWall's.

## Open questions for Designer

1. **Container max-width** — issue says `max-w-6xl`. Confirm this matches the rest of the page's content max-width (Hero, Features, etc., are likely `max-w-6xl` or `max-w-7xl`; lock once and reuse). Outside scope for the eyebrow which can stay narrower.
2. **Vertical padding** — issue says `py-16`. Confirm or adjust to maintain the rhythm vs. Hero's bottom padding and Features' top padding. Watch for compounding air (D11).
3. **Eyebrow typography** — exact size (`text-xs` vs `text-sm`), weight (regular? medium?), tracking (`tracking-widest` vs `tracking-[0.2em]`), color (`ink-500` per issue, or `ink-400`?), and gap below the eyebrow before the wordmark row.
4. **Wordmark base style** — base size (`text-lg`? `text-xl`? `text-2xl`?), base weight before the per-wordmark hint kicks in, exact color tokens at rest (`ink-400` per issue) and hover (`ink-700` per issue).
5. **Per-wordmark style assignment** — finalise the seven `(weight, tracking, italic?, mono?)` tuples. Architect's seed in D3 is a starting point, not a spec. Lock which one wordmark gets the single mono accent (D5).
6. **Wordmark casing** — Title Case (Norther, Mira, ...) vs UPPERCASE (NORTHER, MIRA, ...). Architect's bias: Title Case, because uppercase competes with the eyebrow's tracking-widest treatment.
7. **Row gap** — desktop column gap between wordmarks (`gap-x-8`? `gap-x-12`? `gap-x-16`?) and the breakpoint at which the row is one line.
8. **Wrap rhythm on mobile** — tablet (md): one row or wrapped? phone (base): wrapped how? 2 + 2 + 3? 4 + 3? 7 wordmarks across two rows of 3+4 has visual asymmetry that may read as broken.
9. **Hover transition** — duration (token `fast`/`base`), easing (`ease-out-soft` recommended).
10. **Entrance animation specifics** — distance (`y: 8`/`12`/`16`), duration, ease, eyebrow→row delay, reduced-motion fallback (skip motion entirely vs. fade only).
11. **Accessibility roles** — confirm the `<ul aria-label="Customer logos">` + `<li>` structure (D4) or propose a better screen-reader treatment.
12. **Reference image mismatch** — the issue cites `refs/twilio/scroll_01.png` ("logo strip beneath hero"), but `scroll_01.png` shows the hero itself, and **the captured Twilio scrolls do not contain a customer-logo wall at this position** (closest analog is the language-icon strip in `scroll_10.png`, which is a code-language tab, not customer logos). LogoWall is effectively a Relay-original section without a direct reference to clone. Designer should decide: invent the visual rhythm from first principles using the issue's constraints, or look at a separate dev-platform site (Vercel, Linear, Stripe trust strips) for layout cues. Architect's bias: first principles — the issue's constraints are sufficient.

## Open questions for Copywriter

1. **Eyebrow string** — issue suggests "Trusted by teams shipping every day." Confirm or adjust within Relay voice rules: ≤12 words, no forbidden words, no exclamation. Sentence case in the content module; component applies `uppercase` (D10). Variants worth considering: "Teams that ship every day rely on Relay" (longer), "Built by teams that ship daily" (shorter), "In production at companies you've heard of, and seven you haven't" (cheekier — likely too long but interesting tonally).
2. **Wordmark labels** — issue's seven names: Norther, Mira, Beacon, Pylon, Arcade, Jove, Hummingbird. Confirm none collide with real, identifiable companies in the Relay audience's space (Pylon and Beacon both have real-world dev-tool counterparts; Architect raises this as a flag, Copywriter / a quick search settles it). If any need swapping, replacement names should follow the issue's pattern: short, evocative, vaguely industrial or astronomical, never a real company.
3. **Aria-label for the list wrapper** — likely "Customer logos" or "Companies using Relay". Short, descriptive, not marketing copy.
4. **No CTA, no microcopy below the row** — the issue does not include either. Confirm we are not adding a "See customer stories →" link beneath the wall.

## Out of scope

- A real customer logo wall (these are placeholders; replacing with real customer SVGs is a future PR with brand approval).
- Per-wordmark links to case studies.
- Marquee / drift / scroll-linked motion (D2).
- A "View all customers" CTA below the row.
- Localisation of wordmark labels (these are brand names; they don't translate).
- Theming variants (dark-mode LogoWall would need a separate ink-token mapping; out of scope for this ticket).

## Handoff

Designer: own visual decisions Q1–Q12. Produce `app/design/relay/logo-wall-design.md`. Then Copywriter: own Q1–Q4, produce `content/relay/logo-wall.ts`. Then Engineer: implement `components/relay/LogoWall.tsx`, replacing the existing 7-line placeholder.
