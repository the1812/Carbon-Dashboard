const webpack = require('webpack')
const path = require('path')
const ora = require('ora')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const spinner = ora({
  text: '',
  spinner: {
    interval: 150,
    frames: ['.  ', '.. ', '...']
  }
})
const includePaths = [
  path.resolve(__dirname, 'src'),
  path.resolve(__dirname, 'node_modules/vue-echarts'),
  path.resolve(__dirname, 'node_modules/resize-detector'),
]
module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    writeToDisk: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ],
      },
      {
        test: /\.css$/,
        use: [
          'cache-loader',
          'vue-style-loader',
          'css-loader',
        ],
        include: includePaths,
      },
      {
        test: /\.scss$/,
        use: [
          'cache-loader',
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ],
        include: includePaths,
      },
      {
        test: /\.tsx?$/,
        use: ['cache-loader', {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        }],
        include: includePaths,
      },
      {
        test: /\.vue$/,
        use: [
          'cache-loader',
          'vue-loader',
        ],
        include: includePaths,
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: '碳积分管理面板',
      meta: {
        charset: 'UTF-8',
        viewport: 'width=device-width, initial-scale=1.0'
      }
    }),
    new webpack.ProgressPlugin((percent, message) => {
      spinner.text = `[${Math.round(percent * 1000) / 10}%] ${message}`
      if (percent === 0) {
        spinner.start()
      } else if (percent === 1) {
        spinner.stop()
      }
    }),
    new CopyPlugin([
      { from: 'src/static', to: 'static' },
    ]),
  ]
}