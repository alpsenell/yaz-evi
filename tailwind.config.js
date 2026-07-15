/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand refresh palette
        cream: '#FAF8F3',
        ink: '#16323C',
        inkDeep: '#12272E',
        azure: '#2F6E86',
        azureSoft: '#8FB4C1',
        gold: '#C9B58C',
        sand: '#E2D8C4',
        sandLight: '#EFE7D6',
        sandFill: '#E7DCC8',
        parchment: '#f3efe6',
        slate: '#4a5b5e',
        stone: '#9a9488',
        // Legacy aliases (checkout / confirmation still reference these)
        primary: '#2F6E86',
        secondaryDark: '#16323C',
        secondaryLight: '#C9B58C',
        tertiary: '#FAF8F3',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        jost: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
