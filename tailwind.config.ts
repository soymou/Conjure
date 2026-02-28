import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0b",
        surface: "#121214",
        "surface-2": "#1a1a1f",
        "surface-3": "#242429",
        border: "#1f1f26",
        "border-hover": "#3a3a42",
        fg: "#ffffff",
        "fg-2": "#b0b0ba",
        "fg-3": "#808088",
        "fg-4": "#4a4a52",
        accent: "#ff5757",
        "accent-2": "#ff4444",
        "accent-3": "#ff3333",
        "accent-muted": "#ff6b6b",
        glow: "rgba(255, 87, 87, 0.2)",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', '"SF Mono"', "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(ellipse 60% 50% at 50% -20%, rgba(255, 87, 87, 0.25), transparent)",
        "card-glow": "radial-gradient(ellipse at center, rgba(255, 87, 87, 0.1), transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 87, 87, 0.15)",
        "glow-lg": "0 0 40px rgba(255, 87, 87, 0.2)",
        "card": "0 1px 3px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 8px 20px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 87, 87, 0.12)",
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "slide-in-left": "slide-in-left 0.25s ease-out both",
        "scale-in": "scale-in 0.25s ease-out both",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
