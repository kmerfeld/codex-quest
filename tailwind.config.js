/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        springWood: "#F4F5EB",
        zorba: "#9F9B8F",
        seaBuckthorn: "#F9B32A",
        copperRust: "#965247",
        shipGray: "#3E3643",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
