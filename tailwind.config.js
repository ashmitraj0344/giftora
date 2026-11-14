/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#FAF8F3",
          light: "#FFFDF9",
          dark: "#F0ECE1",
        },
        burgundy: {
          DEFAULT: "#702C3B",
          dark: "#541F2B",
          light: "#8B384A",
          muted: "#9D4B5C",
        },
        gold: {
          DEFAULT: "#C6A46A",
          dark: "#B38E55",
          light: "#D8BC88",
          shimmer: "#E7CE9D",
        },
        beige: {
          DEFAULT: "#EDE5D8",
          light: "#F7F3EC",
          dark: "#DCCFBD",
        },
        charcoal: {
          DEFAULT: "#252323",
          light: "#3A3636",
          dark: "#171515",
          muted: "#666161",
        },
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(112, 44, 59, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
        "premium-hover": "0 20px 40px -15px rgba(112, 44, 59, 0.15), 0 8px 12px -4px rgba(0, 0, 0, 0.04)",
        gold: "0 4px 20px rgba(198, 164, 106, 0.25)",
      },
    },
  },
  plugins: [],
};
