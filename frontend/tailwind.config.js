/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Orbitron', 'monospace'],
      },
      colors: {
        'cyber': {
          'cyan': '#00ffff',
          'blue': '#0080ff',
          'purple': '#8000ff',
          'green': '#00ff00',
          'red': '#ff0000',
          'yellow': '#ffff00',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 0.1s linear infinite',
        'flicker': 'flicker 0.15s infinite linear',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff' },
          '100%': { boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff' },
        },
        scan: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(4px)' },
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '1' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}
