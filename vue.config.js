var path = require('path');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/crypto/'
        : './',
        
    pages: {
        index: {
            entry: 'src/app/main.js'
        }
    },
    configureWebpack: {
		resolve: {
			alias: {
				'assets': path.resolve(__dirname, 'src/assets'),
			}
		}
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~assets/scss/environment";`
            }
        }
    },
};