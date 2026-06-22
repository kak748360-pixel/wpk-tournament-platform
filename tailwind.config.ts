import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#d4af37",
        dark: "#0b1020",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(212,175,55,0.25), 0 20px 55px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config;
