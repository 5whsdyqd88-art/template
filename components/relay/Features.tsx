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

const ICONS = [MessageSquare, Phone, Mail, MessageCircle, ShieldCheck, Workflow] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
};

const cardVariantsReduced = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  const shouldReduceMotion = useReducedMotion();
  const activeCardVariants = shouldReduceMotion ? cardVariantsReduced : cardVariants;

  return (
    <section
      aria-labelledby="features-heading"
      className="bg-white py-20 lg:py-28 px-6 lg:px-8 border-b border-ink-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <p
            id="features-eyebrow"
            aria-hidden="true"
            className="text-xs font-semibold tracking-[0.18em] uppercase text-primary-600"
          >
            {featuresContent.eyebrow}
          </p>
          <h2
            id="features-heading"
            className="text-display-md text-ink-900 mt-3 text-balance"
          >
            {featuresContent.headline}
          </h2>
          {featuresContent.lede && (
            <p className="text-lg leading-relaxed text-ink-600 max-w-2xl mx-auto mt-5">
              {featuresContent.lede}
            </p>
          )}
        </div>

        <motion.ul
          role="list"
          className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featuresContent.features.map((feature, index) => {
            const Icon = ICONS[index];
            return (
              <motion.li key={feature.title} variants={activeCardVariants}>
                <a
                  href="#"
                  aria-label={feature.title}
                  className={[
                    "group flex flex-col h-full",
                    "bg-white border border-ink-100 rounded-2xl shadow-card",
                    "p-6 lg:p-8 cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                    shouldReduceMotion
                      ? "hover:shadow-xl transition-shadow duration-base ease-out-soft"
                      : "hover:-translate-y-1 hover:shadow-xl transition-all duration-base ease-out-soft",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center"
                  >
                    <Icon className="w-6 h-6 text-primary-500" strokeWidth={2} />
                  </span>
                  <h3 className="text-lg font-semibold text-ink-900 mt-5">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-relaxed text-ink-600 mt-2">
                    {feature.body}
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-6 mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary-600"
                  >
                    {featuresContent.learnMore}
                    <ArrowRight
                      className={[
                        "h-4 w-4",
                        shouldReduceMotion
                          ? ""
                          : "transition-transform duration-base ease-out-soft group-hover:translate-x-1",
                      ].join(" ")}
                      strokeWidth={2}
                    />
                  </span>
                </a>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
