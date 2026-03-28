/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-card': '#13131a',
        'bg-card-hover': '#1a1a24',
        'bg-input': '#0f0f16',
        'border-default': '#1f1f2e',
        'border-focus': '#3b3b5c',
        'text-primary': '#f0f0f5',
        'text-secondary': '#9ca3af',
        'text-muted': '#6b7280',
        'critical': '#ef4444',
        'warning': '#f59e0b',
        'success': '#22c55e',
        'accent': '#6366f1',
      },
      fontFamily: {
        body: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        data: ['SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-critical': 'pulse-critical 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
      },
      keyframes: {
        'pulse-critical': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.5)' },
          '50%': { boxShadow: '0 0 0 12px rgba(239, 68, 68, 0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.3), 0 0 60px rgba(239, 68, 68, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(239, 68, 68, 0.5), 0 0 80px rgba(239, 68, 68, 0.2)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
