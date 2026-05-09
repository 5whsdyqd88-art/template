"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";

import { testimonialsContent } from "@/app/content/relay/testimonials";

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};

function QuoteCard({ quote, name, role, company, initials }: (typeof testimonialsContent["quotes"])[0]) {
  const shouldReduceMotion = useReducedMotion();

  const entranceVariant = shouldReduceMotion
    ? {}
    : {
        y: -4,
        transition: {
          type: "spring" as const,
          duration: 0.48,
          ease: [0, 0, 0.2, 1] as const,
        },
      };

  return (
    <motion.figure
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={entranceVariant}
      className="group relative bg-white shadow-card rounded-2xl p-6 md:p-8 transition-shadow hover:shadow-cta hover:ring-1 hover:ring-primary-200"
    >
      <Quote className="absolute left-6 top-6 w-8 h-8 md:w-10 md:h-10 text-primary-200" aria-hidden="true" />
      <blockquote className="relative z-10 text-lg text-ink-800 leading-relaxed mb-6">
        {quote}
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-medium"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-ink-900">{name}</span>
          <span className="text-sm text-ink-500">
            {role}, {company}
          </span>
        </div>
      </figcaption>
    </motion.figure>
  );
}

export default function Testimonials() {
  const { eyebrow, headline, quotes } = testimonialsContent;

  return (
    <section className="bg-primary-50 py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block mb-2 text-sm font-medium text-primary-700 tracking-wide uppercase">
            {eyebrow}
          </span>
          <h2 className="display-md text-ink-900 text-balance">{headline}</h2>
        </div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {quotes.map((quote, index) => (
              <QuoteCard key={index} {...quote} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
