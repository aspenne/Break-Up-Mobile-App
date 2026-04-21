/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  safelist: [
    // sky (blog)
    'bg-sky-50', 'bg-sky-100', 'border-sky-100', 'border-sky-200', 'text-sky-400', 'text-sky-500',
    // sage (journal)
    'bg-sage-50', 'bg-sage-100', 'bg-sage-300', 'border-sage-200', 'text-sage-400', 'text-sage-600', 'text-sage-700', 'text-sage-900',
    // rose (souvenirs)
    'bg-rose-50', 'bg-rose-100', 'border-rose-100', 'border-rose-200', 'text-rose-400',
    // lavender (chat)
    'bg-lavender-50', 'bg-lavender-100', 'border-lavender-200', 'text-lavender-700',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: '#faf8ff',
          100: '#f3eeff',
          200: '#e9e0ff',
          300: '#d4c5fe',
          400: '#b99bfc',
          500: '#9e71f7',
          600: '#8b4eee',
          700: '#7a3cd9',
          800: '#6632b6',
          900: '#542b94',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
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
        'surface-secondary': '#faf8ff',
        'text-primary': '#2d2438',
        'text-secondary': '#6b6078',
        'text-muted': '#9b93a8',
        border: '#e9e0ff',
        'border-light': '#f3eeff',
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
