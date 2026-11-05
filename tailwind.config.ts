import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      transitionTimingFunction: {
        "spring-tactile": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
      keyframes: {
        "value-shimmer": {
          "0%": { transform: "scale(1)", filter: "brightness(1)" },
          "35%": { transform: "scale(1.09)", filter: "brightness(1.4)" },
          "100%": { transform: "scale(1)", filter: "brightness(1)" },
        },
        "ripple-feedback": {
          "0%": { transform: "scale(0.88)", opacity: "0.6" },
          "50%": { transform: "scale(1.12)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "critical-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 8px rgba(244, 63, 94, 0.4)",
            filter: "brightness(1)",
          },
          "50%": {
            boxShadow: "0 0 18px rgba(244, 63, 94, 0.95)",
            filter: "brightness(1.35)",
          },
        },
      },
      animation: {
        "value-shimmer": "value-shimmer 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "ripple-feedback": "ripple-feedback 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "critical-pulse": "critical-pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
