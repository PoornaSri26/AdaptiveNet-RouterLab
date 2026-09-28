/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Gold theme colors
        gold: {
          50: '#FFFEF0',
          100: '#FFFAE0',
          200: '#FFF5C0',
          300: '#FFEDA0',
          400: '#FFE080',
          500: '#FFD700',
          600: '#E6C200',
          700: '#CCA300',
          800: '#B38900',
          900: '#997000',
          950: '#7A5A00',
        },
        // Dark theme colors
        dark: {
          bg: '#0a0a0a',
          bg2: '#1a1a2e',
          bg3: '#16213e',
          surface: '#0f0f1a',
          border: 'rgba(255, 215, 0, 0.2)',
        },
        // Light theme colors
        light: {
          bg: '#ffffff',
          bg2: '#f8f9fa',
          bg3: '#e9ecef',
          surface: '#ffffff',
          border: 'rgba(0, 0, 0, 0.1)',
        },
        // Graph state colors
        graph: {
          visited: '#4ade80',
          frontier: '#fbbf24',
          path: '#FFD700',
          failed: '#ef4444',
          negative: '#f97316',
          active: '#3b82f6',
        },
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(255, 215, 0, 0.3)',
        'gold-lg': '0 0 40px rgba(255, 215, 0, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-in',
        'slide-in': 'slide-in 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 0.5s ease-in-out',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' },
        },
        'fade-in': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          'from': { opacity: '0', transform: 'translateX(-20px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
