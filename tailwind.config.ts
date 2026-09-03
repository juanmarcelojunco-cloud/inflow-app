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
        background: "#020617", // Deep Midnight Navy
        card: "#0F172A",       // Sophisticated deep blue
        primary: "#0EA5E9",    // Electric Blue
        secondary: "#64748B",  // Professional Slate
        foreground: "#F8FAFC", // Titanium White
        accent: "#6366F1",     // Premium Indigo
        surface: "#1E293B",    // Slate 800 for depth
        muted: "#475569",      // Slate 600
        border: "rgba(255, 255, 255, 0.08)",
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
