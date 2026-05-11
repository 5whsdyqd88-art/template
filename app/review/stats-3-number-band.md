# Review: Stats 3-number band

**STATUS: CHANGES REQUESTED**

## Verdict file: `app/review/stats-3-number-band.md`

## Blockers

- `components/relay/Stats3NumberBand.tsx:76` — `react-countup` package added to `package.json` but was not present before; this dependency is not in the project's original `dependencies` section and needs explicit architecture approval per the design spec's count-up animation requirement.

- `components/relay/Stats3NumberBand.tsx:54` — `href="#"` hard-coded; spec requires actual CTA URLs per card (should be pulled from content or props).

- `components/relay/Stats3NumberBand.tsx:80-85` — `Image` component uses fixed `width={172}` and `height={48}`; logos have different aspect ratios per design spec (Gartner 172×48, Omdia 152×48, IDC 107×48). Hard-coded values break Omdia and IDC logo rendering.

- `components/relay/Stats3NumberBand.tsx:18-22` — reduced motion logic only affects entrance animation; spec requires skipping count-up animation entirely when `prefers-reduced-motion`.

## Summary

Blocked due to missing dependency approval and three implementation deviations from design spec regarding Logo sizing, hardcoded href, and reduced motion handling for count animation.
