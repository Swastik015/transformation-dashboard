/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'loreal': {
          'burgundy': '#5E0A1F',
          'burgundy-light': '#7A1A33',
          'gold': '#C4A35A',
          'gold-light': '#D4B896',
          'cream': '#FAF8F5',
          'cream-dark': '#F0EDE8',
          'green': '#2E7D32',
          'green-light': '#4CAF50',
          'red': '#C62828',
          'orange': '#EF6C00',
          'text': '#2D2D2D',
          'text-light': '#6B6B6B',
          'text-muted': '#9E9E9E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
