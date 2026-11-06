/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: 'var(--ground)',
        'ground-deep': 'var(--ground-deep)',
        surface: 'var(--surface)',
        'surface-alt': 'var(--surface-alt)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        primary: 'var(--primary)',
        'primary-deep': 'var(--primary-deep)',
        pop: 'var(--pop)',
        amber: 'var(--amber)',
        mint: 'var(--mint)',
        'mint-deep': 'var(--mint-deep)',
        line: 'var(--line)',
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '24px',
      },
    },
  },
  plugins: [],
};
