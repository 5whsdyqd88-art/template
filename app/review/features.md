# Review: Features

**STATUS: APPROVED**

## Verdict

The Features section implementation matches the design spec (`app/design/relay/features-design.md`) on all required dimensions.

## Spec compliance

- **Layout** — `section` uses `py-20 lg:py-28 px-6 lg:px-8`, container is `max-w-7xl mx-auto`. Heading block is `text-center max-w-3xl mx-auto`. Grid is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch`. (Spec §1.1–1.4)
- **Cards** — Each card is a full-card `<a>` link with `rounded-2xl shadow-card border border-ink-100 p-6 lg:p-8 flex flex-col group`, hover lift `hover:-translate-y-1 hover:shadow-xl`, and `focus-visible` ring per spec §1.5. Inner rhythm: IconTile → Title (mt-5) → Body (mt-2) → Learn-more row (mt-auto). (Spec §1.5–1.11)
- **Icons** — All 6 icons from the allowed list: `MessageSquare`, `Phone`, `Mail`, `MessageCircle`, `ShieldCheck`, `Workflow` at 24×24 `strokeWidth={2}`. (Spec §7)
- **Typography** — Eyebrow `text-xs font-semibold tracking-[0.18em] uppercase text-primary-600`; headline `text-display-md text-ink-900 text-balance`; card title `text-lg font-semibold text-ink-900`; body `text-base leading-relaxed text-ink-600`. (Spec §2)
- **Motion** — Framer-motion stagger on `motion.ul` / `motion.li` with `whileInView`, `viewport={{ once: true, amount: 0.2 }}`. Card variants: `opacity: 0 → 1`, `y: 16 → 0`, `duration: 0.5`, `ease: [0,0,0.2,1]`, `staggerChildren: 0.08`. Arrow nudge `group-hover:translate-x-1`. `useReducedMotion()` disables transforms when true. (Spec §5)
- **Accessibility** — `<section aria-labelledby="features-heading">`, eyebrow `aria-hidden="true"`, `<ul role="list">`, each card `<a aria-label="{title}">`, icon span `aria-hidden`, learn-more span `aria-hidden`. (Spec §6)
- **Content** — `app/content/relay/features.ts` provides all 6 feature slots with eyebrow, headline, and lede. (Spec §10)

## Build

`npx tsc --noEmit` and `npm run build` both pass cleanly.
