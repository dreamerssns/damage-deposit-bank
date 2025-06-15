// tailwind.config.js
module.exports = {
  // Paths to all of your pages and components
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1C8EC4",
        secondary: "#ADCF56",
        navy: "#131736",
        accent: "#2c406e",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Inter", "Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [
    // e.g. require('@tailwindcss/forms'), require('@tailwindcss/typography'), etc.
  ],
};
