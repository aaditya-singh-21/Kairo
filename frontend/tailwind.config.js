/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F4F4F2',
        pitch: '#0A0A0A',
        blueprint: '#0044FF',
        orange: '#FF4400',
        'pitch-80': 'rgba(10,10,10,0.8)',
        'pitch-40': 'rgba(10,10,10,0.4)',
        'pitch-10': 'rgba(10,10,10,0.1)',
        'pitch-5': 'rgba(10,10,10,0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Now', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'Geist Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        'ultra-tight': '-0.06em',
        'ultra-tightest': '-0.08em',
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'grid-pulse': 'gridpulse 4s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        gridpulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
