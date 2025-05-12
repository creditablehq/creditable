// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#059669',      // emerald-600
          dark: '#047857',         // emerald-700
          light: '#D1FAE5',        // emerald-100
        },
        neutral: {
          100: '#F3F4F6',          // gray-100
          900: '#111827',          // gray-900
        },
      },
      fontFamily: {
        sans: ['InterVariable', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
