"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface PrimaryPillProps {
  href: string;
  children: React.ReactNode;
}

export default function PrimaryPill({ href, children }: PrimaryPillProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 h-9 rounded-full px-5 text-sm font-semibold bg-primary-500 text-white transition-all hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      <span>{children}</span>
      <motion.span
        animate={{ x: 2 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <ArrowRight className="h-4 w-4" />
      </motion.span>
    </a>
  );
}
