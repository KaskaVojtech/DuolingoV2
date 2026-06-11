import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'admin-bg':         '#0f1117',
        'admin-surface':    '#1a1d27',
        'admin-surface-2':  '#222536',
        'admin-border':     '#2e3247',
        'admin-primary':    '#4f6ef7',
        'admin-primary-h':  '#3d5be8',
        'admin-danger':     '#e55353',
        'admin-danger-bg':  '#2a1a1a',
        'admin-text':       '#e8eaf2',
        'admin-text-muted': '#7b80a0',
      },
      fontSize: {
        'admin-xs':   ['clamp(0.7rem, 0.9vw, 0.75rem)',  { lineHeight: '1.5' }],
        'admin-sm':   ['clamp(0.8rem, 1vw, 0.875rem)',   { lineHeight: '1.5' }],
        'admin-base': ['clamp(0.875rem, 1.1vw, 1rem)',   { lineHeight: '1.6' }],
        'admin-lg':   ['clamp(1rem, 1.3vw, 1.125rem)',   { lineHeight: '1.4' }],
        'admin-xl':   ['clamp(1.2rem, 1.6vw, 1.5rem)',   { lineHeight: '1.3' }],
        'admin-2xl':  ['clamp(1.5rem, 2vw, 2rem)',       { lineHeight: '1.2' }],
      },
      spacing: {
        'admin-xs':  'clamp(0.25rem, 0.4vw, 0.5rem)',
        'admin-sm':  'clamp(0.5rem, 0.7vw, 0.75rem)',
        'admin-md':  'clamp(0.75rem, 1vw, 1rem)',
        'admin-lg':  'clamp(1rem, 1.5vw, 1.5rem)',
        'admin-xl':  'clamp(1.5rem, 2vw, 2rem)',
        'admin-2xl': 'clamp(2rem, 3vw, 3rem)',
      },
      borderRadius: {
        'admin-sm': '6px',
        'admin-md': '10px',
        'admin-lg': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
