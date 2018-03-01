/* eslint-env node */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => ({
  context: path.resolve(__dirname, 'src'),
  entry: './main.js',
  output: {
    filename: '[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: { rules: [{ test: /\.gltf$/, use: 'file-loader' }] },
  plugins: [new HtmlWebpackPlugin({ template: 'index.ejs' })],
  devtool: options.mode === 'development' ? 'source-map' : false,
});
