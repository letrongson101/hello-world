import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        luck: {
          red: "#B91C1C",
          gold: "#F59E0B"
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
