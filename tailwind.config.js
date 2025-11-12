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
      },
    },
  },
  plugins: [],
};
