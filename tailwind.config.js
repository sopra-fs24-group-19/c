module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        beige: {
          500: '#f5f5dc',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
