/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        gradient: {
          purple: '#7b2ff7',
          pink: '#ff4f9a',
        }
      },
    },
  },
  plugins: [],
}
