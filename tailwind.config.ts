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
        background: "#0A0A0C", // Negro obsidian profundo
        card: "#121216",       // Gris carbón pulido
        primary: "#10B981",    // Verde esmeralda
        secondary: "#D97706",  // Latón / Ámbar
        foreground: "#F4F4F5", // Crema muy claro
        muted: "#A1A1AA",      // Gris pizarra
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
