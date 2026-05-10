# CTA — Quality Reviewer Verdict

Issue: SAN-145 · Branch: `feature/cta` · Component: `components/relay/CTA.tsx` · Spec: `app/design/relay/cta-design.md`

## Verdict: CHANGES REQUESTED

The build gate fails, so visual / a11y / performance checks were not run (cannot deploy to dev preview).

## Blockers

### 1. Build — `npm run build` fails

```
./components/relay/CTA.tsx
12:9  Error: 'variants' is assigned a value but never used.  @typescript-eslint/no-unused-vars
```

The `variants` object at `components/relay/CTA.tsx:12-15` is declared but never passed to the `motion.div` (which uses `initial="initial"` and `whileInView="animate"` — those are variant *names* with no `variants={variants}` prop, so framer-motion treats them as inline keys against an empty variant map and the animation will not run as specified).

Fix either:
- Pass `variants={variants}` to the `motion.div` (matches design §7 entrance spec), OR
- Inline the values: `initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}` and delete the unused constant.

### 2. Visual — headline responsive sizing is inverted (spec §1, table line 48–50)

Spec requires `text-3xl` on mobile / `sm`, stepping up to `display-md` at `md+`. Current implementation does the opposite.

- Spec §1: `< sm` and `sm` → `text-3xl`; `md+` → `display-md` (2.25rem)
- Code `components/relay/CTA.tsx:84`: `className="display-md ... sm:text-3xl"` — applies `display-md` at mobile, then *shrinks* to `text-3xl` from `sm` upward and stays there through `md+`.

Fix (mobile-first): `className="text-3xl ... md:[display-md class]"` — base is `text-3xl`, override at `md:` to the larger token.

### 3. Visual — subhead → CTA row spacing is inverted (spec §4, line 113)

Spec: `mt-10` desktop / `mt-8` mobile. Current implementation does the opposite.

- Spec §4: subhead → CTA row spacing is `mt-8` mobile, `mt-10` desktop.
- Code `components/relay/CTA.tsx:94`: `className="mt-10 ... sm:mt-8"` — applies `mt-10` at mobile, then drops to `mt-8` from `sm` upward and stays smaller through desktop.

Fix (mobile-first): `className="mt-8 ... md:mt-10"`.

## Not run (gated by build failure)

- Playwright screenshot diff at desktop / tablet / mobile vs `refs/twilio/scroll_10.png`
- axe-core accessibility scan
- Lighthouse CI (LCP / CLS / INP)

These will be re-run once the build passes and the section reaches `:3011`.
