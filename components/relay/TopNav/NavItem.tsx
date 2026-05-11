"use client";

import { motion } from "framer-motion";
import type { Transition } from "framer-motion";

interface NavItemProps {
  item: { label: string; href: string };
  prefersReducedMotion: boolean;
}

const easeOutSoft: Transition["ease"] = [0.43, 0.13, 0.23, 0.96];

export default function NavItem({ item, prefersReducedMotion }: NavItemProps) {
  const localEase: Transition["ease"] = prefersReducedMotion ? [0.4, 0, 0.2, 1] : easeOutSoft;

  const caretTransition: Transition = {
    duration: prefersReducedMotion ? 0.08 : 0.18,
    ease: localEase,
  };

  const underlineTransition: Transition = {
    duration: prefersReducedMotion ? 0.2 : 0.2,
    ease: "easeOut",
  };

  return (
    <a
      href={item.href}
      className="relative inline-flex items-center gap-1 text-sm font-normal text-ink-900 hover:text-primary-500 leading-[1.75]"
      aria-label={item.label}
    >
      {item.label}
      <motion.span
        style={{ display: "inline-flex" }}
        animate={{ rotate: prefersReducedMotion ? 0 : 180 }}
        transition={caretTransition}
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.span>
      <motion.div
        className="absolute bottom-0 left-0 h-[1.5px] bg-ink-900 origin-left"
        style={{ width: "100%" }}
        animate={{ scaleX: prefersReducedMotion ? 1 : 0 }}
        transition={underlineTransition}
      />
    </a>
  );
}
