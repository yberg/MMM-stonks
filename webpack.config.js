const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  {
    entry: './src/core/module.js',
    output: {
      filename: 'MMM-stonks.js',
      path: path.resolve(__dirname),
    },
    mode: 'development',
    plugins: [new MiniCssExtractPlugin()],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
  },
  {
    entry: './src/app/index.js',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'public'),
    },
    mode: 'development',
    plugins: [new MiniCssExtractPlugin()],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
  },
  {
    entry: './src/helper/index.js',
    output: {
      filename: 'node_helper.js',
      path: path.resolve(__dirname),
      libraryTarget: 'umd',
    },
    target: 'node',
    externals: {
      node_helper: 'node_helper',
      logger: 'logger',
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
  },
];
