/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#1a1a1a',
        surface: '#242424',
        'surface-2': '#2e2e2e',
        accent: 'var(--accent)',
        pr: '#f59e0b',
        muted: '#a0a0a0',
        danger: '#ef4444',
        success: '#22c55e',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

