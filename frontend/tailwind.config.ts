import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f1115',
          raised: '#161923',
          border: '#242836',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
