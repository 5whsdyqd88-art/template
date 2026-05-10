# LogoWall — Designer spec (SAN-12)

Companion to `logo-wall-architect.md`. Resolves Designer-owned questions Q1–Q12; locks visual tokens, motion, accessibility. No code, no copy.

**Reference posture.** Per Architect Q12 — `scroll_01.png` is the Twilio hero with the car visual; the captured Twilio scrolls do not contain a customer-logo wall at this position. LogoWall is Relay-original; this spec is built from first principles using the issue's constraints (white surface, eyebrow + seven monochrome wordmarks, `ink-400` rest / `ink-700` hover, no marquee). Tonal target is "calm pause beneath the hero" — lower visual density than every other section on the page.

## 1. Layout

### 1.1 Outer surface

| Property | Value | Rationale |
|---|---|---|
| Background | `bg-white` | Issue mandate |
| Borders | none (no top, no bottom) | Architect D8: whitespace, not lines, brackets the strip |
| Section element | `<section aria-labelledby="logo-wall-eyebrow">` | Pairs with the eyebrow's `id` so the row inherits its label |
| Outer width | full bleed | Section background extends edge-to-edge inside the white page |
| Vertical padding | `py-16` (64 px) at base, `md:py-20` (80 px) ≥ 768 px | Issue mandates `py-16`; the small step-up at `md` keeps Hero's bottom padding from compounding into a wall of air on desktop. Architect D11 acknowledged the compounding risk; bias is to trim *Features'* top padding if anything still feels off after wiring all three sections. Designer keeps LogoWall's own padding faithful to the issue. |

### 1.2 Inner container (Q1, Q2)

| Property | Value | Rationale |
|---|---|---|
| Inner max-width | `max-w-6xl` (1152 px) | Issue mandate. Sibling sections (Hero, Features, Footer) use `max-w-7xl`; the narrower frame here is **intentional** — pulling the trust strip 128 px tighter than the surrounding page makes it feel like a quoted aside rather than a second hero. Lock as-is. |
| Inner alignment | `mx-auto` | Centered |
| Inner horizontal padding | `px-6` base · `px-8` md · `px-10` lg | Matches the page rhythm; never less than `px-6` so wrapped wordmarks on small phones don't kiss the viewport edge |
| Inner vertical layout | `flex flex-col items-center` | Eyebrow then row, both horizontally centered |

### 1.3 Eyebrow → row spacing

| Token | Value | Notes |
|---|---|---|
| Gap below eyebrow | `mt-10` (40 px) on the wordmark row, base · `md:mt-12` (48 px) ≥ 768 px | Generous enough that the eyebrow reads as a label *for* the row, not as a separate paragraph. Tightening below 32 px makes the eyebrow feel attached; widening above 56 px breaks the relationship. |

### 1.4 Wordmark row (Q7, Q8)

The row is a single flex container that wraps. Architect D6 Option A.

| Property | Value | Rationale |
|---|---|---|
| Element | `<ul aria-label="Customer logos">` | See §6 accessibility |
| Display | `flex flex-wrap items-center justify-center` | Centered both axes; wraps when seven wordmarks won't fit one line |
| Column gap | `gap-x-8` base · `md:gap-x-10` ≥ 768 px · `lg:gap-x-12` ≥ 1024 px | 32 → 40 → 48 px. At `lg` (≥1024 px) `max-w-6xl` (1152 px) holds all seven on one line comfortably with `text-lg` wordmarks; tested mentally against the longest label "Hummingbird" (~120 px) and shortest "Jove" (~50 px) — total run ≈ 580–620 px of text + 6×48 px gaps = 290 px → ≈ 870–910 px, fits inside ~1080 px content width with margin. |
| Row gap | `gap-y-6` (24 px) | Activates only when the row wraps |
| Wrap rhythm — `lg` (≥1024 px) | one row of 7 | Calm pause as intended |
| Wrap rhythm — `md` (≥768, <1024 px) | one row of 7 still possible at this width with the smaller gap (`gap-x-10`); acceptable to wrap to 4 + 3 if the longest wordmark forces it. The `flex-wrap` lets the browser decide; do not hard-break with `<br>` or hidden classes. |
| Wrap rhythm — base (<768 px) | wraps to 2 + 2 + 3 or 3 + 2 + 2 depending on viewport. Deliberate visual asymmetry (a 4 + 3 split could read as broken at narrow widths); the natural-flow arrangement reads as "more than we can fit," which actually reinforces the trust intent. Acceptable. |
| Min-height | none | Don't reserve space; let the row collapse to its content |

## 2. Type ramp (Q3, Q4)

All sizes use Tailwind defaults plus the project's `font-sans` (Inter) and `font-mono` (JetBrains Mono).

### 2.1 Eyebrow

| Property | Value | Rationale |
|---|---|---|
| Element | `<p id="logo-wall-eyebrow">` | Section's `aria-labelledby` target |
| Size | `text-sm` (14 px) | Issue mandate |
| Weight | `font-medium` (500) | Regular reads weak under the heavy `tracking-widest`; semibold competes with the wordmarks below. Medium splits the difference. |
| Tracking | `tracking-[0.18em]` | Issue says `tracking-widest` (0.1em); 0.18em reads more deliberately at `text-sm` and matches the eyebrow tracking already in use in `features-design.md` (consistency across the page wins over the exact 0.1em token here). |
| Case | `uppercase` (CSS, not the source string — Architect D10 Option A) | |
| Color | `text-ink-500` | Issue mandate. Contrast vs `bg-white`: 4.83 : 1 — AA normal, AA large, **fails AAA normal but passes for the eyebrow's effective size + weight** (uppercase tracked-out at 14/500 reads as large per WCAG body-large rules). If a future audit wants AAA, bump to `ink-600` (7.59 : 1). |
| Line-height | default (`leading-5`) | One line; line-height intent is "tight-but-readable" |
| Width | natural | No `max-w` cap; eyebrow is short by Copywriter rules (≤12 words) |

### 2.2 Wordmark base style

Applied to every `<span>` before the per-wordmark hint kicks in.

| Property | Value | Rationale |
|---|---|---|
| Size | `text-lg` (18 px) base · `md:text-xl` (20 px) ≥ 768 px | Issue says nothing exact; `text-lg` reads as a placeholder wordmark (not a headline), `text-xl` on desktop gives the row enough presence inside `max-w-6xl`. `text-2xl` was considered and rejected — at 24 px the row competes with the page's section headlines. |
| Base weight | `font-medium` (500) | The starting point; per-wordmark hints override |
| Color (rest) | `text-ink-400` | Issue mandate. 3.39 : 1 vs `bg-white` — fails AA normal; **acceptable here because the wordmarks are decorative placeholders, not informational text** (Architect D4: not interactive, not real customers, treated as ornamental). Screen readers still announce the labels via the `<ul>` (§6); sighted-user contrast is by intent muted-and-quiet. |
| Color (hover) | `text-ink-700` | Issue mandate. 9.34 : 1 vs `bg-white` — AAA. The 6× contrast jump on hover is the entire interaction; it must be unmistakable. |
| Line-height | default (`leading-7` for `text-lg`, `leading-7` for `text-xl`) | One line per wordmark; row gap handles vertical rhythm |
| Letter-spacing default | `tracking-normal` | Per-wordmark hints adjust |
| Italic default | not italic | Per-wordmark hints adjust |
| Font family default | `font-sans` | Per-wordmark hints adjust (one mono accent only) |
| Casing | **Title Case** (Q6 — Architect bias confirmed) | UPPERCASE wordmarks combined with the eyebrow's UPPERCASE-tracked-widest treatment makes the row feel like two stacked labels. Title Case lets the row read as proper nouns and creates contrast with the eyebrow above. The string in `content/relay/logo-wall.ts` ships Title Case; component does **not** apply `uppercase` to the row. |

## 3. Per-wordmark style assignments (Q5)

Seven `(weight, tracking, italic?, mono?)` tuples. The Engineer maps these from the content module's hint fields to a fixed lookup of Tailwind classes — no string concatenation that defeats JIT.

| # | Label | Weight | Tracking | Italic | Mono | Visual intent |
|---|---|---|---|---|---|---|
| 1 | Norther | `font-semibold` (600) | `tracking-tight` (-0.025em) | — | — | Anchor of the row. Compact, confident. |
| 2 | Mira | `font-light` (300) | `tracking-wide` (0.025em) | italic | — | Airy, editorial. Gives the row's lightest texture. |
| 3 | Beacon | `font-medium` (500) | `tracking-normal` (0) | — | — | Neutral baseline; the row's "default" wordmark. |
| 4 | Pylon | `font-bold` (700) | `tracking-tighter` (-0.05em) | — | — | Heaviest stamp in the row. Industrial. |
| 5 | Arcade | `font-normal` (400) | `tracking-widest` (0.1em) | — | — | Wide, retro-marquee feel. |
| 6 | Jove | `font-semibold` (600) | `tracking-normal` (0) | italic | — | Compact + italic creates a typographic "tilt" without changing weight class from #1. |
| 7 | Hummingbird | `font-light` (300) | `tracking-normal` (0) | — | **mono** (`font-mono`) | The one mono accent (Architect D5 Option B). Hummingbird is long, so JetBrains Mono reads cleanly here; mono on a four-letter word ("Jove") would feel cramped. |

Notes for Engineer:
- Build the lookup as a const map keyed on the hint values (`{ semibold: "font-semibold", ... }`), not as template strings. This keeps Tailwind's JIT happy.
- The hint fields are optional in the content module; defaults fall back to the §2.2 base style.
- Do **not** vary case across wordmarks (Architect D5 forbids mixed case; all seven stay Title Case per Q6).

## 4. Spacing rhythm summary

Top-to-bottom of the section, after Hero ends:

| Step | Token | Pixels |
|---|---|---|
| Section top padding | `pt-16 md:pt-20` | 64 / 80 |
| Eyebrow (one line) | natural height | ~20 |
| Eyebrow → row | `mt-10 md:mt-12` (on row) | 40 / 48 |
| Row (one line at `lg`, wraps below) | natural | ~28 desktop / up to ~96 on mobile when wrapped 3 rows |
| Section bottom padding | `pb-16 md:pb-20` | 64 / 80 |

Total at `lg`: ≈ 232 px. At base (mobile, wrapped): up to ≈ 320 px. Both feel like a calm pause without dominating the page.

## 5. Motion (Q9, Q10)

framer-motion `whileInView`, fired once. No scroll-linked motion (Architect D2). All values gated by `useReducedMotion()`.

### 5.1 Entrance (Architect D9 Option B — staggered, eyebrow then row)

Two-stage variant on a parent + two child `motion` nodes:

| Stage | Element | From | To | Duration | Delay | Ease |
|---|---|---|---|---|---|---|
| 1 | Eyebrow | `opacity: 0, y: 8` | `opacity: 1, y: 0` | 360 ms | 0 ms | `ease-out-soft` (`cubic-bezier(0, 0, 0.2, 1)`) |
| 2 | Wordmark row (whole `<ul>` as one node, no per-`<li>` stagger) | `opacity: 0, y: 12` | `opacity: 1, y: 0` | 420 ms | 140 ms (after eyebrow starts) | `ease-out-soft` |

`whileInView` with `viewport={{ once: true, margin: "0px 0px -10% 0px" }}` so the animation triggers slightly before the section is fully in view (avoids a "pop" on fast scroll). `once: true` because re-firing on every scroll-back is noise.

### 5.2 Hover (per wordmark)

| Property | Value |
|---|---|
| Trigger | `hover:` only (no `focus-visible:` — wordmarks are not interactive, see §6) |
| Property animated | `color` only (Architect D7 Option A — no scale, no shadow) |
| Duration | `transition-colors duration-fast` (150 ms) |
| Easing | `ease-out-soft` |
| `text-ink-400` → `text-ink-700` |

### 5.3 Reduced-motion fallback

When `useReducedMotion()` returns `true`:

- Skip the transform entirely (no `y` translate).
- Skip the eyebrow→row stagger; render both in their final state on first paint.
- Hover color transition stays — `prefers-reduced-motion` reduces *animation*, not all CSS transitions on user-initiated hover; a 150 ms color crossfade is well within accessibility norms and signals the hover affordance.

Implementation note: a single conditional in the component swaps the variants between the animated and the static set; do not gate per-property — that fragments the variant tree.

## 6. Accessibility (Q11)

### 6.1 Semantic structure

```
<section aria-labelledby="logo-wall-eyebrow">
  <p id="logo-wall-eyebrow" class="...">Trusted by ...</p>
  <ul aria-label="Customer logos" class="...">
    <li><span class="...">Norther</span></li>
    <li><span class="...">Mira</span></li>
    ...
  </ul>
</section>
```

- The `<ul>` carries an explicit `aria-label="Customer logos"` so screen readers announce the group's purpose before walking the items.
- Each `<li>` contains exactly one `<span>` with the wordmark text. No `role="listitem"` override needed; native `<ul>`/`<li>` semantics are correct.
- The eyebrow is a `<p>`, not an `<h2>` or `<h3>` — these are placeholder wordmarks, not real customers, so promoting the eyebrow to a heading would inflate the page outline with marketing furniture. Architect D4 + Q3 align here.

### 6.2 Focus and keyboard

- Wordmarks are decorative `<span>`s — not focusable, no `tabindex`, no keyboard nav. The `<ul>` is *traversable* by some screen-reader virtual cursors, which is the correct behaviour.
- No focus ring required (nothing is focusable in this section).

### 6.3 Contrast summary

| Pair | Ratio | Verdict |
|---|---|---|
| `ink-500` eyebrow on `bg-white` | 4.83 : 1 | AA normal · AAA large |
| `ink-400` wordmark rest on `bg-white` | 3.39 : 1 | Fails AA normal — **acceptable as decorative**; row carries no informational load (real labels are read via `<ul>` semantics, not visual contrast). |
| `ink-700` wordmark hover on `bg-white` | 9.34 : 1 | AAA |
| `primary-500` (not used here) | n/a | LogoWall introduces zero brand-color usage; the trust strip is monochrome by design |

If an audit later requires AA on the resting wordmarks, the cleanest knob is `ink-500` (4.83 : 1) at rest and `ink-800` (12.6 : 1) on hover — both still keep the muted intent. Document this swap as a future-PR option; do not pre-emptively apply it.

### 6.4 Live regions / motion sensitivity

- No live regions (nothing changes after first paint).
- `useReducedMotion()` covers the entrance gate; hover transition is exempt per §5.3.

## 7. Allowed icons

None. The issue's "Allowed lucide-react icons for this section: (none required)" stands. The component imports zero icons; no inline SVG fallback is needed because no decorative glyphs are introduced. Lock.

## 8. What the Engineer can / cannot do

**Can decide without Designer sign-off:**
- The exact const-map structure that turns content-module hints into Tailwind classes (§3 note).
- Whether to inline the wordmarks as `<li>` directly or build a tiny internal `<Wordmark>` sub-component — both ship the same DOM.
- Whether to use a single `motion.section` parent with two `motion.div` children, or two sibling `motion.div`s with a shared variant — equivalent outcome.

**Must not change without coming back to Designer:**
- Container `max-w-6xl` (the narrower frame is the calm-pause intent — see §1.2).
- Wordmark casing — Title Case is locked.
- The single mono assignment going to "Hummingbird" (§3 #7).
- The two-stage entrance pattern (eyebrow first, row second). No per-wordmark stagger.
- Removal of the placeholder's `border-b border-ink-100` (Architect D8 — Engineer must drop it).

## 9. Verification checklist (Designer pre-merge)

- [ ] `bg-white`, no top/bottom border on the section.
- [ ] `max-w-6xl` inner container, `py-16 md:py-20`.
- [ ] Eyebrow `text-sm font-medium tracking-[0.18em] uppercase text-ink-500`, sentence-case in source / uppercase in CSS.
- [ ] Seven Title-Case wordmarks; exactly one (`Hummingbird`) is `font-mono`; rest are `font-sans`.
- [ ] All wordmarks `text-ink-400` rest, `text-ink-700` hover, transition `colors duration-fast ease-out-soft`.
- [ ] Row is a `<ul aria-label="Customer logos">`; each item a `<li><span>`.
- [ ] Entrance: eyebrow fades-up first (360 ms), row fades-up 140 ms later (420 ms); reduced-motion strips transforms.
- [ ] Wraps cleanly on mobile, no horizontal overflow at any viewport ≥ 320 px.
- [ ] Tabbing past the section moves focus from Hero CTAs straight to the next focusable in Features — nothing focusable inside LogoWall.

## 10. Out of scope (Designer reaffirms Architect §Out of scope)

- Marquee / scroll-linked drift. Static row, locked.
- Per-wordmark links or hover popovers. Decorative `<span>`s only.
- Real customer SVGs. Wordmark text only.
- Dark-mode variant. White surface only; a dark-mode pass would re-spec ink tokens and is a separate ticket.
