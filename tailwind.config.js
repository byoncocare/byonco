/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      // You can extend fonts, colors, etc. here
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
