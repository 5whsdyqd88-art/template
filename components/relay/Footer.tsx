"use client";

import { footerContent } from "@/content/relay/footer";
import { Zap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const socialPaths: Record<string, string> = {
  GitHub: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.04-.015-2.04-3.338.72-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.745.083-.73.083-.73 1.205.085 1.838 1.235 1.838 1.235 1.07 1.835 2.805 1.305 3.495.995.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.335-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.3-.54-1.525.105-3.175 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.545 3.3-1.23 3.3-1.23.645 1.65.24 2.875.12 3.175.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z",
  X: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  LinkedIn: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.28zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  YouTube: "M23.498 6.186A3.264 3.264 0 0 0 21.75 5.25c-1.935 0-4.07.34-6.007.758a12.685 12.685 0 0 1-6.568 1.615A12.684 12.684 0 0 1 2.162 5.808 3.263 3.263 0 0 0 .412 6.74C-.589 9.465-1.333 12.716-1.333 16.15v4.975c0 3.434.744 6.686 1.745 9.411 1.748.934 3.883 1.273 5.818 1.273 1.934 0 4.069-.339 5.818-1.273a14.927 14.927 0 0 0 1.746-9.411v-4.975c0-3.434.745-6.685 1.746-9.411A3.264 3.264 0 0 0 23.498 6.186zM9.672 18.306V7.476l8.053 4.915-8.053 4.915z",
};

function SocialIcon({ name, url }: { name: string; url: string }) {
  if (name === "Zap") {
    return (
      <a href={url} className="text-ink-300 hover:text-white transition-colors" aria-label={name}>
        <Zap className="w-6 h-6" />
      </a>
    );
  }
  return (
    <a href={url} className="text-ink-300 hover:text-white transition-colors" aria-label={name}>
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d={socialPaths[name] || ""} />
      </svg>
    </a>
  );
}

function FooterColumn({ title, links }: { title: string; links: { name: string; url: string }[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
    >
      <h3 className="text-xs font-semibold text-ink-400 uppercase tracking-wide mb-4">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <motion.li
            key={link.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: shouldReduceMotion ? 0 : index * 0.08,
            }}
          >
            <a
              href={link.url}
              className="text-sm text-ink-300 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

function BrandBlock() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      className="flex flex-col items-start"
    >
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-8 h-8 text-white" />
        <span className="text-2xl font-semibold text-white">Relay</span>
      </div>
      <p className="text-sm text-ink-300 mb-4">{footerContent.tagline}</p>
      <div className="flex gap-4">
        {footerContent.social.map((social) => (
          <SocialIcon
            key={social.name}
            name={social.name}
            url={social.url}
          />
        ))}
      </div>
    </motion.div>
  );
}

function BottomBar() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      className="mt-16 pt-6 border-t border-ink-700"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-ink-400">{footerContent.copyright}</p>
        <div className="flex gap-6">
          {footerContent.bottomLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.5,
                delay: shouldReduceMotion ? 0 : index * 0.08,
              }}
              className="text-xs text-ink-400 hover:text-white transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Footer() {
  return (
    <footer className="min-h-[260px] flex items-center justify-center text-ink-400 text-sm bg-ink-900 text-ink-300">
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-12"
        >
          <BrandBlock />
          {footerContent.columns.map((column) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}
        </motion.div>
        <BottomBar />
      </div>
    </footer>
  );
}
