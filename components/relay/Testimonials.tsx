"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonialsContent } from "@/app/content/relay/testimonials";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: "easeOut" },
  },
};

function QuoteCard({
  quote,
  name,
  role,
  company,
  initials,
}: {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}) {
  return (
    <motion.figure
      variants={itemVariants}
      className="bg-white rounded-2xl shadow-card ring-1 ring-ink-100 p-6 md:p-8 min-h-[260px] flex flex-col gap-6 items-start hover:-translate-y-4 hover:shadow-cta hover:ring-primary-200 transition-all duration-200"
    >
      <Quote className="w-8 h-8 md:w-10 md:h-10 text-primary-200 opacity-10" aria-hidden="true" />
      <blockquote className="text-lg leading-relaxed text-ink-800 font-normal">{quote}</blockquote>
      <figcaption className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-700 tracking-wider uppercase" aria-hidden="true">
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-ink-900">{name}</span>
          <span className="text-sm text-ink-500">{role} · {company}</span>
        </div>
      </figcaption>
    </motion.figure>
  );
}

export default function Testimonials() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <section aria-labelledby="testimonials-heading" className="bg-primary-50 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="text-left">
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-primary-700">{testimonialsContent.eyebrow}</span>
            <h2 id="testimonials-heading" className="text-display-md font-semibold text-ink-900 max-w-2xl mt-3 text-wrap-balance">
              {testimonialsContent.headline}
            </h2>
          </div>
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {testimonialsContent.quotes.map((q, idx) => (
              <QuoteCard key={idx} {...q} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="testimonials-heading" className="bg-primary-50 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-left">
          <motion.span variants={itemVariants} className="text-xs font-mono uppercase tracking-[0.18em] text-primary-700">
            {testimonialsContent.eyebrow}
          </motion.span>
          <motion.h2 id="testimonials-heading" variants={itemVariants} className="text-display-md font-semibold text-ink-900 max-w-2xl mt-3 text-wrap-balance">
            {testimonialsContent.headline}
          </motion.h2>
        </motion.div>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {testimonialsContent.quotes.map((q, idx) => (
            <QuoteCard key={idx} {...q} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
