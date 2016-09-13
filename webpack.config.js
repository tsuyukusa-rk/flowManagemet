const srcDir = 'assets';
const libDir = 'build';
const webpack = require('webpack');

const webpackSetting = {
  entry: `./${srcDir}/js/app.js`,
  output: {
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
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
