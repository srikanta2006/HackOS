/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          50: '#fff5f5',
          100: '#ffe5e6',
          200: '#ffccd0',
          300: '#ff99a0',
          400: '#ff4d5a',
          500: '#E50914',
          600: '#b80710',
          700: '#91050a',
          800: '#6b0306',
          900: '#450102',
          950: '#1a0000',
        },
        blue: {
          50: '#f9f9f9',
          100: '#f1f1f1',
          200: '#e1e1e1',
          300: '#cfcfcf',
          400: '#a3a3a3',
          500: '#1f1f1f',
          600: '#141414',
          700: '#0f0f0f',
          800: '#0a0a0a',
          900: '#050505',
          950: '#000000',
        },
        purple: {
          50: '#fff5f5',
          100: '#ffe5e6',
          200: '#ffccd0',
          300: '#ff99a0',
          400: '#ff4d5a',
          500: '#E50914',
          600: '#b80710',
          700: '#91050a',
          800: '#6b0306',
          900: '#450102',
          950: '#1a0000',
        },
        netflix: {
          red: '#E50914',
          darkRed: '#b80710',
          black: '#141414',
          card: '#181818',
          text: '#e5e5e5',
        }
      }
    },
  },
  plugins: [],
}