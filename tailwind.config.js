/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", "sans-serif"],
      },
      colors: {
        // Override default “white” to a 10%-opaque #186873
        white: 'rgba(24, 104, 115, 0.1)',
        brand: {
          50:  "#f3faf7",
          100: "#daf3e6",
          300: "#8fdfb6",
          500: "#186873",
          700: "#047857",
          900: "#014d3a",
        },
        neutral: {
          100: "#f9fafb",
          300: "#d1d5db",
          500: "#6b7280",
          700: "#374151",
          900: "#111827",
        },
      },
      fontSize: {
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    }
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
