import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Backgrounds (warm darks)
        bg: {
          base: '#09090B',
          elevated: '#18181B',
          surface: '#27272A',
        },
        // Text (warm whites)
        text: {
          primary: '#FAFAFA',
          secondary: '#A1A1AA',
          muted: '#71717A',
        },
        // Accent (calming blue)
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          subtle: '#1E3A5F',
          light: '#60A5FA',
        },
        // Brand highlight (reserved for logo/tagline)
        brand: {
          yellow: '#FEFF00',
        },
        // Semantic
        border: '#27272A',
        ring: 'rgba(59, 130, 246, 0.5)',
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Lato', 'system-ui', '-apple-system', 'sans-serif'],
        script: ['Over the Rainbow', 'cursive'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      fontSize: {
        display: ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h1: ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        h2: ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        h3: ['1.5rem', { lineHeight: '1.3' }],
        body: ['1.125rem', { lineHeight: '1.6' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow-sm': '0 0 20px -5px rgba(59, 130, 246, 0.3)',
        'glow-md': '0 0 40px -10px rgba(59, 130, 246, 0.4)',
        'glow-lg': '0 0 60px -15px rgba(59, 130, 246, 0.5)',
        'card': '0 4px 20px -4px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 30px -6px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;

