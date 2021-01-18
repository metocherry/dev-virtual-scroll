const { resolve, relative, join } = require('path')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const { paths, files } = require('./config/app')

const webpackDevClientEntry = require.resolve('react-dev-utils/webpackHotDevClient')
const reactRefreshOverlayEntry = require.resolve('react-dev-utils/refreshOverlayInterop')

const isEnvProduction = false
const isEnvDevelopment = true
const shouldUseSourceMap = true
const shouldUseReactRefresh = false

// style files regexes
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

module.exports = function (webpackEnv) {
  return {
    name: 'virtual-scroll',
    mode: isEnvProduction ? 'production' : 'development',
    devtool: isEnvDevelopment
      ? 'cheap-module-source-map'
      : shouldUseSourceMap
      ? 'source-map'
      : false,
    bail: isEnvProduction,
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    entry: {
      app: isEnvDevelopment
        ? [
            // Include an alternative client for WebpackDevServer. A client's job is to
            // connect to WebpackDevServer by a socket and get notified about changes.
            // When you save a file, the client will either apply hot updates (in case
            // of CSS changes), or refresh the page (in case of JS changes). When you
            // make a syntax error, this client will display a syntax error overlay.
            // Note: instead of the default WebpackDevServer client, we use a custom one
            // to bring better experience for Create React App users. You can replace
            // the line below with these two lines if you prefer the stock client:
            //
            // require.resolve('webpack-dev-server/client') + '?/',
            // require.resolve('webpack/hot/dev-server'),
            //
            // When using the experimental react-refresh integration,
            // the webpack plugin takes care of injecting the dev client for us.
            webpackDevClientEntry,
            files.entry,
            // We include the app code last so that if there is a runtime error during
            // initialization, it doesn't blow up the WebpackDevServer client, and
            // changing JS code would still trigger a refresh.
          ]
        : files.entry,
    },
    output: {
      path: isEnvProduction ? paths.build : undefined,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/app.js',
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
      publicPath: paths.public,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) => relative(paths.source, info.absoluteResourcePath).replace(/\\/g, '/')
        : isEnvDevelopment && ((info) => resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this',
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.jsx?/,
          loader: 'babel-loader',
          // babel 옵션
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['> 5% in KR'],
                  },
                  debug: true,
                },
              ],
              '@babel/preset-react',
            ],
            plugins: ['@babel/plugin-proposal-class-properties', 'react-hot-loader/babel'],
          },
        },
      ],
    },
    plugins: [new webpack.LoaderOptionsPlugin({ debug: true })],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell webpack to provide empty mocks for them so importing them works.
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  }
}
