/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6'
        }
      }
    }
  },
  plugins: []
};

