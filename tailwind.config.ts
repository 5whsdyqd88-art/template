import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#F4F5FF",
          100: "#E8EBFF",
          200: "#D1D6FF",
          300: "#A9B3FF",
          400: "#7E8BFF",
          500: "#5B6CFF",
          600: "#4A58E0",
          700: "#3B46B8",
          800: "#2D358F",
          900: "#1F2457",
        },
        ink: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "SF Mono", "monospace"],
      },
      fontSize: {
        "display-xl": ["3.75rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg": ["3rem",    { lineHeight: "1.1",  letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-md": ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(17,24,39,0.04), 0 8px 24px -12px rgba(17,24,39,0.12)",
        cta:  "0 8px 24px -8px rgba(91,108,255,0.45)",
      },
      transitionDuration: { fast: "150ms", base: "300ms", slow: "500ms" },
      transitionTimingFunction: {
        "ease-out-soft": "cubic-bezier(0.0, 0.0, 0.2, 1)",
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [],
};
export default config;
