/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-orange': '#FFAB76', // Define your pastel orange color
      },
    },
  },
  plugins: [],
}
