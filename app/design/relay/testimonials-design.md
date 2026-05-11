# Testimonials — Design Spec

Section: 3 customer quote cards with avatar initials, name, role, company.

## Layout

- Section background: `bg-primary-50`
- Section padding: `py-24 md:py-32`
- Container: `mx-auto max-w-7xl px-6 md:px-10`
- Grid: `grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch`
- Grid margin-top: `mt-12 md:mt-16`

## Heading block (left-aligned)

- Eyebrow: `text-xs font-mono uppercase tracking-[0.18em] text-primary-700`
- Heading (`h2`, id=`testimonials-heading`): `text-display-md font-semibold text-ink-900 max-w-2xl mt-3 text-wrap-balance`

## QuoteCard (`<figure>`)

- Container: `bg-white rounded-2xl shadow-card ring-1 ring-ink-100 p-6 md:p-8 min-h-[260px] flex flex-col gap-6 items-start`
- Hover: `hover:-translate-y-4 hover:shadow-cta hover:ring-primary-200 transition-all duration-200`
- Quote icon (`Quote` from lucide-react): `w-8 h-8 md:w-10 md:h-10 text-primary-200 opacity-10 aria-hidden`
- Quote text (`<blockquote>`): `text-lg leading-relaxed text-ink-800 font-normal`
- Figcaption: `flex items-center gap-3`
- Avatar div: `w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-700 tracking-wider uppercase aria-hidden`
- Name: `text-sm font-medium text-ink-900`
- Role + company: `text-sm text-ink-500` (format: `{role} · {company}`)

## Motion

- Container variants: `staggerChildren: 0.12, delayChildren: 0.12`
- Item variants: `hidden: { opacity: 0, y: 24 }`, `visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: "easeOut" } }`
- Reduced motion: render static (no transforms, no stagger), both heading block and cards
