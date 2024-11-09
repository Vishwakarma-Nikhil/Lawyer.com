/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        gray: {
          50: "#f9f9f9", // very light gray
          100: "#e0e0e0", // light gray
          200: "#b3b3b3", // medium light gray
          500: "#808080", // standard gray
          600: "#4d4d4d", // dark gray
          900: "#1a1a1a", // near-black gray
        },
      },
      backgroundColor: {
        black: "#000000", // black background
      },
    },
  },
  plugins: [],
};
