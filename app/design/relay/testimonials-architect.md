# Testimonials — Architect Spec

Issue: [SAN-16](mention://issue/bc56fe4f-6a1c-49e5-9dfb-c94bbb21cbb9) — Testimonials (3 quote cards)

## Purpose

Provide social proof in the bottom third of the page (between `Stats` and `CTA`) by showing three short, attributed quotes from invented Relay customers. Reinforces the "built by teams who ship" angle and gives the visitor a recognisable shape (cards with avatar + name + role + company) before the final CTA.

## Placement

`app/page.tsx` already imports `Testimonials` and renders it as the sixth section in `<main>`, after `Stats` and before `CTA`. No routing changes are needed.

## Composition

One file: `components/relay/Testimonials.tsx` (root-level `components/`, matching the rest of the relay set — the project context document still references `app/components/...` but the repo has settled on `components/relay/...`; keep the existing convention).

Internal composition:

- `Testimonials` (default export) — section wrapper, eyebrow + heading block, grid of three cards, entrance animation orchestration.
- `QuoteCard` — inline subcomponent in the same file. Props: `quote`, `name`, `role`, `company`, `initials`, optional `index` for stagger delay.

Avatar is rendered inline inside `QuoteCard` from a derived `initials` string. No separate `Avatar` component — there is one shape, used in one place.

Content lives in a separate module: `app/content/relay/testimonials.ts`, exporting `testimonialsContent` with `eyebrow`, `headline`, and a `quotes: ReadonlyArray<{ quote, name, role, company, initials }>` field. The Engineer imports it as `import { testimonialsContent } from "@/app/content/relay/testimonials"` (or `@/content/...` depending on whether the content tree settles inside `app/`; either is fine, but pick one and stay consistent across sections — see Decision D5).

## State / Data dependencies

Static. All strings come from the content module at build time. No fetches, no client state, no slugs, no routing.

## Interactions

- **Hover (desktop):** subtle lift on each card. Spec belongs to Designer.
- **Focus:** cards are not interactive (no link, no button). The quote is read in document order; no special focus management is needed.
- **Scroll entrance:** stagger fade-up as the grid enters the viewport. One-shot animation, not scroll-linked. Use `framer-motion` `whileInView` (matches Project Context guidance: "framer-motion for fade in when it enters viewport once").
- **Reduced motion:** when `useReducedMotion()` returns `true`, render cards in their final state with no transform and no stagger. The eyebrow and heading block must also opt out.
- **Click:** none. Cards are non-interactive.

## Decisions

### D1 — Card subcomponent: inline vs separate file

- **A: Inline `QuoteCard` inside `Testimonials.tsx`.** One file to read, no import noise, three call sites all in view.
- **B: Separate `components/relay/QuoteCard.tsx`.** More "reusable" if another section ever needed it.

**Recommendation: A.** No other section in the current page set uses a quote card; introducing a separate file is speculation. If a second consumer appears, lift it then.

### D2 — Quotes data shape: object vs array

- **A: Array of three objects** with `quote`, `name`, `role`, `company`, `initials`. Engineer maps over them.
- **B: Three named exports** (`testimonial1`, `testimonial2`, …) hard-coded in JSX.

**Recommendation: A.** Mapping cleans up the JSX and lets the Copywriter reorder by editing the array. The brief explicitly says "3 cards" — that is a count, not three different shapes.

### D3 — `initials` field: derived vs stored

- **A: Store `initials` on each entry** (e.g. `"JD"`).
- **B: Derive at render time** by splitting the name on whitespace and taking the first character of each word.

**Recommendation: A.** Derivation is one line but breaks for "Maria de la Cruz" → "MdlC" or single-word handles. Storing the field is cheap, removes a defect class, and lets Copywriter pick the rendered initials directly. (Two characters expected; the Designer specifies overflow behaviour if anything else.)

### D4 — Server vs client component

- **A: Client component (`"use client"`).** Required for `framer-motion` hooks (`whileInView`, `useReducedMotion`).
- **B: Server component, with a small client wrapper around the cards.** Splits content (server) from motion (client).

**Recommendation: A.** The whole section is small (3 cards plus a heading block) and entrance animation applies to both heading and cards. Splitting saves nothing material and adds a wrapper file. Other relay sections that animate will land on the same call.

### D5 — Content module path

- **A: `app/content/relay/testimonials.ts`** — keeps content under `app/` next to other Next-aware files.
- **B: `content/relay/testimonials.ts`** — root-level, mirroring the root-level `components/relay/` decision.

**Recommendation: A** (defer to Project Context skill, which specifies `app/content/relay/...`). Components have already drifted to root-level; do not let content drift too without an explicit decision. If the team later moves components back under `app/`, the trees match.

### D6 — Grid layout

- **A: `grid-cols-1 md:grid-cols-3`.** Single stack on phones, three abreast from `md` (≥768 px).
- **B: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.** Two-up at tablet, three-up at desktop.
- **C: Horizontal scroll-snap on mobile.**

**Recommendation: A.** Three cards do not divide cleanly into two columns (one orphan); a clean stack reads better on phones than 2 + 1. Scroll-snap adds a control surface (overflow, indicators) that the brief does not call for. Designer can revisit at the breakpoint review.

### D7 — Background treatment

- **A: Flat `bg-primary-50`** across the whole section.
- **B: Vertical gradient `bg-gradient-to-b from-primary-50 to-white`** to ease the seam into the next section (CTA).

**Recommendation: defer to Designer.** Both are valid; the choice depends on the CTA section's own background. Flag this in the open questions below.

### D8 — Quote glyph

The brief allows the `Quote` lucide icon. Where it sits (top-left of card, behind the text, replacing nothing) is a visual call.

**Recommendation: defer to Designer.** Architect's only constraint: the icon is decorative — `aria-hidden="true"`, not part of the accessible quote text.

### D9 — Heading + eyebrow contract

The brief proposes eyebrow `'CUSTOMERS'` and heading `'Built by teams who ship'`. These are starting points, not architect decisions. Treat both as Copywriter slots; the brief's wording is one acceptable answer.

### D10 — Animation primitive

- **A: framer-motion variants on a parent `motion.div` with `staggerChildren`.** Container controls timing; children declare their `hidden`/`visible` states.
- **B: Per-card `whileInView` with a manual `transition.delay = index * 0.1`.** Simpler, no variants tree.

**Recommendation: A.** Variants give Designer a single tuning knob (stagger ms) and keep timing in one place. Engineer wires this once.

## Accessibility

- Render each card as a `<figure>` containing a `<blockquote>` (the quote) and a `<figcaption>` (name, role, company, avatar). The avatar's initials are decorative — the figcaption already names the speaker — so mark the avatar `aria-hidden="true"`.
- Section gets a heading (display-md) that is reachable by heading navigation.
- Colour contrast: ink-800 quote on white card is fine; ink-500 role meta on white meets AA at the size in the brief, but Designer should confirm if any tint is darker than the token.
- Motion: respect `prefers-reduced-motion` (see Interactions).

## Out of scope

- Carousel / pagination. Three is small enough to render all at once.
- "Read more" expansion — quotes are 2–3 sentences by spec.
- External fetching of quotes from a CMS.
- Logos of the fictional companies (Designer can decide if the company name is plain text or a small wordmark; the brief currently asks for plain text below the avatar).

## Open questions for Designer

1. **Background:** flat `bg-primary-50` or `primary-50 → white` gradient? Depends on what `CTA` does next.
2. **Quote glyph:** size, colour (`primary-100`/`primary-200`?), placement (top-left corner of card, behind text, above quote)?
3. **Card hover state:** lift amount (`translate-y`?), shadow upgrade (`shadow-card → shadow-cta`?), tilt or no tilt? Duration?
4. **Avatar tint:** all three `bg-primary-100` / `text-primary-700`, or rotate through tints (e.g. primary, a warm tone) per card? The brief specifies `primary-100`/`primary-700` — confirm whether to vary.
5. **Card padding rhythm:** `p-8` desktop is in the brief. What at `sm`/`md`? `p-6`?
6. **Heading block alignment:** centred (matches feel of a customers section) or left-aligned (matches Stats above)?
7. **Stagger timing:** delay between card entrances (e.g. 80 ms vs 150 ms), and total duration of fade-up.
8. **Decorative quote-mark scale:** small inline icon vs large display character behind the quote.
9. **Vertical rhythm:** section padding (`py-24`? `py-32`?) consistent with siblings, and gap between heading block and grid.
10. **Card corner radius:** brief says `rounded-2xl` — confirm at the breakpoint review that this matches `Features` cards above.

## Open questions for Copywriter

1. **Eyebrow:** the brief proposes `CUSTOMERS`. Confirm tone (uppercase tracker, primary-600 colour). Alternatives that fit the voice: `BUILDERS`, `IN PRODUCTION`, `WHO SHIPS WITH RELAY`.
2. **Headline:** the brief proposes `Built by teams who ship`. Confirm or replace. Length ≤ 12 words; no forbidden words (powerful, seamless, robust, leverage, supercharge, etc.); no exclamation marks.
3. **Three quotes:** 2–3 sentences each, original Relay voice, **never paraphrase twilio.com testimonials**. Each quote should hit a different value: e.g. one on developer ergonomics, one on reliability/scale, one on time-to-ship. Sentences ≤ 24 words. No exclamation marks.
4. **Three names:** distinct given names; vary plausibly across roles. No real public engineers.
5. **Three roles:** developer-platform-shaped (e.g. Staff Engineer, Platform Lead, VP Engineering, Head of Infra). Match the audience the project context names: senior engineers, CTOs, eng-platform leaders.
6. **Three fictional companies:** invented placeholder wordmarks. The Project Context skill suggests examples like Norther, Mira, Beacon, Pylon. Avoid any name shipped on real companies. Do not reuse the company names already invented for `LogoWall`; coordinate with whoever wrote that section.
7. **Initials:** two characters per name, in the order the Copywriter wants them rendered (e.g. for "Maya Okafor" → `MO`). Stored on the entry, not derived.
8. **Output:** TypeScript module at `app/content/relay/testimonials.ts` exporting `testimonialsContent` matching:

   ```ts
   export const testimonialsContent = {
     eyebrow: string,
     headline: string,
     quotes: ReadonlyArray<{
       quote: string;
       name: string;
       role: string;
       company: string;
       initials: string; // 2 chars
     }>,
   } as const;
   ```

## Engineer constraints (carried forward from the brief)

- Default-export TypeScript React component, no markdown fence, no commentary in the file.
- `framer-motion` for entrance animation; honour `useReducedMotion()`.
- Allowed lucide-react icon for this section: `Quote`. No others.
- Brand is **Relay**, never **Twilio**.
- Single file at `components/relay/Testimonials.tsx`. Imports content from the module above.
- Gates: `npx tsc --noEmit` and `npx next build` must both pass.
