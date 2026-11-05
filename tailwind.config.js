/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: {
          card: 'var(--surface-card)',
          subtle: 'var(--surface-subtle)',
          hover: 'var(--surface-hover)',
        },
        brand: {
          DEFAULT: 'var(--brand-base)',
          base: 'var(--brand-base)',
          accent: 'var(--brand-accent)',
          hover: 'var(--brand-accent-hover)',
          glow: 'var(--brand-accent-glow)',
          tint: 'var(--brand-accent-tint)',
          accessible: 'var(--brand-accessible-text)',
          solid: 'var(--brand-solid-fill)',
          'shade-10': 'var(--brand-shade-10)',
          'shade-20': 'var(--brand-shade-20)',
          'shade-30': 'var(--brand-shade-30)',
          'shade-40': 'var(--brand-shade-40)',
          'shade-50': 'var(--brand-shade-50)',
          'shade-60': 'var(--brand-shade-60)',
          'shade-70': 'var(--brand-shade-70)',
          'shade-80': 'var(--brand-shade-80)',
          'shade-90': 'var(--brand-shade-90)',
          'tint-10': 'var(--brand-tint-10)',
          'tint-20': 'var(--brand-tint-20)',
          'tint-30': 'var(--brand-tint-30)',
          'tint-40': 'var(--brand-tint-40)',
          'tint-50': 'var(--brand-tint-50)',
          'tint-60': 'var(--brand-tint-60)',
          'tint-70': 'var(--brand-tint-70)',
          'tint-80': 'var(--brand-tint-80)',
          'tint-90': 'var(--brand-tint-90)',
        },
        content: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          tertiary: 'var(--text-tertiary)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          focus: 'var(--border-focus)',
        },
        status: {
          error: 'var(--color-error)',
          'error-tint': 'var(--color-error-tint)',
          warning: 'var(--color-warning)',
          'warning-tint': 'var(--color-warning-tint)',
          success: 'var(--color-success)',
          'success-tint': 'var(--color-success-tint)',
        },
      },
      spacing: {
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
      },
      borderRadius: {
        card: 'var(--radius-card, 20px)',
        sidebar: 'var(--radius-sidebar, 20px)',
        cluster: 'var(--radius-cluster, 18px)',
        box: 'var(--radius-box, 16px)',
        menu: 'var(--radius-menu, 16px)',
        input: 'var(--radius-pill, 9999px)',
        button: 'var(--radius-pill, 9999px)',
        badge: 'var(--radius-pill, 9999px)',
        pill: 'var(--radius-pill, 9999px)',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        floating: 'var(--shadow-floating)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: '0 0',
          },
          to: {
            backgroundPosition: '-200% 0',
          },
        },
      },
    },
  },
  plugins: [],
};
