/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  safelist: [
    // sky (couleur principale + blog + chat)
    'bg-sky-50', 'bg-sky-100', 'bg-sky-300', 'border-sky-100', 'border-sky-200', 'text-sky-400', 'text-sky-500', 'text-sky-600', 'text-sky-700',
    // sage (journal)
    'bg-sage-50', 'bg-sage-100', 'bg-sage-300', 'border-sage-200', 'text-sage-400', 'text-sage-600', 'text-sage-700', 'text-sage-900',
    // rose (souvenirs)
    'bg-rose-50', 'bg-rose-100', 'border-rose-100', 'border-rose-200', 'text-rose-400',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        sky: {
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
        },
        sage: {
          50: '#f6faf6',
          100: '#e8f1e8',
          200: '#d0e4d0',
          300: '#a8cda8',
          400: '#7ab37a',
          500: '#5a9a5a',
          600: '#467c46',
          700: '#3a6539',
          800: '#315131',
          900: '#2a432a',
        },
        cream: {
          50: '#fffdfb',
          100: '#fef9f3',
          200: '#fdf0e0',
          300: '#fbe3c8',
          400: '#f8d0a5',
          500: '#f4b87a',
        },
        rose: {
          50: '#fff5f5',
          100: '#ffe0e0',
          200: '#ffc5c5',
          300: '#ffa0a0',
          400: '#ff7070',
        },
        background: '#fef9f3',
        surface: '#ffffff',
        'surface-secondary': '#f0f9ff',
        'text-primary': '#1e293b',
        'text-secondary': '#64748b',
        'text-muted': '#94a3b8',
        border: '#bae6fd',
        'border-light': '#e0f2fe',
      },
      fontSize: {
        'heading-xl': ['32px', { lineHeight: '40px' }],
        'heading-lg': ['24px', { lineHeight: '32px' }],
        'heading-md': ['20px', { lineHeight: '28px' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'body-sm': ['14px', { lineHeight: '20px' }],
        caption: ['12px', { lineHeight: '16px' }],
      },
      borderRadius: {
        card: '16px',
        button: '28px',
        input: '12px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(45, 36, 56, 0.08)',
        card: '0 4px 12px rgba(45, 36, 56, 0.06)',
        elevated: '0 8px 24px rgba(45, 36, 56, 0.10)',
      },
    },
  },
  plugins: [],
};
