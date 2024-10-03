/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FFC700",
          dark: "#FAAD14",
          light: "#FFE552",
        },
        black: {
          DEFAULT: "#000000",
          950: "#212121",
          900: "#3D3D3D",
          800: "#454545",
          700: "#4F4F4F",
          600: "#5D5D5D",
          500: "#6D6D6D",
          400: "#888888",
          300: "#B0B0B0",
          200: "#D1D1D1",
          100: "#E7E7E7",
          50: "#F6F6F6",
          0: "#FFFFFF",
        },
        light: "#EDECE4",
        alert: "#D14D28",
      },
      fontFamily: {
        lobster: ["Lobster", "sans-serif"],
        huninn: ["FakePearl-Regular", "Noto Sans TC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
