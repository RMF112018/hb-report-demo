import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class', '.dark'],
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './data/**/*.{json}',
    './public/**/*.{html,js}',
    '*.{js,ts,jsx,tsx,mdx}',
    // Ensure all files using safelisted classes are included in content
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        chart: { 1: 'hsl(var(--chart-1, #3b82f6))', 2: 'hsl(var(--chart-2, #10b981))', 3: 'hsl(var(--chart-3, #8b5cf6))' },
      },
      borderRadius: { lg: 'var(--radius, 0.5rem)', md: 'calc(var(--radius, 0.5rem) - 2px)', sm: 'calc(var(--radius, 0.5rem) - 4px)' },
      fontFamily: {
        sans: ['var(--font-sans, Inter)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    async () => {
      const animate = await import('tailwindcss-animate');
      return animate.default;
    },
  ],
};

export default config;