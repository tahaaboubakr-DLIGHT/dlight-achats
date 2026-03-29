/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: { extend: { colors: { dlight: { DEFAULT: "#0F6E56", light: "#E8F5E9", dark: "#085041" } } } },
  plugins: [],
};
