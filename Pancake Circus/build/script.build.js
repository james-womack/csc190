﻿process.env.NODE_ENV = 'production'

require('colors')

var
  shell = require('shelljs'),
  path = require('path'),
  env = require('./env-utils'),
  webpack = require('webpack'),
  webpackConfig = require('./webpack.prod.conf'),
  targetPath = path.join(__dirname, '../wwwroot/dist')

console.log(' WARNING!'.bold)
console.log(' Do NOT use VueRouter\'s "history" mode if')
console.log(' building for Cordova or Electron.\n')

require('./script.clean.js')
console.log((` Building Quasar App with "${env.platform.theme}" theme...\n`).bold)

shell.mkdir('-p', targetPath)
shell.cp('-R', 'Client/statics', targetPath)

webpack(webpackConfig,
  function (err, stats) {
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) +
      '\n')

    console.log((
      `\n Build complete with "${env.platform.theme.bold}" theme in ${'"/wwwroot/dist"'.bold} folder.\n`).cyan)

    console.log(' Built files are meant to be served over an HTTP server.'.bold)
    console.log(" Opening index.html over file:// won't work.".bold)
  })
