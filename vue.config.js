const path = require('path');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/day/'
    : '/',
    configureWebpack: {
        resolve: {
            alias: {
               'caml-js': path.resolve(__dirname, 'github.com/caml-js'),
               'time-js': path.resolve(__dirname, 'github.com/time-js'),
            }
        }
    }
};

