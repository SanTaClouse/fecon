import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "Módulo"
        grafito: { DEFAULT: "#211E1A", 900: "#191713" },
        blanco: "#FAF6EE",
        lino: { DEFAULT: "#E4DDD0", 2: "#EDE7DB" },
        bronce: { DEFAULT: "#8A6E3C", light: "#A2823F" },
        niebla: "#9C958B",
        muted: "#736C61",
        texto: "#2C2924",
      },
      fontFamily: {
        // mapeadas a las CSS vars de next/font (ver app/layout.tsx)
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-text)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        "2xl": "16px",
      },
      boxShadow: {
        wa: "0 6px 20px rgba(33,30,26,0.18)",
      },
      keyframes: {
        "fecon-rise": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fecon-rise": "fecon-rise .7s cubic-bezier(.2,.7,.2,1) both",
        "accordion-down": "accordion-down .4s cubic-bezier(.2,.7,.2,1)",
        "accordion-up": "accordion-up .4s cubic-bezier(.2,.7,.2,1)",
      },
    },
  },
  plugins: [],
};

export default config;
