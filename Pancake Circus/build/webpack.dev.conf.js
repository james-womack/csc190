var
  config = require('../config'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  cssUtils = require('./css-utils'),
  baseWebpackConfig = require('./webpack.base.conf'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin'),
  path = require('path')

module.exports = merge(baseWebpackConfig, {
 
  module: {
    rules: cssUtils.styleRules({
      sourceMap: config.dev.cssSourceMap,
      postcss: true
    })
  },/*
  watch: true,
  watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 1000
  },*/
  plugins: [
      new webpack.SourceMapDevToolPlugin({
          filename: '[file].map',
          moduleFilenameTemplate: path.relative('../wwwroot/dist/', '[resourcePath]')
   })
  ]
})
