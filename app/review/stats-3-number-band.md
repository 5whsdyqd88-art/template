# Review Verdict — stats-3-number-band

**STATUS: CHANGES REQUESTED**

## Summary

The feature branch `feature/stats-3-number-band` does not contain a working implementation. The Stats component remains a placeholder, and neither the design spec nor the content module exist.

## Blockers

### 1. Missing implementation — `components/relay/Stats.tsx`

- **Where:** `components/relay/Stats.tsx:1-7`
- **Issue:** Component contains placeholder text `[Stats · RELAY-7 · awaiting orchestrator]` instead of a functional 3-number band implementation.
- **Spec rule violated:** Component must implement the stats display per `app/design/relay/stats-3-number-band-design.md` (design spec not yet present, but expected pattern from CTA/TopNav/Footer).

### 2. Missing content module

- **Where:** `app/content/relay/stats.ts` (does not exist)
- **Issue:** Content module for `statsContent` has not been created. The CTA section has `ctaContent` in `app/content/relay/cta.ts`, but Stats has no equivalent.
- **Spec rule violated:** All copy must be imported from content modules, none inlined in JSX.

### 3. Missing design spec

- **Where:** `app/design/relay/stats-3-number-band-design.md` (does not exist)
- **Issue:** Design specification for the stats-3-number-band section is not present in the repository.
- **Spec rule violated:** Implementation cannot be verified against design spec.

### 4. Scope — additional files changed

- **Where:** `components/relay/CTA.tsx`, `components/relay/Footer.tsx`, `components/relay/TopNav.tsx`, `content/relay/footer.ts`
- **Issue:** These files were modified on the `feature/stats-3-number-band` branch but belong to the CTA feature (SAN-183), not the stats-3-number-band feature. The branch contains multiple unrelated features.
- **Spec rule violated:** Scope should be isolated to only the expected files for the stats-3-number-band feature.

## Recommendation

Do not merge `feature/stats-3-number-band` until:
1. Design spec `app/design/relay/stats-3-number-band-design.md` is provided
2. Content module `app/content/relay/stats.ts` is delivered
3. `components/relay/Stats.tsx` implements the stats band (matching the pattern from CTA/TopNav/Footer)
4. Branch is rebased/filtered to remove CTA/Footer/TopNav changes (those belong to `feature/cta`)

---

**Review performed at:** `33a2933`
**Verified with:** `npm run build` (passes, but does not validate Stats component)
