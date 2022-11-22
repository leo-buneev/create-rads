const path = require('path')
const glob = require('glob')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const root = path.join(process.cwd(), './api')

const plugins = [
  new CleanWebpackPlugin(),
  new webpack.DefinePlugin({
    'process.env.RADS_ENV': JSON.stringify(process.env.RADS_ENV),
    'process.env.ROOT_SOURCE_PATH': isDev ? JSON.stringify(root) : undefined,
  }),
  new webpack.ProvidePlugin({
    gql: ['apollo-server-azure-functions', 'gql'],
    _: 'lodash',
    tc: ['rads/src/tc/tc', 'default'],
  }),
]
if (!isDev)
  plugins.push(
    new CopyWebpackPlugin([
      '*/function.json',
      'extensions.csproj',
      'host.json',
      { from: 'proxies.json', noErrorOnMissing: true },
      { from: '.deployment', noErrorOnMissing: true },
      { from: 'deployment/*', noErrorOnMissing: true },
    ]),
  )

const functionIndexFileGlob = path.resolve(root, './*/index.js')

module.exports = {
  target: 'node',
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : false,
  context: path.resolve(root),
  entry: isDev
    ? path.resolve(root, './dev.js')
    : glob.sync(functionIndexFileGlob).reduce((acc, v) => {
        const match = /([^/]+)\/index\.js$/gi.exec(v)
        const funcName = match[1]
        acc[`${funcName}/index`] = path.resolve(root, `./${funcName}/index.js`)
        return acc
      }, {}),
  stats: { warnings: false },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.ts', '.json'],
    alias: { '@': path.resolve(root) },
  },
  externals: {
    puppeteer: 'commonjs puppeteer',
    // svelte2tsx: 'svelte2tsx',
    // 'util/types': 'commonjs util/types',
    // util: 'node-commonjs util',
    // typescript: 'node-commonjs typescript',
    // 'ts-node': 'node-commonjs ts-node',
    'graphql-config': 'node-commonjs graphql-config',
    '@graphql-tools/graphql-file-loader': 'node-commonjs @graphql-tools/graphql-file-loader',
    '@graphql-tools/code-file-loader': 'node-commonjs @graphql-tools/code-file-loader',
    '@graphql-codegen/typescript-operations': 'node-commonjs @graphql-codegen/typescript-operations',
    '@graphql-codegen/typescript': 'node-commonjs @graphql-codegen/typescript',
    '@graphql-codegen/core': 'node-commonjs @graphql-codegen/core',
    '@graphql-tools/load': 'node-commonjs @graphql-tools/load',
  },
  externalsPresets: {
    node: true,
  },
  output: {
    path: path.resolve(root, isDev ? '../dist/server-dev' : '../dist/server'),
    filename: '[name].js',
    libraryTarget: isDev ? undefined : 'commonjs2',
    libraryExport: isDev ? undefined : 'default',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: { fullySpecified: false },
      },
      {
        test: /\.m?js$/,
        exclude: [/[\\/]node_modules[\\/]/],
        loader: 'babel-loader',
      },
      {
        test: /\.raw.js$/,
        loader: 'raw-loader',
      },
      {
        test: /\.key$/,
        loader: 'raw-loader',
      },
      {
        test: /\.gql$/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.tsx?$/,
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
        exclude: /node_modules/,
      },
    ],
  },
  cache: {
    type: 'filesystem',
    buildDependencies: { config: [__filename, path.resolve(root, '../babel.config.js')] },
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: /AbortSignal/,
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: 'vendors',
        },
      },
    },
  },

  plugins,
}
