module.exports = require('./webpack.init.config')({
    buildMode: 'production',
    devtool: false,
    watch: false,
    extractLibsAndCss: true
});