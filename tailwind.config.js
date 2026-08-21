/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e8e0d4',
          300: '#d4c8b5',
        },
        brand: {
          50: '#fff5f0',
          100: '#ffe8dc',
          200: '#ffd0b8',
          300: '#ffb088',
          400: '#ff8a4c',
          500: '#f05a1a',
          600: '#d9430f',
          700: '#b4340f',
          800: '#912c14',
          900: '#762814',
        },
        ink: {
          900: '#12100e',
          800: '#1c1916',
          700: '#2e2924',
          600: '#4a433c',
          500: '#6b635a',
        },
        mint: {
          400: '#5eead4',
          500: '#2dd4bf',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Syne', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 50px -20px rgba(18, 16, 14, 0.25)',
        card: '0 8px 30px -10px rgba(18, 16, 14, 0.12)',
        glow: '0 0 40px -8px rgba(240, 90, 26, 0.45)',
      },
      backgroundImage: {
        'mesh':
          'radial-gradient(at 20% 20%, rgba(240,90,26,0.12) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(45,212,191,0.1) 0px, transparent 40%), radial-gradient(at 50% 90%, rgba(240,90,26,0.08) 0px, transparent 45%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
