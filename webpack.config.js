const srcDir = 'assets';
const libDir = 'build';
const webpack = require('webpack');

var webpackSetting = {
  entry: `./${srcDir}/js/app.js`,
  output: {
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {  // ここを追�?
    loaders: [
      { test: /\.html$/, loader: 'html?minimize' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.jpg$/, loader: "file?name=images/[name].[ext]" }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: "jquery",
      $: "jquery",
      jquery: "jquery",
      _: 'underscore'
    })
  ]
}

module.exports = webpackSetting;
