/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  // ✅ ensure consistent page width + padding
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
    },
    extend: {
      fontFamily: {
        satoshi: [
          'Satoshi',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Noto Sans',
          'sans-serif',
        ],
        newsreader: [
          'Newsreader',
          'serif',
        ],
      },
      animation: {
        blink: 'blink 1.2s steps(1) infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
    },
  },

  // ✅ keep dynamic color utilities used via strings (e.g., variant.color)
  safelist: [
    // gradients: from-*/via-*/to-*
    {
      pattern:
        /(from|via|to)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
    },
    // background/text/ring colors commonly toggled from data
    {
      pattern:
        /(bg|text|ring)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(100|200|300|400|500|600|700|800|900)/,
    },
  ],

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
