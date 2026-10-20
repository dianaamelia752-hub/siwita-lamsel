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
        primary: {
          DEFAULT: "#1F4E79",
          dark: "#163A5C",
          light: "#2980B9",
          50: "#f0f6fb",
          100: "#dbeaf6",
          500: "#1F4E79",
          600: "#183e60",
          700: "#163A5C",
        },
        success: {
          DEFAULT: "#2E7D32",
          50: "#e8f5e9",
          100: "#c8e6c9",
          600: "#2E7D32",
        },
        warning: {
          DEFAULT: "#F9A825",
          50: "#fffde7",
          100: "#fff9c4",
          600: "#F9A825",
        },
        error: {
          DEFAULT: "#C62828",
          50: "#ffebee",
          100: "#ffcdd2",
          600: "#C62828",
        },
        govbg: "#F8FAFC",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
