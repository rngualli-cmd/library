/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        'instrument-serif': ['"Instrument Serif"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        terra: {
          navy: '#16294c',
          ink: '#0e1c36',
          green: '#5cb245',
          leaf: '#2e8b2e',
          sun: '#f0b429',
          cream: '#f7f5ef',
        },
      },
    },
  },
  plugins: [],
}
