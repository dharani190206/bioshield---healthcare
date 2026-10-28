/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#38a5f8',
          500: '#0e87eb',
          600: '#026bc9',
          700: '#0355a2',
          800: '#074885',
          900: '#0b3d6f',
          950: '#07264a',
        },
        risk: {
          low: '#10b981',      // emerald green
          medium: '#f59e0b',   // amber
          high: '#ef4444',     // red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'wave': 'wave 2s infinite ease-in-out',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.15)', opacity: '0.4' },
        }
      }
    },
  },
  plugins: [],
}
