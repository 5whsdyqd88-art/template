# Review: Features and Footer

**STATUS: CHANGES REQUESTED**

## Verdict file: `app/review/stats-3-number-band.md`

## Blockers

### Footer.tsx:95 — `brandMiscLinks.map()` type error
The `footerContent.brandMiscLinks` is defined as an object in `app/content/relay/footer.ts:132-142`, but the component at `Footer.tsx:95` calls `.map()` on it. This causes a TypeScript error. The content file should export an array of `{ text, href }` objects instead of an object, OR the component should iterate over `Object.entries()`.

### Footer.tsx:119,128,129 — Missing href property
The `column.links` and `column.viewAll` in `footerContent` are strings, but the component expects objects with `{ text, href }` shape. Lines 119, 128, 129 will fail at runtime.

### Footer.tsx:99 — Missing href property on brand misc links
The brand misc links are strings in the content, but `Footer.tsx:99` tries to access `link.href`.

### Features.tsx:1 — Missing icon imports from allowed list
The component imports `Phone` which is correct, but `ArrowRight` usage at line 109 should verify the icon is present in lucide-react v1.x. Verified: `ArrowRight` exists in lucide-react v1.7x.

### Features.tsx:34-38 — Lede condition missing
The component at `Features.tsx:34-38` conditions on `featuresContent.lede` correctly per spec §1.3.

## Non-blockers (passing)

- Features: Entrance animation with stagger `0.08`, card variants `opacity y:16→0`, duration 0.5, ease `[0,0,0.2,1]` ✓ (spec §5.1)
- Features: Reduced motion handling with `useReducedMotion()` ✓ (spec §5.5)
- Features: Semantic structure with `<section aria-labelledby>`, `<ul role="list">`, `aria-label` on anchors ✓ (spec §6.1)
- Footer: Accordion with `aria-expanded`, `aria-controls`, `role="region"` ✓ (spec Footer Accessibility)
- All Tailwind tokens resolve in `tailwind.config.ts`

## Summary

Footer implementation has type/runtime errors due to mismatch between content structure (object/strings) and component expectations (array/objects). The content file `app/content/relay/footer.ts` needs structuring to match component requirements.
