/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Using Slate for neutral grays
        // Customizing financial colors
        income: {
          light: '#dcfce7', // green-100
          DEFAULT: '#22c55e', // green-500
          dark: '#15803d', // green-700
        },
        expense: {
          light: '#fee2e2', // red-100
          DEFAULT: '#ef4444', // red-500
          dark: '#b91c1c', // red-700
        }
      },
      fontFamily: {
        sans: ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
