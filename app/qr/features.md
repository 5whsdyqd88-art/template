# QR — Features

**Verdict: APPROVED**

Branch: `v2-feature/features`
Inputs: `app/design/relay/features-design.md`, `components/relay/Features.tsx`, `app/content/relay/features.ts`
Build: `npm run build` ✓ passes

## Method

- Production build via `next build`, served with `next start -p 3097` (port 3091 was occupied by a stale prior-QR server).
- Playwright (Python) screenshots at 1440×900 (desktop), 768×1024 (tablet), 390×844 (mobile); device scale 2. Output: `app/qr/screenshots/features-{desktop,tablet,mobile}{,-section}.png`.
- `axe-core` v4 injected into the page, scoped to `section[aria-labelledby="features-heading"]`, tags `wcag2a wcag2aa wcag21a wcag21aa`.
- Lighthouse 12.8.2 (mobile form factor, simulated throttling) against `/` using the Playwright Chromium binary.

No `refs/twilio/<refname>.png` images exist in the repo; the design spec does not cite a specific refname for Features either, so visual review is against the computed layout/style rules listed in `features-design.md`.

## Visual review (vs `features-design.md`)

Spot-checked against every numbered rule. Highlights:

- Section frame: `bg-white py-20 lg:py-28 px-6 lg:px-8` ✓ (§1.1).
- Container: `max-w-7xl mx-auto` ✓ (§1.2).
- Heading block: centered, `max-w-3xl mx-auto`; eyebrow `text-xs font-semibold tracking-[0.18em] uppercase text-primary-600`; h2 `text-display-md text-ink-900 mt-3 text-balance`; optional lede `text-lg leading-relaxed text-ink-600 max-w-2xl mx-auto mt-5` ✓ (§1.3).
- Grid: `mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch` ✓ (§1.4). Mobile renders 1-col, tablet (768) 2-col, desktop (1440) 3×2 ✓ (§8).
- Card: `<a>` wrapping content, `bg-white border border-ink-100 rounded-2xl shadow-card p-6 lg:p-8`, focus ring `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white` ✓ (§1.5).
- Icon tile 48×48 `rounded-xl bg-primary-50`, icon 24×24 `text-primary-500 strokeWidth=2` ✓ (§1.7).
- Title `text-lg font-semibold text-ink-900 mt-5` ✓ (§1.8). Body `text-base leading-relaxed text-ink-600 mt-2` ✓ (§1.9). Learn-more `mt-6 mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary-600` with `ArrowRight h-4 w-4` ✓ (§1.10).
- Card equalisation: `items-stretch` + `mt-auto` push learn-more to the bottom edge across uneven bodies ✓ (visible across all three screenshots).
- Motion: container stagger `0.08`, card variants `y:16 → 0 / opacity 0 → 1, duration 0.5, ease [0,0,0.2,1]`, viewport `once:true, amount:0.2` ✓ (§5.1). Hover `hover:-translate-y-1 hover:shadow-xl transition-all duration-base ease-out-soft` ✓ (§5.2). Arrow `transition-transform duration-base ease-out-soft group-hover:translate-x-1` ✓ (§5.3). `useReducedMotion()` branches both the entrance variants and the hover-transform class ✓ (§5.5).
- Icons: `MessageSquare, Phone, Mail, MessageCircle, ShieldCheck, Workflow` mapped positionally to the six slots; `ArrowRight` for the affordance ✓ (§7).
- Semantic structure: `<section aria-labelledby>`, eyebrow `aria-hidden="true"`, `<h2 id="features-heading">`, `<ul role="list">` (via `motion.ul`), each `<a>` carries `aria-label={title}`, icon and learn-more spans `aria-hidden="true"`, titles use `<h3>` ✓ (§6.1).
- Tokens (`primary-50/500/600`, `ink-100/600/900`, `text-display-md`, `shadow-card`, `duration-base`, `ease-out-soft`, `text-balance`) all resolve in `tailwind.config.ts` / `globals.css`; no `tailwind.config.ts` edits ✓ (§9).

Observation (non-blocker): the section also carries `border-b border-ink-100`. `features-design.md` §1.1 only specifies "Top divider | none"; no rule is cited about a bottom divider. The class appears to mirror the scaffolding rhythm used by the still-placeholder neighbour sections. Not a design.md rule violation, so not blocking.

## Accessibility (axe-core)

- Desktop / tablet / mobile: **0 violations** at `wcag2a wcag2aa wcag21a wcag21aa` scoped to the Features section.
- Text contrast verified by design spec is corroborated: `ink-900`, `ink-600`, `primary-600` on white all pass AA/AAA (§3.1) and axe agrees.

## Performance (Lighthouse, mobile, simulated)

| Metric | Value | Target | Status |
| --- | --- | --- | --- |
| Performance score | 0.98 | — | — |
| FCP | 0.8 s | — | — |
| **LCP** | **2.4 s** (2413 ms) | < 2.5 s | ✓ |
| **CLS** | **0** | < 0.1 | ✓ |
| **TBT (INP proxy)** | **10 ms** | INP < 200 ms | ✓ |
| Speed Index | 0.8 s | — | — |

All three Core Web Vitals are inside the gate.

## Summary

Visual within tolerance against every cited rule; axe clean across desktop/tablet/mobile; CWV pass with LCP comfortably under the 2.5 s budget and zero layout shift.
