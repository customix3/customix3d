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
          300: '#99f6e4',
          400: '#5eead4',
          500: '#2dd4bf',
          600: '#14b8a6',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        coral: {
          400: '#fb7185',
          500: '#f43f5e',
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
        'glow-mint': '0 0 40px -8px rgba(45, 212, 191, 0.5)',
        'glow-violet': '0 0 36px -6px rgba(139, 92, 246, 0.45)',
      },
      backgroundImage: {
        mesh:
          'radial-gradient(at 20% 20%, rgba(240,90,26,0.14) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(45,212,191,0.12) 0px, transparent 40%), radial-gradient(at 50% 90%, rgba(139,92,246,0.08) 0px, transparent 45%)',
        'hero-glow':
          'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(240,90,26,0.18), transparent), radial-gradient(ellipse 50% 40% at 90% 30%, rgba(45,212,191,0.12), transparent), radial-gradient(ellipse 40% 30% at 10% 70%, rgba(139,92,246,0.1), transparent)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 1.2s infinite',
        'spin-slow': 'spin 18s linear infinite',
        shimmer: 'shimmer 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'blob': 'blob 12s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(18px, -22px) scale(1.08)' },
          '66%': { transform: 'translate(-16px, 12px) scale(0.94)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
