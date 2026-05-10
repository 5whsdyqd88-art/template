# QR Verdict — CTA (gradient strip) · SAN-183

**Status:** CHANGES REQUESTED

Reviewed `components/relay/CTA.tsx` against `app/design/relay/cta-design.md` on `feature/cta` (HEAD = `802f203`). Visual + a11y captures taken from a local `next dev` on 127.0.0.1:4501 because (a) `npm run build` fails on this branch and (b) the dev preview at :3011 is wedged on the pre-CTA scaffold (the `[CTA · RELAY-9 · awaiting orchestrator]` placeholder is still being served), almost certainly because `dev_deployer.py` cannot land a green build.

## Gates

| Gate | Result |
|---|---|
| `npm run build` | **FAIL** — ESLint blocker in `components/relay/Footer.tsx:135` |
| axe-core (WCAG 2.0/2.1 A + AA, scoped to `#cta`) | PASS — 0 violations on desktop / tablet / mobile |
| Visual fidelity vs `cta-design.md` | PASS — every measured token matches |
| Lighthouse perf (LCP / CLS / INP) | NOT RUN — requires a production build, which is broken |

## Blocker

### build / lint — `Footer.tsx` unused variable breaks the gate

- **Where:** `components/relay/Footer.tsx:135` — `const shouldReduceMotion = useReducedMotion();` is declared and never read.
- **Build error:** `Error: 'shouldReduceMotion' is assigned a value but never used. @typescript-eslint/no-unused-vars`
- **Design rule violated:** Project gate, `cta-design.md` §10 — "Component file: `components/relay/CTA.tsx` … `npx next build` must pass." The Engineering-standards build gate applies branch-wide; a feature branch that does not green-build cannot be QR-approved, even if the Footer is technically out-of-section, because `dev_deployer.py` won't FF onto `dev` and the production deploy path is blocked.
- **Downstream symptom:** `http://vlad.tail5272c5.ts.net:3011/` still renders the scaffold — the CTA section there is the `[CTA · RELAY-9 · awaiting orchestrator]` placeholder, not the implemented component. This is what tipped me off that the build is currently failing on the branch.
- **Fix:** either remove the unused declaration, or actually use `shouldReduceMotion` to gate Footer animation. Either is fine for QR — match what the rest of the file does. Then re-run `npm run build`; it should reach "Generating static pages" and exit 0.

## What passed (visual + a11y on `#cta`, captured locally)

Measurements (Playwright `getComputedStyle`) match the spec across all three viewports:

| Property | Mobile (390) | Tablet (768) | Desktop (1280) | Spec | Result |
|---|---|---|---|---|---|
| Headline `font-size` | 30px | 36px | 36px | `text-3xl` mobile / `display-md` md+ | ✓ |
| Headline weight / line-height / tracking | 600 / 1.15 / -0.3px | 600 / 1.15 / -0.36px | 600 / 1.15 / -0.36px | §2 type table | ✓ |
| Subhead `font-size` | 18px | 20px | 20px | `text-lg` mobile / `text-xl` md+ | ✓ |
| Section padding (top/right) | 80px / 24px | 96px / 32px | 96px / 32px | §1 + §4 | ✓ |
| CTA height | 56px | 56px | 56px | §5 (`h-14`) | ✓ |
| CTA primary width | 342 (full-col) | auto (205) | auto (205) | §1 mobile `w-full`, sm+ `w-auto` | ✓ |
| CTA secondary width | 342 (full-col) | auto (156) | auto (156) | §1 mobile `w-full`, sm+ `w-auto` | ✓ |
| Primary CTA color | white bg / `primary-700` text | same | same | §3 surface table (rgb(59,70,184) ≈ primary-700) | ✓ |
| Decorative SVG layer order (back → front) | glow rect → Path 2 → Path 1 | same | same | §6 | ✓ |
| Section landmark + accessible name | `<section id=cta aria-labelledby=cta-headline>` + `<h2 id=cta-headline>` | same | same | §8 | ✓ |
| `ArrowRight` icon `aria-hidden` | yes | yes | yes | §8 / §9 | ✓ |
| Reduced-motion branch via `useReducedMotion()` | present (`CTA.tsx:9,54-68`) | — | — | §7 | ✓ |
| axe-core violations | 0 | 0 | 0 | §8 | ✓ |

Evidence: `/tmp/qr-cta-3011/cta_{desktop,tablet,mobile}.png`, `/tmp/qr-cta-3011/full_{desktop,tablet,mobile}.png`, computed styles + axe results in `/tmp/qr-cta-3011/axe-results.json`.

## Non-blocking observations (informational, do NOT need to be fixed for approval)

1. **Subhead opacity 0.88 vs spec value 0.90.** §3 specifies the subhead foreground as `text-white/90`; the implementation uses inline `style={{ opacity: 0.88 }}` (`CTA.tsx:85`). Effective contrast over `primary-600` is ~4.79:1 — passes WCAG AA body (4.5:1) and axe is clean. Inside the spec's stated tolerance ("do not go below 4.5:1"). Leave as-is unless you're already in the file. (Carried over from SAN-158.)
2. **SVG attribute casing.** `stroke-opacity` and `stroke-width` are kebab-case in JSX (`CTA.tsx:40-49`). React renders them but emits a dev-mode console warning. No production impact; convert to `strokeOpacity` / `strokeWidth` next time the file is touched. (Carried over from SAN-158.)
3. **Lighthouse not gated this round.** Without a green production build I can't run the canonical Lighthouse pass. The previous QR (SAN-158) recorded perf 1.0 / LCP 46ms / CLS 0 for this section on a clean build, and nothing in `CTA.tsx` has changed since (`802f203` is review-only), so once the Footer gate clears, the perf numbers should hold.

## How to verify after fix

```
cd /home/vlad/fleet/smoketest/repo
git checkout feature/cta && git pull --ff-only
npm run build                              # must exit 0
# then either watch :3011 (dev_deployer FF), or:
nohup npx next start -p 4500 -H 127.0.0.1 > /tmp/relay-4500.log 2>&1 &
URL=http://127.0.0.1:4500/ OUT=/tmp/qr-cta-recheck node /tmp/qr-cta/capture.mjs
```
