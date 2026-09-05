/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme background layers (from specifications)
        base:         '#0F172A',
        surface:      '#1E293B',
        card:         '#1E293B',
        'card-hover': '#243248',
        background:   '#0F172A',

        // Explicit bg- prefixes for compatibility
        'bg-base':    '#0F172A',
        'bg-surface': '#1E293B',
        'bg-card':    '#1E293B',
        'bg-card-hover': '#243248',

        // Primary (cyan/sky blue)
        primary: {
          50:      '#f0f9ff',
          100:     '#e0f2fe',
          light:   '#7DD3FC',
          DEFAULT: '#38BDF8',
          dark:    '#0EA5E9',
          400:     '#38BDF8',
          500:     '#38BDF8',
          600:     '#0EA5E9',
          700:     '#0284c7',
        },

        // Secondary (violet/purple)
        secondary: {
          light:   '#A78BFA',
          DEFAULT: '#8B5CF6',
          dark:    '#7C3AED',
          400:     '#A78BFA',
          500:     '#8B5CF6',
          600:     '#7C3AED',
        },

        // Text colors on dark bg
        'text-primary':   '#F8FAFC',
        'text-secondary': '#94A3B8',
        'text-muted':     '#64748B',

        muted: '#64748B',

        // Border
        border: 'rgba(255,255,255,0.12)',
        'border-subtle': 'rgba(255,255,255,0.08)',

        // Gradient stops
        gradient: {
          cyan:   '#38BDF8',
          violet: '#8B5CF6',
          purple: '#8B5CF6',
          pink:   '#EC4899',
        },
      },
      backgroundImage: {
        'nav-gradient': 'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)',
        'auth-gradient': 'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)',
        'primary-gradient': 'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)',
        'hover-gradient': 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)',
      },
    },
  },
  plugins: [],
}
