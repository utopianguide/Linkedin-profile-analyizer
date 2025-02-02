/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
      },
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        primary: {
          DEFAULT: '#0A66C2',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#00A0DC',
          foreground: '#ffffff'
        },
        muted: {
          DEFAULT: '#F3F6F8',
          foreground: '#666666'
        },
        accent: {
          DEFAULT: '#E7F3FF',
          foreground: '#0A66C2'
        },
        destructive: {
          DEFAULT: '#E51400',
          foreground: '#ffffff'
        },
        success: {
          DEFAULT: '#0A8D48',
          foreground: '#ffffff'
        },
        warning: {
          DEFAULT: '#F5B800',
          foreground: '#ffffff'
        }
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem'
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)'
      },
      keyframes: {
        progress: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
        }
      },
      animation: {
        progress: 'progress 2s ease-in-out infinite',
        shake: 'shake 0.6s ease-in-out'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'hsl(var(--foreground))',
            a: {
              color: 'hsl(var(--primary))',
              textDecoration: 'underline',
              textUnderlineOffset: '0.25em',
              '&:hover': {
                color: 'hsl(var(--primary) / 0.9)',
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: 'hsl(var(--foreground))',
              fontFamily: 'var(--font-heading)',
              fontWeight: '600',
              letterSpacing: '-0.02em',
            },
          },
        },
      },
    }
  },
  plugins: []
} 