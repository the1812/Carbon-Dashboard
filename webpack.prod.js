const path = require('path')
const config = require('./webpack.config')
module.exports = Object.assign({
  mode: 'production',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'docs')
  }
}, config)