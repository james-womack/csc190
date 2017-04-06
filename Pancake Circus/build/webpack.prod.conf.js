var
  path = require('path'),
  config = require('../config'),
  cssUtils = require('./css-utils'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  baseWebpackConfig = require('./webpack.base.conf'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: cssUtils.styleRules({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      postcss: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: config.build.productionSourceMap,
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: '[name].css'
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
  ]
})

module.exports = webpackConfig
