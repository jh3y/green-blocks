// const plugin = require('tailwindcss/plugin')
module.exports = {
  purge: ['./pages/**/*.js', './components/**/*.js'],
  darkMode: 'class', // or 'media' or 'class'
  important: true,
  theme: {
    // extend: {
    //   animation: {
    //     'scale-x': 'scale-x 1s both',
    //     'scale-y': 'scale-y 1s both',
    //   },
    //   keyframes: {
    //     'scale-x': {
    //       '0%': { 'clip-path': 'inset(0 0 0 100%)' },
    //       '100%': { 'clip-path': 'inset(0 0 0 0)' },
    //     },
    //     'scale-y': {
    //       '0%': { 'clip-path': 'inset(100% 0 0 0)' },
    //       '100%': { 'clip-path': 'inset(0 0 0 0)' },
    //     },
    //   },
    // },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    // plugin(function ({ addComponents }) {
    //   const components = {
    //     '.bg-hue': {
    //       background: 'hsl(var(--hue, 0), 80%, 50%)',
    //     },
    //   }
    //   addComponents(components)
    // }),
  ],
}
