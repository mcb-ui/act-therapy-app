/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        'midnight-purple': {
          DEFAULT: '#784A9F',
          50: '#F3EDF7',
          100: '#E7DCEF',
          200: '#CFB9DF',
          300: '#B796CF',
          400: '#9F73BF',
          500: '#784A9F',
          600: '#603B7F',
          700: '#482C5F',
          800: '#301D40',
          900: '#180F20',
        },
        'electric-blue': {
          DEFAULT: '#2344E7',
          50: '#EDF0FD',
          100: '#DBE1FB',
          200: '#B7C3F7',
          300: '#93A5F3',
          400: '#6F87EF',
          500: '#2344E7',
          600: '#1C36B9',
          700: '#15298B',
          800: '#0E1B5C',
          900: '#070E2E',
        },
        'inferno-red': {
          DEFAULT: '#EC4625',
          50: '#FDEEE9',
          100: '#FBDDD3',
          200: '#F7BBA7',
          300: '#F3997B',
          400: '#EF774F',
          500: '#EC4625',
          600: '#BD381E',
          700: '#8E2A16',
          800: '#5F1C0F',
          900: '#2F0E07',
        },
        // Secondary Colors
        'brand-pink': {
          DEFAULT: '#FE97BB',
          50: '#FFF5F9',
          100: '#FFEBF3',
          200: '#FED7E7',
          300: '#FEC3DB',
          400: '#FEADCF',
          500: '#FE97BB',
          600: '#CB7996',
          700: '#985B71',
          800: '#663C4C',
          900: '#331E26',
        },
        'lime-green': {
          DEFAULT: '#93F357',
          50: '#F6FEF0',
          100: '#EDFDE1',
          200: '#DBFBC3',
          300: '#C9F9A5',
          400: '#B7F787',
          500: '#93F357',
          600: '#76C246',
          700: '#599234',
          800: '#3C6123',
          900: '#1E3111',
        },
        'parchment': {
          DEFAULT: '#F5EABF',
          50: '#FEFDFB',
          100: '#FDF9F3',
          200: '#FBF4E7',
          300: '#F9EFDB',
          400: '#F7EACF',
          500: '#F5EABF',
          600: '#C4BB99',
          700: '#938C73',
          800: '#625E4C',
          900: '#312F26',
        },
      },
      fontFamily: {
        'header': ['Montserrat', 'sans-serif'], // Alternative to Commuter Sans
        'alt-header': ['Playfair Display', 'serif'], // Alternative to Bookmania
        'subheader': ['Inter', 'sans-serif'], // Alternative to Stratos
        'body': ['Archivo', 'sans-serif'], // Archivo is available on Google Fonts
      },
    },
  },
  plugins: [],
}
