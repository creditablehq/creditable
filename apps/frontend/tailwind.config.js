module.exports = {
  darkMode: 'class', // for toggling dark mode via `class="dark"`
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'hsl(var(--color-brand))',
          dark: 'hsl(var(--color-brand-dark))',
          light: 'hsl(var(--color-brand-light))',
        },
        neutral: {
          100: 'hsl(var(--color-neutral-100))',
          900: 'hsl(var(--color-neutral-900))',
        },
        muted: {
          100: 'hsl(var(--color-muted-100))',
          900: 'hsl(var(--color-muted-900))',
        },
      },
      fontFamily: {
        sans: ['InterVariable', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
