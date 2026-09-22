import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="campus-dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        charcoal: {
          800: '#111827',
          900: '#0f172a',
          950: '#0b0f19',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        "campus-light": {
          "primary": "#0284c7", // Electric Blue
          "primary-content": "#ffffff",
          "secondary": "#06b6d4", // Cyan
          "secondary-content": "#ffffff",
          "accent": "#10b981", // Emerald
          "accent-content": "#ffffff",
          "neutral": "#0f172a", // Deep Charcoal
          "neutral-content": "#f8fafc",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#0f172a",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        "campus-dark": {
          "primary": "#38bdf8", // Vibrant Sky/Electric Cyan-Blue
          "primary-content": "#0b132b",
          "secondary": "#2dd4bf", // Teal/Cyan
          "secondary-content": "#042f2e",
          "accent": "#34d399", // Emerald
          "accent-content": "#022c22",
          "neutral": "#f8fafc", // Crisp White for dark mode text-neutral
          "neutral-content": "#f8fafc",
          "base-100": "#0f172a", // Deep Slate Blue Card
          "base-200": "#0b0f19", // Deep Charcoal Canvas
          "base-300": "#1e293b", // Elevated border/surface
          "base-content": "#f8fafc", // Crisp White text
          "info": "#38bdf8",
          "success": "#34d399",
          "warning": "#fbbf24",
          "error": "#f87171",
        },
      },
      "light",
    ],
    defaultTheme: "campus-light",
  },
};

