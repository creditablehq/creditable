module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#3C7AFF', // Main primary color
          dark: '#1E40AF',
          light: '#E7F0FF',
        },
        neutral: {
          100: '#F8F9FB',
          900: '#1F2937',
        },
        fontFamily: {
          sans: ['InterVariable', 'ui-sans-serif', 'system-ui'],
        },
      },
    },
  },
  plugins: [],
};
