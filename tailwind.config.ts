import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        charcoal: {
          DEFAULT: "#121212",
          50: "#1e1e1e",
          100: "#1a1a1a",
          200: "#161616",
          300: "#121212",
          400: "#0e0e0e",
          500: "#0a0a0a",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          hover: "rgba(255, 255, 255, 0.07)",
          border: "rgba(255, 255, 255, 0.08)",
          "border-hover": "rgba(255, 255, 255, 0.14)",
        },
        electric: {
          DEFAULT: "#00B4FF",
          50: "rgba(0, 180, 255, 0.1)",
          100: "rgba(0, 180, 255, 0.2)",
          200: "rgba(0, 180, 255, 0.4)",
          500: "#00B4FF",
          600: "#0090CC",
          glow: "rgba(0, 180, 255, 0.35)",
        },
        emerald: {
          accent: "#00E5A0",
          "accent-glow": "rgba(0, 229, 160, 0.25)",
        },
        amber: {
          accent: "#F5A623",
          "accent-glow": "rgba(245, 166, 35, 0.25)",
        },
        rose: {
          accent: "#FF4D6A",
          "accent-glow": "rgba(255, 77, 106, 0.25)",
        },
      },
      spacing: {
        // 4pt grid system
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "9": "36px",
        "10": "40px",
        "12": "48px",
        "14": "56px",
        "16": "64px",
        "18": "72px",
        "20": "80px",
        "24": "96px",
        "28": "112px",
        "32": "128px",
      },
      letterSpacing: {
        "widest-2": "0.2em",
        "widest-3": "0.3em",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass-lg": "0 24px 64px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        electric: "0 0 20px rgba(0, 180, 255, 0.4), 0 0 60px rgba(0, 180, 255, 0.15)",
        "electric-sm": "0 0 10px rgba(0, 180, 255, 0.3)",
        emerald: "0 0 20px rgba(0, 229, 160, 0.35)",
        amber: "0 0 20px rgba(245, 166, 35, 0.35)",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        DEFAULT: "12px",
        md: "16px",
        lg: "24px",
        xl: "40px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        shimmer: "shimmer 2.5s infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        shimmer: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
      },
      backgroundSize: {
        "grid-sm": "24px 24px",
        "grid-md": "32px 32px",
        "200%": "200%",
      },
    },
  },
  plugins: [],
};

export default config;
