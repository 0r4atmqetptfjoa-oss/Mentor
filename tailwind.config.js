/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0b1220'
        }
      }
    }
  },
  plugins: []
}
