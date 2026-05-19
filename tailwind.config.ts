import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#eef6e8',
          100: '#d5ecca',
          200: '#aad99a',
          300: '#78c265',
          400: '#50ab3a',
          500: '#3a9124',
          600: '#2d741c',
          700: '#245d16',
          800: '#1d4b12',
          900: '#163a0d',
          950: '#0c2208',
        },
        cream: {
          50:  '#fdfcf7',
          100: '#faf5eb',
          200: '#f4ead3',
          300: '#ebdab5',
          400: '#dfc592',
          500: '#d0ab6b',
          600: '#b88d4a',
          700: '#8f6c34',
          800: '#6b502a',
          900: '#503c21',
        },
        wood: {
          50:  '#fef7ef',
          100: '#fdebd8',
          200: '#fad3af',
          300: '#f6b47d',
          400: '#f08e49',
          500: '#e87025',
          600: '#d4561b',
          700: '#ae4119',
          800: '#8b341c',
          900: '#712d1a',
        },
        tero: {
          50:  '#eef7f1',
          100: '#d4ecda',
          200: '#a6d8b4',
          300: '#6dbd87',
          400: '#3a9f5f',
          500: '#228046',
          600: '#1b6438',
          700: '#1a3a2a',
          800: '#132c20',
          900: '#0e2118',
          950: '#07120d',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
