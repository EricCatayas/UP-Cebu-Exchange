/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // TODO: change styling configuration
      colors: {
        primary: '#8E1537',
        secondary: '#FF6F00',
        tertiary: '#FAAF40',
        confirmed: '#94FFAB',
        pending: '#fde047',
        completed: '#93c5fd',
        cancelled: '#fca5a5',
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
      },
      keyframes: {
        slide: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        slidein: {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideright: {
          from: {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
      animation: {
        slide: 'slide 2s linear infinite',
        slidein: 'slidein 1s ease var(--slide-delay, 0) forwards',
        slideright: 'slideright 1s ease var(--slide-delay, 0) forwards',
      },
    },
  },
  safelist: [
    'bg-completed',
    'text-completed',
    'bg-pending',
    'text-pending',
    'bg-confirmed',
    'text-confirmed',
    'bg-cancelled',
    'text-cancelled',
  ],
  plugins: [],
};
