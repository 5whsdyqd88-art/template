"use client";

interface GhostLinkProps {
  href: string;
}

export default function GhostLink({ href }: GhostLinkProps) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center text-sm font-semibold text-ink-900 hover:text-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      aria-label="Sign in"
    >
      Sign in
    </a>
  );
}
