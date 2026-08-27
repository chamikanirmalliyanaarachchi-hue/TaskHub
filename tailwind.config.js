import type { Config } from "tailwindcss";

/**
 * Tailwind CSS configuration for TaskHub — Creative Overhaul
 * --------------------------------------------------------------------------
 * Adds, on top of the existing semantic tokens:
 *  - `bg-holo` : a soft, pastel iridescent mesh gradient (light-mode safe).
 *  - Keyframes/animations for the slow holographic drift, a pulsating gradient
 *    "Ask AI" pill, an animated gradient text shimmer, and float.
 *  - Layered glow box-shadows used for the 3D / glass depth.
 *  (The 3D cursor-tilt itself is driven by Framer Motion in the components.)
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Per-category accent tokens (used lightly in light mode).
        services: {
          garage: "#10B981",
          electronics: "#06B6D4",
          furniture: "#A855F7",
          smartHome: "#F59E0B",
          cleaning: "#F43F5E",
          moving: "#3B82F6",
        },
        // Soft pastel palette for the flowing CTA gradient.
        pastel: {
          pink: "#FBCFE8",
          lavender: "#C7D2FE",
          mint: "#CCFBF1",
          periwinkle: "#E0E7FF",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // Vibrant (dark) mesh — kept for overlays / hero accents.
        "mesh-gradient":
          "radial-gradient(at 18% 22%, hsl(var(--mesh-1)) 0px, transparent 50%), radial-gradient(at 82% 8%, hsl(var(--mesh-2)) 0px, transparent 50%), radial-gradient(at 4% 82%, hsl(var(--mesh-3)) 0px, transparent 50%), radial-gradient(at 84% 78%, hsl(var(--mesh-4)) 0px, transparent 50%)",
        // Soft pastel holographic mesh (the page background).
        holo:
          "radial-gradient(at 18% 20%, rgba(167,139,250,0.28) 0px, transparent 50%), radial-gradient(at 82% 12%, rgba(45,212,191,0.24) 0px, transparent 50%), radial-gradient(at 12% 82%, rgba(244,114,182,0.22) 0px, transparent 50%), radial-gradient(at 86% 84%, rgba(96,165,250,0.24) 0px, transparent 50%)",
      },
      boxShadow: {
        "glow-sm": "0 0 20px -8px hsl(var(--primary) / 0.45)",
        glow: "0 0 45px -12px hsl(var(--primary) / 0.6)",
        "glow-lg": "0 0 70px -10px hsl(var(--primary) / 0.7)",
        "glass-lg": "0 20px 50px -12px rgba(15,23,42,0.18)",
      },
      keyframes: {
        "mesh-shift": {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(4%, -3%) scale(1.06)" },
          "66%": { transform: "translate(-3%, 4%) scale(0.95)" },
        },
        "holo-shift": {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(-3%, 2%, 0) scale(1.08)" },
        },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 0 0 hsl(var(--primary) / 0.5)", transform: "scale(1)" },
          "50%": { boxShadow: "0 0 28px 4px hsl(var(--primary) / 0.55)", transform: "scale(1.04)" },
        },
        "gradient-pan": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.55", filter: "blur(28px)" },
          "50%": { opacity: "1", filter: "blur(38px)" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        "mesh-shift": "mesh-shift 20s ease-in-out infinite",
        "gradient-shift": "gradient-shift 14s ease infinite",
        holo: "holo-shift 24s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.6s ease-in-out infinite",
        gradient: "gradient-pan 6s linear infinite",
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        shimmer: "shimmer 2.2s infinite",
        "spin-slow": "spin-slow 14s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
