"use client";

import { motion } from "framer-motion";
import { MessageSquare, Phone, Mail, MessageCircle, ShieldCheck, Workflow, ArrowRight } from "lucide-react";
import Link from "next/link";
import { featuresContent } from "../../app/content/relay/features";

import type { Variants } from "framer-motion";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] } },
};

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Features() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md text-ink-900 font-semibold text-balance">
            {featuresContent.headline}
          </h2>
          {featuresContent.lede && (
            <p className="text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto mt-5">
              {featuresContent.lede}
            </p>
          )}
        </div>

        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.2, once: true }}
          variants={gridVariants}
        >
          {featuresContent.features.map((feature, index) => {
            const iconMap = [MessageSquare, Phone, Mail, MessageCircle, ShieldCheck, Workflow];
            const Icon = iconMap[index];
            return (
              <motion.li
                key={index}
                variants={cardVariants}
                viewport={{ amount: 0.2, once: true }}
              >
                <Link
                  href="#"
                  className="group flex flex-col p-6 lg:p-8 bg-white border border-ink-100 rounded-2xl shadow-card transition-base ease-out-soft hover:shadow-xl hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label={feature.title}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-6 group-hover:text-primary-500 transition-colors duration-300 ease-out-soft">
                    <Icon className="w-6 h-6 text-primary-500" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-ink-900 mb-3 group-hover:text-primary-500 transition-colors duration-300 ease-out-soft">
                    {feature.title}
                  </h3>
                  <p className="text-ink-600 mb-6">{feature.body}</p>
                  <div className="mt-auto flex items-center text-sm text-primary-600 font-medium group-hover:translate-x-2 transition-transform duration-300 ease-out-soft">
                    {featuresContent.learnMore}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
