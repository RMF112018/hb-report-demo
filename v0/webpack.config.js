// webpack.config.js
// Webpack configuration for HB Report, bundling renderer scripts with CSS module support
// Use this file as the main Webpack config by running `webpack --config webpack.config.js`
// Reference: https://webpack.js.org/configuration/
// *Additional Reference*: https://www.electronjs.org/docs/latest/tutorial/tutorial-2#bundling-your-app-with-webpack

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  entry: './src/renderer/main.js',
  target: 'electron-renderer',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'renderer.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: { browsers: 'last 2 versions' },
                modules: false,
              }],
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
      filename: 'index.html',
    }),
    new webpack.ProvidePlugin({
      global: ['globalThis'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [path.resolve(__dirname, 'src/renderer'), 'node_modules'],
  },
  stats: {
    modules: true,
    reasons: true,
    errorDetails: true,
  },
  devtool: 'source-map',
};