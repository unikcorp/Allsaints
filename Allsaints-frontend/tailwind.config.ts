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
        // Light Blue, White and Soft Yellow Theme
        purple: {
          DEFAULT: "#0875C9",
          dark:    "#092F78",
          hover:   "#0066B5",
          light:   "#EAF6FF",
          subtle:  "#F4FAFF",
          border:  "#D8EAF8",
        },
        maroon: {
          DEFAULT: "#0875C9",
          dark:    "#092F78",
          hover:   "#0066B5",
          light:   "#EAF6FF",
          subtle:  "#F4FAFF",
          border:  "#D8EAF8",
        },
        gold: {
          DEFAULT: "#FFB900",
          hover:   "#E0A300",
          light:   "#FFF9E6",
          accent:  "#FFB900",
        },
        primary: {
          DEFAULT: "#0875C9",
          hover:   "#0066B5",
          light:   "#EAF6FF",
          dark:    "#092F78",
        },
        accent: {
          DEFAULT: "#FFB900",
          hover:   "#E0A300",
          light:   "#FFF9E6",
        },
        school: {
          primary:   "#0875C9",
          secondary: "#0066B5",
          sky:       "#BFE3FF",
          light:     "#EAF6FF",
          pastel:    "#D9EEFF",
          white:     "#FFFFFF",
          section:   "#F4FAFF",
          heading:   "#092F78",
          yellow:    "#FFB900",
          border:    "#D8EAF8",
          green:     "#22B573",
        },
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "serif"],
        sans:  ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        nsk: "0 4px 20px -2px rgba(8, 117, 201, 0.08)",
        "nsk-hover": "0 8px 30px -4px rgba(8, 117, 201, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
