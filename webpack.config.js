/* eslint-env node */
const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, options) => ({
  context: path.resolve(__dirname, 'src'),
  entry: './main.js',
  output: {
    filename: '[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: { rules: [{ test: /\.jpg$/, use: 'file-loader' }] },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.ejs' }),
    new DefinePlugin({ OIMO: JSON.stringify(true), CANNON: JSON.stringify(true) }),
  ],
  devtool: options.mode === 'development' ? 'source-map' : false,
  devServer: { host: '0.0.0.0' },
});
