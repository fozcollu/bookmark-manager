const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = {
  mode: 'production',
  devServer: {
    contentBase: path.resolve(__dirname, './src'),
    historyApiFallback: true
  },
  entry: {
    popup: path.resolve(__dirname, './src/index-popup.js')
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                {
                  plugins: ['@babel/plugin-proposal-class-properties']
                }
              ]
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: ['html-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: 'src/popup.html',
      chunks: ['popup']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: '[name].[ext]' },
        { from: 'src/*.png', to: '[name].[ext]' }
      ]
    }),
    new CleanWebpackPlugin()
  ]
};
