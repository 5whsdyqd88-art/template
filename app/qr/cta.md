# QR Verdict — CTA (gradient strip) · SAN-158

**Status:** CHANGES REQUESTED

Reviewed `components/relay/CTA.tsx` against `app/design/relay/cta-design.md` on `feature/cta` (built and served locally on :4500 from a fresh `next build`; the dev preview on :3011 was wedged on a stale build during this run, blocking the canonical preview).

## Gates

| Gate | Result |
|---|---|
| `npm run build` | PASS — clean, 0 errors, 0 warnings |
| axe-core (WCAG 2.0/2.1 A + AA, scoped to `#cta`) | PASS — 0 violations on desktop / tablet / mobile |
| Lighthouse perf — desktop | PASS — perf 1.0, LCP 46ms, CLS 0, TBT 0 |
| Lighthouse perf — mobile (page-level) | LCP 2557ms (3G sim) — borderline. Not driven by `#cta`; LCP element resolves to the LogoWall placeholder. Not a CTA-section blocker. |

## Visual blocker

### desktop / tablet — headline never reaches `display-md`

- **Where:** `components/relay/CTA.tsx:85` — `<h2>` className includes `md:display-md`.
- **Measured (computed `font-size` via Playwright):**
  - mobile (390): 30px ✓ (matches `text-3xl`)
  - tablet (768): **30px** — should be **36px**
  - desktop (1280): **30px** — should be **36px**
- **Design rule violated:**
  - `cta-design.md` §1, table "Responsive breakpoints" — row `md+ (≥768)` requires `Headline size: display-md (2.25rem)`.
  - `cta-design.md` §2, type table — `Headline | display-md desktop · text-3xl mobile`.
- **Root cause:** `display-md` is registered under `theme.extend.fontSize` in `tailwind.config.ts:43`, so the generated utility is `text-display-md`, not `display-md`. The class `md:display-md` does not compile to anything, so the headline stays at `text-3xl` at every breakpoint.
- **Fix:** change `md:display-md` to `md:text-display-md` on the `<h2>` className. Verify by reloading at ≥768px width — headline `font-size` should compute to 36px and `letter-spacing` to -0.36px.
- **Evidence:** `/tmp/qr-cta/cta_desktop.png`, `/tmp/qr-cta/cta_tablet.png`, `/tmp/qr-cta/cta_mobile.png`; computed styles in `/tmp/qr-cta/axe-results.json` (`styles.headline.font.size`).

## Non-blocking observations (informational, do NOT need to be fixed for approval)

1. **Subhead opacity 0.88 vs spec contrast-table value 0.90.** §3 lists the subhead foreground as `text-white/90`; the implementation uses inline `style={{ opacity: 0.88 }}` (`CTA.tsx:91`). Effective contrast over `primary-600` is ~4.79:1 — still passes WCAG AA body (4.5:1) and axe is clean. Inside the spec's stated tolerance ("do not go below 4.5:1"). Leave as-is unless you're already in the file.
2. **SVG attribute casing.** `stroke-opacity` and `stroke-width` are kebab-case in JSX (`CTA.tsx:48-58`). React still renders them, but emits a dev-mode console warning. No production impact; convert to `strokeOpacity` / `strokeWidth` next time you touch the file.
3. **Decorative SVG layer order.** Spec §6 calls for back→front: glow rect → Path 2 → Path 1. Implementation order matches. ✓

## What passed

- Section structure: `<section id="cta" aria-labelledby="cta-headline">` ✓
- Background gradient `bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500` ✓
- Section padding: 80/24px mobile, 96/32px md+ ✓ (computed)
- Inner wrapper `mx-auto max-w-3xl text-center` ✓
- Headline color `#fff`, weight 600, line-height 1.15, tracking -0.01em ✓ (only the size step is broken)
- Subhead `text-lg` (18px) mobile / `text-xl` (20px) md+ ✓
- CTA shape, size, spacing, color, focus ring, mobile full-width ✓
- Decorative SVG: `aria-hidden`, full-bleed clipped by `overflow-hidden`, two curves + radial glow ✓
- Reduced-motion branch present via `useReducedMotion()` ✓
- Headline carries the section's accessible name; ArrowRight is `aria-hidden` ✓

## How to verify after fix

```
cd /home/vlad/fleet/smoketest/repo
git checkout feature/cta
npm run build                                  # must stay clean
# spin up a local preview (dev :3011 was wedged at review time):
npx next start -p 4500 -H 127.0.0.1 &
# headline at desktop should now compute to 36px
node -e 'fetch("http://127.0.0.1:4500/").then(r=>r.text()).then(t=>console.log(/md:text-display-md/.test(t)?"class present":"MISSING"))'
```
