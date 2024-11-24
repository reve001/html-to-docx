const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = (_, options) => {
  const devMode = options.mode === 'development';
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'html-to-docx.js',
      library: {
        name: 'HTMLtoDOCX',
        type: 'umd',
        umdNamedDefine: true,
      },
      clean: true,
    },
    mode: devMode ? 'development' : 'production',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js'],
      fallback: {
        path: false,
        fs: false,
        process: require.resolve('process/browser'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './test/index.html',
        inject: 'head',
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'test',
            globOptions: {
              ignore: ['**/index.html'],
            },
            noErrorOnMissing: true,
          },
        ],
      }),
      new NodePolyfillPlugin(),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    devtool: devMode ? 'source-map' : false,
    watch: devMode,
    optimization: { concatenateModules: false }, // webpack's ConcatenationScope throws exception due to string decoding issues
  };
};
