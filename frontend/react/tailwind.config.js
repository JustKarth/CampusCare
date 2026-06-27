/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        card: '#1E293B',
        primary: {
          DEFAULT: '#38BDF8',
          light: '#7DD3FC',
          dark: '#0EA5E9',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)',
        'gradient-hover': 'linear-gradient(135deg, #0EA5E9 0%, #7C3AED 100%)',
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease',
        'slide-in': 'slideIn 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
