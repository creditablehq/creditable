// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F59E0B',      // amber-500
          dark: '#D97706',         // amber-600
          light: '#FEF3C7',        // amber-100
        },
        neutral: {
          100: '#FFFBEB',          // yellow-50 / soft
          900: '#1F2937',          // slate-900
        },
      },
      fontFamily: {
        sans: ['InterVariable', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
