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
        secondaryLight: '#FAAA8D',
        tertiary: '#F2E8CF',
        cream: '#F5EFE4',
        ink: '#1F1614',
        muted: '#3E2021',
        peach: '#FAAA8D',
        accent: '#FAAA8D',
        stone: '#655D59',
        parchment: '#F2E8CF',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Raleway', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        raleway: ['Raleway', 'sans-serif'],
        gravity: ['Gravity', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.22em',
        nav: '0.18em',
        cta: '0.16em',
        display: '-0.03em',
        widest2: '0.18em',
        widest3: '0.22em',
      },
    },
  },
  plugins: [],
}
