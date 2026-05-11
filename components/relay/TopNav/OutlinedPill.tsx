"use client";

interface OutlinedPillProps {
  href: string;
  children: React.ReactNode;
}

export default function OutlinedPill({ href, children }: OutlinedPillProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center h-9 rounded-full px-4 text-sm font-semibold border border-ink-200 text-ink-900 transition-colors hover:border-ink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
    >
      {children}
    </a>
  );
}
