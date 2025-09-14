/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class', // use a .dark class on <html> or <body>
  theme: {
    extend: {
      colors: {
        // semantic names (feel free to tweak)
        bg: {
          light: '#F9FAFB',
          dark: '#121212'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E1E1E'
        },
        'text-primary': '#121212',
        'text-primary-dark': '#EAEAEA',
        'text-secondary': '#4B5563',
        primary: '#14B8A6',
        secondary: '#8B5CF6',
        border: {
          light: '#E5E7EB',
          dark: '#2C2C2C'
        },
        error: '#EF4444',
        success: '#10B981'
      }
    }
  },
  plugins: []
}

