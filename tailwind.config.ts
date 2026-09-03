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
        background: "#0B0F14", // Modern SaaS Dark
        card: "#131A22",       // Card background
        border: "#1D2632",     // Card border
        primary: "#3B82F6",    // Accent Blue
        success: "#22C55E",    // Accent Green
        warning: "#F59E0B",    // Accent Orange
        error: "#EF4444",      // Accent Red
        foreground: "#FFFFFF", // Primary Text
        muted: "#8B95A7",      // Secondary Text
        surface: "#1A222C",    // Slightly lighter surface
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
