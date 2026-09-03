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
        background: "#05070A", // The Void - deep, near-black
        card: "#0A0D12",       // Subtle elevation
        border: "#1A1F26",     // Ghost borders
        primary: "#60A5FA",    // Electric Blue Accent
        success: "#22C55E",    // Green
        warning: "#F59E0B",    // Orange
        error: "#EF4444",      // Red
        foreground: "#F8FAFC", // High contrast off-white
        muted: "#64748B",      // Steel gray
        surface: "#0F1218",    // Subtle surface elevation
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
