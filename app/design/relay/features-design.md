# Features (3-column product grid) — Visual Spec

Issue: RELAY-5 · Component file: `components/relay/Features.tsx`

---

## §1. Layout

### §1.1 Section container

- Element: `<section aria-labelledby="features-headline">`
- Border: `border-b border-ink-100`
- Padding: `py-20` mobile · `lg:py-28` (112px) desktop

### §1.2 Inner wrapper

- `mx-auto max-w-6xl px-6 md:px-8`

### §1.3 Heading stack

- Centered: `mx-auto max-w-2xl text-center`
- Eyebrow: `text-sm font-semibold uppercase tracking-[0.18em] text-primary-600`
- Headline: `mt-3 text-display-md text-balance text-ink-900` with `id="features-headline"`

### §1.4 Grid

- Element: `<ul role="list">`
- Layout: `mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8`

---

## §2. Feature card

- Element: `<li>` (or `<motion.li>`)
- Shape: `rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 lg:p-8`
- Hover: `transition-all duration-base hover:shadow-xl`
- Group class: `group`
- Layout: `flex flex-col`

### §2.1 Icon container

- `flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50`
- Icon: `h-6 w-6 text-primary-600` with `aria-hidden="true"`

### §2.2 Card title

- `mt-5 text-lg font-semibold text-ink-900`

### §2.3 Card body

- `mt-2 flex-1 text-[15px] leading-relaxed text-ink-600`

### §2.4 "Learn more" arrow link

- Element: `<a>`
- Classes: `mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700`
- Arrow icon: `h-4 w-4 transition-transform duration-base group-hover:translate-x-1`

---

## §3. Motion

### §3.1 Container animation

```
containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
```

- Apply to `<motion.ul>` via `variants`, `initial="hidden"`, `whileInView="show"`, `viewport={{ once: true, amount: 0.2 }}`

### §3.2 Card animation

```
cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
}
```

- Apply to each `<motion.li>` via `variants`

### §3.3 Reduced motion

- Check `useReducedMotion()`. When true, use plain `<li>` instead of `<motion.li>`.
- Container `<motion.ul>` can remain; stagger has no visible effect when children are plain `li`.

---

## §4. Content

- All copy imported from `app/content/relay/features.ts` (`featuresContent`)
- Six items; each has `icon` (string key), `title`, `body` string fields
- `learnMore` string for the arrow link label
- Icons from `lucide-react`: `MessageSquare`, `Phone`, `Mail`, `MessageCircle`, `ShieldCheck`, `Workflow`, `ArrowRight`

---

## §5. Accessibility

- Section labeled via `aria-labelledby="features-headline"`
- Grid uses `<ul role="list">` for screen reader item count announcement
- All icons carry `aria-hidden="true"`

---

## §6. Scope

Changed files: `components/relay/Features.tsx`, `app/content/relay/features.ts`, `app/design/relay/features-design.md`, `app/design/relay/features-architect.md`
