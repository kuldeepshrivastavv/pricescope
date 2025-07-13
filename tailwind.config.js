/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7F1DFF',
        secondary: '#FF1D89',
        accent: '#00FFD0',
      },
      backgroundImage: {
        'crazy-gradient': 'linear-gradient(90deg, #7F1DFF 0%, #FF1D89 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
