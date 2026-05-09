# Features (3-column product grid) — Architect spec

Issue: SAN-13
Component path: `components/relay/Features.tsx`
Imported by: `app/page.tsx` (already wired)

## Purpose

Convey the breadth of the Relay platform on the landing page by showing six product capabilities as an at-a-glance grid, so a senior engineer can scan in under five seconds and recognize whether Relay covers their use case.

## Composition

One file, one default export, one client component (`"use client"` required because framer-motion hooks and `useReducedMotion` are used).

Inline subcomponent `FeatureCard` lives inside the same file — the cards are not reused elsewhere and splitting to a separate file adds an import without payoff. The six features are an inline `const FEATURES = [...] as const` array at the top of the file.

Tree:

```
<Features> (section, full-bleed background, vertical padding)
  └── <Container> (max-w + horizontal padding)
        ├── <Heading block>     (eyebrow + display headline, centered)
        └── <Grid>              (3 / 2 / 1 cols responsive)
              └── 6× <FeatureCard>
                    ├── <IconTile>
                    ├── <Title>
                    ├── <Body>
                    └── <LearnMore>  (text + ArrowRight)
```

## State / data dependencies

Static. Data is the six-item `FEATURES` constant. Each entry: `{ icon: LucideIcon, title: string, body: string, href: string }`. No fetching, no client state, no context.

Copy strings (eyebrow, headline, six titles, six bodies, learn-more microcopy) come from `app/content/relay/features.ts` exporting `featuresContent` per the Project Context content-module convention. Engineer imports by name.

## Interactions

- **Hover (pointer devices, card)** — translate-y -2 to -4px + elevate from `shadow-card` to a stronger drop. CSS transition only (`transition-base ease-out-soft`). No JS — keeps it 60fps and avoids re-render churn on a 6-card grid.
- **Hover (learn-more link)** — `ArrowRight` icon translates +2 to +4px on the x-axis, reusing `transition-base`.
- **Focus visible** — every card is a focusable link (entire card wrapped in `<a>`); show a 2px primary-500 ring with `focus-visible:ring-2`.
- **Entrance** — once-only `whileInView` fade + 16px slide-up per card, staggered 60–100ms, threshold around 20% in view. Honor `useReducedMotion()` → render with no transform/opacity animation when reduced motion is requested.
- **No scroll-linked motion** — this section uses framer-motion only; GSAP is unnecessary because nothing scrubs or pins.

## Decisions

### D1. 3×2 grid vs. reference's pinned scroll-linked panels

Reference (`refs/twilio/scroll_03.png` … `scroll_07.png`) uses pinned, scrubbed product panels. Issue mandates a 3×2 grid.

- A — match reference exactly with GSAP pinned/scrubbed panels. Pro: highest fidelity. Con: contradicts issue; heavy on a page that already has hero, code mockup, stats.
- **B — 3×2 grid as briefed. *(Recommended)*** Pro: matches issue, scannable, cheap. Con: diverges from reference's specific section treatment.
- C — hybrid (pinned for top three + grid for the rest). Pro: nods to reference. Con: split treatment, double the work.

**Recommendation: B.** The MATCH rule covers patterns broadly, not every individual section. A feature grid is a legitimate Relay-native treatment.

### D2. Card composition: separate file vs. inline

- **A — inline `FeatureCard` in `Features.tsx`. *(Recommended)*** Single file, no premature abstraction.
- B — split into `components/relay/FeatureCard.tsx`. Speculative reuse.

### D3. Click target: full-card link vs. learn-more-link only

- **A — full card is the link. *(Recommended)*** Bigger target; ArrowRight is affordance not the only target.
- B — only the link is clickable. Crisp semantics, weaker affordance.

### D4. Entrance animation

- **A — single grid container with stagger child variants. *(Recommended)*** One IntersectionObserver, six children.
- B — per-card `whileInView`. Six observers, inconsistent stagger on slow scroll.

### D5. Responsive breakpoints

`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. Designer may push the desktop break to `md:` if cards crowd at 768px.

### D6. Server vs client component

Client (`"use client"`) — framer-motion + `useReducedMotion`.

### D7. Animation stack

framer-motion only. No GSAP.

### D8. Product naming — IP integrity

Issue lists *Programmable SMS, Voice & Video, Email API, WhatsApp Business, Verify (2FA), Studio (visual builder)*. "Programmable SMS", "Verify", "Studio", "WhatsApp Business" are Twilio-distinctive product names. Project Context REPLACE rule: all copy strings → original Relay voice.

- A — keep names verbatim. Violates the IP REPLACE line.
- **B — Copywriter produces six Relay-original names mapping 1:1 to the same capability categories. *(Recommended)*** Categories (SMS, voice, email, chat, identity, automation builder) are generic; the names are ours.

**Recommendation: B.** Engineer must not hardcode the Twilio names.

### D9. "Learn more" destination

Product detail pages do not exist on this single-page site.

- **B — single `href: "#"` placeholder for all six, with a `// TODO` near the FEATURES array referencing this ADR. *(Recommended)***

## Open questions for Designer

1. Grid gap (suggest `gap-6` mobile, `gap-8` desktop) and card padding (suggest `p-6`).
2. Section vertical padding (suggest `py-20 lg:py-28`) — confirm against neighbors' rhythm.
3. Container max-width (suggest `max-w-7xl`).
4. Icon-tile stroke width — lucide default 2 vs. 1.75 at 20–24px size.
5. Headline alignment — issue says centered; reference often left-aligns. Default to centered per issue.
6. Hover lift magnitude — `-translate-y-1` (4px) vs `-translate-y-0.5` (2px). Recommend 4px.
7. Hover shadow — define a `shadow-card-hover` token, or bump to `shadow-lg`?
8. Focus ring — `ring-primary-500` + `ring-offset-2`.
9. Entrance timing — `duration: 0.5`, `ease: [0.0, 0.0, 0.2, 1]`, stagger `0.08`, `amount: 0.2`, `once: true`.
10. Tablet breakpoint — `sm` (640px) or `md` (768px).

## Open questions for Copywriter

1. **Eyebrow** — issue suggests "PLATFORM". Confirm or substitute (≤ 12 chars).
2. **Section headline** — issue suggests "Everything you need to ship messaging that works". Confirm or rewrite within voice rules (≤ 12 words; no powerful/seamless/robust/leverage; no exclamation).
3. **Six product names** — Relay-original, mapping to: short messaging / voice + video / transactional email / chat-app messaging / identity verification / visual workflow builder. Do NOT reuse Twilio product names.
4. **Six body strings** — one per card, ≤ 24 words, Relay voice, no exclamation.
5. **Learn-more microcopy** — pick one ("Learn more", "Read the docs", "See it work", or alternative); used uniformly across all six.
6. **Optional sub-headline / lede** — Copywriter decides whether to include; if yes, ≤ 24 words.

## Hand-off

Designer + Copywriter can begin in parallel. Engineer waits on both, then implements `components/relay/Features.tsx` per this ADR plus the design + content artifacts.
