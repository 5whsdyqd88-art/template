"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageSquare, Phone, Mail, MessageCircle, ShieldCheck, Workflow, ArrowRight } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  { icon: MessageSquare, title: "Pulse", body: "Send and receive SMS globally with reliable delivery and two-way conversations.", href: "#" },
  { icon: Phone, title: "Wire", body: "Voice and video calling with low latency and enterprise-grade quality.", href: "#" },
  { icon: Mail, title: "Dispatch", body: "Transactional email API with Templates, tracking, and deliverability insights.", href: "#" },
  { icon: MessageCircle, title: "Threads", body: "Chat-app messaging for WhatsApp, Messenger, and Instagram direct integrations.", href: "#" },
  { icon: ShieldCheck, title: "Vouch", body: "身份 verification and 2FA with SMS, voice, and app-based authentication options.", href: "#" },
  { icon: Workflow, title: "Forge", body: "Visual workflow builder to design customer journeys without writing code.", href: "#" },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  transition: { staggerChildren: 0.08 },
};



export default function Features() {
  const shouldReduceMotion = useReducedMotion();

  const entranceVariant = shouldReduceMotion ? {} : fadeUp;

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-4 block">
            PLATFORM
          </span>
          <h2 className="text-display-md text-ink-900 font-semibold">
            Everything you need to ship messaging that works
          </h2>
        </div>

        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ amount: 0.2, once: true }}
        >
          {FEATURES.map((feature, index) => {
            const { icon: Icon, title, body, href } = feature;
            return (
              <motion.li key={index} variants={entranceVariant}>
                <Link
                  href={href}
                  className="group flex flex-col p-6 lg:p-8 bg-white border border-ink-100 rounded-2xl shadow-card transition-all duration-300 ease-out-soft hover:shadow-xl hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  aria-label={title}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-6 group-hover:text-primary-600 transition-colors duration-300 ease-out-soft">
                    <Icon className="w-6 h-6 text-primary-500" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors duration-300 ease-out-soft">
                    {title}
                  </h3>
                  <p className="text-ink-600 mb-6">{body}</p>
                  <div className="mt-auto flex items-center text-sm text-primary-600 font-medium group-hover:translate-x-2 transition-transform duration-300 ease-out-soft">
                    Learn more
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
