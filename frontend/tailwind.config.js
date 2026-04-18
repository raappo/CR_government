/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        civic: {
          50: '#edf7f5',
          100: '#d3ede8',
          200: '#a7dbd0',
          300: '#6dc1b1',
          400: '#3aa191',
          500: '#1d8476',
          600: '#166a60',
          700: '#14564e',
          800: '#13463f',
          900: '#123a35'
        },
        ink: {
          50: '#f5f7fb',
          100: '#edf1f7',
          200: '#dbe3ee',
          300: '#bcccdc',
          400: '#98abc2',
          500: '#7890ac',
          600: '#5f7692',
          700: '#4c5f77',
          800: '#414f62',
          900: '#394351'
        }
      },
      boxShadow: {
        civic: '0 18px 48px rgba(15, 35, 60, 0.12)'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Manrope"', 'sans-serif']
      },
      backgroundImage: {
        'civic-grid':
          'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
