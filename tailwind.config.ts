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
        background: "#020617", // Slate 950 - Deep midnight navy
        card: "#0F172A",       // Slate 900 - Sophisticated deep blue
        primary: "#38BDF8",    // Sky 400 - Electric Blue for action
        secondary: "#94A3B8",  // Slate 400 - Professional grey
        foreground: "#F8FAFC", // Slate 50 - Crisp white
        accent: "#818CF8",     // Indigo 400 - Premium accent
        muted: "#475569",      // Slate 600 - Muted data
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
