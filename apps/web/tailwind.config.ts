import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { smePink: '#e83e8c', smeBlue: '#1677c8', cream: '#fffaf5' },
      keyframes: {
        ticker: { '0%': { transform: 'translate3d(0, 0, 0)' }, '100%': { transform: 'translate3d(-50%, 0, 0)' } },
        'ticker-reverse': { '0%': { transform: 'translate3d(-50%, 0, 0)' }, '100%': { transform: 'translate3d(0, 0, 0)' } },
      },
      animation: { ticker: 'ticker 35s linear infinite', 'ticker-fast': 'ticker-reverse 25s linear infinite' },
    },
  },
  plugins: [],
} satisfies Config;