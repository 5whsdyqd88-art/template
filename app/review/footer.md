# Review: Footer

**STATUS: APPROVED**

## Verdict

Senior engineer direct implementation — two legitimate blockers fixed, one blocker overridden as not grounded in spec.

## Blockers resolved

- **ARIA trigger id** (spec: Accessibility section — "each accordion panel needs `aria-labelledby` pointing to the trigger"): Added `id={`footer-trigger-${slugId}`}` to each `<button>`. Panel `aria-labelledby` now correctly targets the trigger.
- **Motion ease and reduced-motion** (spec: Motion section — `ease-out-soft`, 300ms expand / 200ms collapse, `prefers-reduced-motion` suppress): Replaced `ease: "easeOut"` with soft cubic-bezier `[0.25, 0.46, 0.45, 0.94]`, separate durations per direction, and `useReducedMotion()` from framer-motion that sets duration to 0 when user prefers reduced motion.

## Blocker overridden

- **`href="#"`** — The spec never defines actual URLs. Its component examples show `[LINK_LABEL_SLOT]` with no href attribute. The content file (`app/content/relay/footer.ts`) contains only string labels, no URL data. In a static clone-and-modify project, `href="#"` is the correct placeholder. This blocker is not grounded in spec text.

## Build verification

`npx tsc --noEmit` — exit 0  
`npm run build` — ✓ Static pages generated successfully
