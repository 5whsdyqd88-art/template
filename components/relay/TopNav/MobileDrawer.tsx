"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { topNavContent } from "@/app/content/relay/topnav";
import GhostLink from "./GhostLink";
import OutlinedPill from "./OutlinedPill";
import PrimaryPill from "./PrimaryPill";

export default function MobileDrawer({
  open,
  onClose,
  prefersReducedMotion,
}: {
  open: boolean;
  onClose: () => void;
  prefersReducedMotion: boolean;
}) {
  const drawerTransition = prefersReducedMotion
    ? {
        enter: { opacity: 1, x: 0, transition: { duration: 0.12 } },
        exit: { opacity: 0, x: 100, transition: { duration: 0.08 } },
      }
    : {
        enter: {
          x: 0,
          opacity: 1,
          transition: {
            x: { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] },
            opacity: { duration: 0.32 },
          },
        },
        exit: {
          x: 100,
          opacity: 0,
          transition: { x: { duration: 0.22, ease: "easeOut" }, opacity: { duration: 0.16 } },
        },
      };

  const scrimTransition = prefersReducedMotion
    ? {
        enter: { opacity: 1, transition: { duration: 0.12 } },
        exit: { opacity: 0, transition: { duration: 0.08 } },
      }
    : {
        enter: { opacity: 1, transition: { duration: 0.18 } },
        exit: { opacity: 0, transition: { duration: 0.16 } },
      };

  const focusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && focusRef.current) {
      focusRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-ink-900/40"
        initial="exit"
        animate="enter"
        exit="exit"
        variants={scrimTransition}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={topNavContent.mobileMenuLabel}
        className="fixed top-0 right-0 z-50 h-full w-[min(360px,85vw)] bg-white border-l border-ink-100 shadow-card"
        initial="exit"
        animate="enter"
        exit="exit"
        variants={drawerTransition}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-6 border-b border-ink-100">
            <span className="text-base font-semibold tracking-tight text-ink-900">
              {topNavContent.brand}
            </span>
            <button
              ref={focusRef}
              onClick={onClose}
              className="h-11 w-11 flex items-center justify-center rounded-lg text-ink-700 hover:text-ink-900 hover:bg-ink-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
              aria-label={topNavContent.mobileMenuCloseLabel}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav className="space-y-1">
              <div className="space-y-1" role="none">
                {topNavContent.nav.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="block px-2 py-3 text-base font-medium text-ink-700 hover:text-primary-500 hover:bg-ink-50 rounded-lg"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="mt-6 pt-6 border-t border-ink-100 space-y-3">
              <GhostLink href="#" />
              <OutlinedPill href="#">{topNavContent.contactSales}</OutlinedPill>
              <PrimaryPill href="#">{topNavContent.startCta}</PrimaryPill>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
