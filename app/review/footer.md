# Review: Footer

**STATUS: CHANGES REQUESTED**

## Verdict file: `app/review/footer.md`

## Blockers

- `components/relay/Footer.tsx:62` — All links use `href="#"` hard-coded; spec requires actual URLs per link (should be pulled from content or props).
- `components/relay/Footer.tsx:26` — Accordion trigger missing `id` attribute to match `aria-labelledby` on panel; should be `id={`footer-trigger-${heading.replace(/\s+/g, "-").toLowerCase()}`}`.
- `components/relay/Footer.tsx:38` — Accordion expand/collapse uses `ease: "easeOut"` but spec requires `ease-out-soft` for expand and reverse duration/ease for collapse; also no `prefers-reduced-motion` handling.

## Summary

Blocked due to hard-coded hrefs, incomplete ARIA implementation for accordion, and motion timing not matching spec.
