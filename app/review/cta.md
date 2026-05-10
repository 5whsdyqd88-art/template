# CTA Review Verdict

**STATUS: CHANGES REQUESTED**

## Blockers

### 1. Build — unused `variants` constant
- **File:** `components/relay/CTA.tsx:12-15`
- **Issue:** The `variants` object is declared but eslint reports `@typescript-eslint/no-unused-vars`. The code passes `variants={variants}` but the variant names `"initial"` and `"animate"` are string literals that match the object keys, which should work. However, the build fails before we can verify.

### 2. Visual — headline responsive sizing is inverted
- **File:** `components/relay/CTA.tsx:85`
- **Spec:** §1 table, `md+ (≥768)` → `display-md (2.25rem)`; mobile → `text-3xl`
- **Current:** `className="text-3xl ... md:display-md"` applies `text-3xl` at mobile and `display-md` at md+
- **Problem:** `md:display-md` doesn't work because Tailwind generates the utility as `text-display-md` (not `display-md`). The headline would stay at `text-3xl` at all breakpoints.
- **Fix:** Change `md:display-md` to `md:text-display-md`

### 3. Visual — subhead → CTA row spacing is inverted
- **File:** `components/relay/CTA.tsx:95`
- **Spec:** `mt-8` mobile / `mt-10` desktop (§4, line 113)
- **Current:** `className="mt-8 ... sm:mt-8 md:mt-10"` — this actually matches the spec correctly
- **Note:** The QR verdict claimed this was inverted, but reviewing the code, it appears correct: base `mt-8` (mobile), stays `mt-8` at `sm`, then `mt-10` at `md+`

## checklist
- ✅ Composition matches architect.md
- ⚠️ Tailwind classes partially match design.md — headline class `md:display-md` should be `md:text-display-md`
- ✅ All copy imported from content module
- ✅ All icons exist in lucide-react v1.x
- ✅ `"use client"` only when needed
- ✅ Scope only includes expected files

## Summary
The implementation is mostly correct but has a critical typo in the responsive headline class that prevents the spec-compliant sizing from being applied. The spacing for subhead→CTA row was incorrectly flagged as inverted in the QR verdict but is actually correct.
