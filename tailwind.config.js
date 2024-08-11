/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#655d59',
        secondaryDark: '#3E2021',
        secondaryLight: '#FAAA8D'
      }
    },
  },
  plugins: [],
}

