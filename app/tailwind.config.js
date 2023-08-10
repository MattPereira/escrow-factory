/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        cubano: ["cubano", "sans-serif"],
        gothic: ["didact gothic", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
