/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme background layers
        base:         '#0d1117',
        surface:      '#151c2c',
        card:         '#1a2235',
        'card-hover': '#1f2a40',
        background:   '#0d1117',

        // Explicit bg- prefixes for backwards compatibility
        'bg-base':    '#0d1117',
        'bg-surface': '#151c2c',
        'bg-card':    '#1a2235',
        'bg-card-hover': '#1f2a40',

        // Primary purple accent
        primary: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#7b2ff7',
          600: '#6d28d9',
          700: '#5b21b6',
          DEFAULT: '#7b2ff7',
        },

        // Text colors on dark bg
        'text-primary':   '#f0f4ff',
        'text-secondary': '#8b9ab5',
        'text-muted':     '#64748b',

        secondary: '#8b9ab5',
        muted:     '#64748b',

        // Border
        border: 'rgba(255,255,255,0.1)',
        'border-subtle': 'rgba(255,255,255,0.08)',

        // Gradient stops (for nav)
        gradient: {
          purple: '#7b2ff7',
          blue:   '#2196f3',
          pink:   '#ff4f9a',
        },
      },
      backgroundImage: {
        'nav-gradient': 'linear-gradient(135deg, #7b2ff7 0%, #2563eb 60%, #38bdf8 100%)',
        'auth-gradient': 'linear-gradient(135deg, #7b2ff7, #ff4f9a)',
      },
    },
  },
  plugins: [],
}
