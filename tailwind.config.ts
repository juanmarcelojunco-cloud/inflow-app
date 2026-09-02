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
        background: "#050505", // True Black
        card: "#0F0F12",       // Deep Obsidian
        primary: "#C5A059",    // Champagne Gold (Signature Element)
        secondary: "#8E8E93",  // Slate Grey
        foreground: "#E5E5E5", // Soft White
        muted: "#666666",      // Muted Grey
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Geist Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
