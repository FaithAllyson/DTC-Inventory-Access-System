/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C1121F', // custom red
          light: '#FFD6DB',  // soft red tint
          dark: '#8B0C16',   // dark red
        },
        secondary: {
          DEFAULT: '#162C49', // custom blue
          light: '#E3E8F4',  // soft blue tint
          dark: '#0D1A2B',   // dark blue
        },
      },
    },
  },
  plugins: [],
} 