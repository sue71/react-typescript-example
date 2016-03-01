const path = require('path');
const webpack = require('webpack');

const DEV = (process.argv.indexOf('--develop') >= 0);
const VERBOSE = (process.argv.indexOf('--verbose') >= 0);
const WATCH = (process.argv.indexOf('--watch') >= 0);

const GLOBAL_VARS = {
};

const baseConfig = {

  cache: DEV,
  debug: DEV,

  stats: {
    colors: true,
    timings: true,
    reason: DEV,
    hash: VERBOSE,
    version: VERBOSE,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
  ],

  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.txt$/,
        loader: 'raw',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url',
      },
      {
        test: /\.(eot|ttf)$/,
        loader: 'file',
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
        },
      },
      {
        test: /.tsx?$/,
        loader: 'ts',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader/useable!css-loader?minimize!postcss-loader',
      }
    ]
  }
};

const appConfig = Object.assign({}, baseConfig, {

  // entry point
  entry: [
    ...(WATCH ? [
      'webpack-hot-middleware/client?reload=true',
    ] : []),
    './src/index.tsx',
  ],

  // output build file
  output: {
    path: path.join(__dirname, './build/public'),
    filename: 'main.js',
  },

  devtool: DEV ? '#source-map' : false,

  plugins: [
    new webpack.DefinePlugin(GLOBAL_VARS),
    ...(DEV ? [] : [
      new webpack.optimize.AggressiveMergingPlugin()
    ]),
    ...(WATCH ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ] : []),
  ],

});

module.exports = appConfig;
