module.exports = {
    content: [
            './public/**/*.html', 
            './views/**/*.handlebars', 
            './public/assets/js/**/*.js',
        ],
    theme: {
      extend: {
        fontFamily: {
          'roboto': ['Roboto', 'sans-serif']
        }
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        purple: {
          light: '#7172db',
          DEFAULT: '#5758ad',
          dark: '#3d3e7a',
        },
        gray: {
          DEFAULT: '#f2f2f2', 
          dark: '#3D413B',
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }}}
  