/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef9ff',
          100: '#d8f1ff',
          200: '#b9e7ff',
          300: '#89daff',
          400: '#52c5ff',
          500: '#2aa8ff',
          600: '#1189f5',
          700: '#0a6fe1',
          800: '#0f58b6',
          900: '#134c8f',
          950: '#0f2f57',
        },
        dark: {
          50:  '#f8f8fa',
          100: '#f0f0f4',
          200: '#e2e2e8',
          300: '#c8c8d4',
          400: '#9898aa',
          500: '#6b6b80',
          600: '#505060',
          700: '#3a3a48',
          800: '#252530',
          850: '#1a1a24',
          900: '#12121a',
          950: '#0a0a10',
        }
      }
    }
  },
  plugins: [],
}
