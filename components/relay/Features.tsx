"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  MessageSquare,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Workflow,
  ArrowRight,
} from "lucide-react";
import { featuresContent } from "@/app/content/relay/features";

const iconMap = {
  MessageSquare,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Workflow,
} as const;

type IconKey = keyof typeof iconMap;

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  },
};

export default function Features() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const MotionLi = prefersReducedMotion ? "li" : motion.li;

  return (
    <section
      aria-labelledby="features-headline"
      className="border-b border-ink-100 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
            {featuresContent.eyebrow}
          </p>
          <h2
            id="features-headline"
            className="mt-3 text-display-md text-balance text-ink-900"
          >
            {featuresContent.headline}
          </h2>
        </div>

        <motion.ul
          role="list"
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuresContent.items.map((feature) => {
            const Icon = iconMap[feature.icon as IconKey];
            return (
              <MotionLi
                key={feature.title}
                variants={prefersReducedMotion ? undefined : cardVariants}
                className="group flex flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 transition-all duration-base hover:shadow-xl lg:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">
                  {feature.title}
                </h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-600">
                  {feature.body}
                </p>
                <a
                  href="#"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  {featuresContent.learnMore}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-base group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </MotionLi>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
