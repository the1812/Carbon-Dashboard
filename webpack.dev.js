const config = require('./webpack.config')
module.exports = Object.assign({
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
}, config)