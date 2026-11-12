/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './*.html',
    './pages/**/*.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4E7B8C',
          dark: '#3D6675',
          light: '#6B96A8'
        },
        accent: {
          DEFAULT: '#E05A2B',
          hover: '#C4471B',
          light: '#F27A52'
        },
        sand: {
          DEFAULT: '#D4BC94',
          light: '#E6D7BE',
          dark: '#BCA073'
        },
        cream: {
          DEFAULT: '#E5EEF3',
          light: '#F0F5F8',
          dark: '#D6E4ED'
        },
        ink: {
          DEFAULT: '#1F2733',
          muted: '#4B5563',
          light: '#6B7280'
        }
      },
      fontFamily: {
        heading: ['"Outfit"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      minHeight: {
        touch: '44px'
      },
      minWidth: {
        touch: '44px'
      }
    }
  },
  plugins: []
}
