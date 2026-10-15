/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        mono: [
          'ui-monospace', 'SFMono-Regular', '"SF Mono"', 'Menlo',
          'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace',
        ],
      },
      animation: {
        'blink':    'blink 1.1s step-start infinite',
        'fade-in':  'fadeIn 0.2s ease-out both',
        'slide-up': 'slideUp 0.25s ease-out both',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.15' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
