/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5fa',
          100: '#e1ebf4',
          200: '#c5d8ea',
          300: '#9abbdc',
          400: '#6999c9',
          500: '#467eb5',
          600: '#346395',
          700: '#2b4f7a',
          800: '#264465',
          900: '#152b45',
        },
        surface: {
          50: '#f9f9fb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        },
        accent: {
          success: '#10b981',
          danger: '#ef4444',
          warning: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
