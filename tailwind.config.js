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
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        lora: ['Lora', 'serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
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
