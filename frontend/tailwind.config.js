/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#183D32',
        secondary: '#285344',
        sage: '#D7E8C8',
        cream: '#FAF8F2',
        textMain: '#202923',
        textMuted: '#747C75',
        borderLight: '#E7E9E3',
        success: '#238354',
        warning: '#D99A32',
        error: '#C84444',
        whatsapp: '#25D366'
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
