# TopNav Review Verdict — Senior Engineer (REVIEW_OVERSIZE)

**Status:** CHANGES REQUESTED
**Branch:** `feature/topnav` vs `origin/main`
**Spec:** `app/design/relay/topnav-design.md`

---

## Blockers

### 1. Nav underline positioned at top, not bottom of label
- **File:** `components/relay/TopNav.tsx` — `NavItem` underline `motion.span`
- **Spec §4 (Underline geometry):** "Position: absolute, bottom of label, `bottom: -2px` from baseline"
- **Implementation:** `style={{ top: "-2px", width: "100%" }}` — `top: -2px` places the bar 2 px above the link's top edge, not 2 px below its bottom. Change to `bottom: -2px`.

### 2. Nav underline spans label + caret (should be label-only)
- **File:** `components/relay/TopNav.tsx` — same `motion.span`
- **Spec §4:** "Width: 100% of label only (label-only, **not** label+caret)"
- **Implementation:** `width: "100%"` on the underline inside the anchor that also contains `ChevronDown`. The underline must be placed inside a `<span>` wrapping only the label text, or sized to that span's measured width.

### 3. Mobile drawer panel missing `rounded-l-2xl`
- **File:** `components/relay/TopNav.tsx` — `MobileDrawer` panel `motion.div`
- **Spec §4 (Drawer geometry):** "`rounded-l-2xl` (16px on left edge only)"
- **Implementation:** `className="fixed top-0 right-0 z-50 h-full w-[min(360px,85vw)] bg-white border-l border-ink-100 shadow-card"` — no `rounded-l-2xl`.

### 4. Primary CTA pill label weight is `font-medium` instead of `font-semibold`
- **File:** `components/relay/TopNav.tsx` — `CtaPillBase`
- **Spec §2 (Type):** `"Start for free" pill label: text-sm font-semibold (600)`
- **Implementation:** `CtaPillBase` applies `text-sm font-medium` to all pills. `PrimaryPill` inherits this without overriding. Add `font-semibold` to `PrimaryPill`'s className (or override in `CtaPillBase` call site).

### 5. Arrow nudge translates text + icon together instead of icon only
- **File:** `components/relay/TopNav.tsx` — `PrimaryPill`
- **Spec §5.5 (CTA pills — Start for free):** "On hover translate-x `0 → 2px`, 180ms — the arrow nudge"
- **Implementation:** `<motion.span animate={{ x: isHovered ? 2 : 0 }}>{children}</motion.span>` where `children` includes the CTA text and `ArrowRight` icon. Only the `ArrowRight` icon should translate; the label text must stay fixed.

### 6. `GhostLink` missing `h-9 px-2 py-2` hit-target geometry
- **File:** `components/relay/TopNav.tsx` — `GhostLink`
- **Spec §4 (Vertical / pill geometry):** "Sign in (ghost): `h-9` (36px), `px-2 py-2`"
- **Implementation:** `GhostLink` renders a plain `<a>` with no height or padding. Both desktop and drawer usages lack the required 36 px hit target.

### 7. No focus trap in `MobileDrawer`
- **File:** `components/relay/TopNav.tsx` — `MobileDrawer`
- **Spec §6 (Focus management):** "Focus is trapped inside the drawer while open (Engineer: a small `useEffect` cycling focusable children at the boundaries)"
- **Implementation:** Only the initial focus-to-close-button `useEffect` is present; there is no boundary trap preventing Tab from escaping the drawer into behind-the-scrim elements.
