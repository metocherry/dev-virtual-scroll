'use strict';

const path = require('path');
const { resolve } = require('../webpack.config');

const root = path.resolve(__dirname, '../')

const paths = {
  root,
  source: resolve(root, 'src'),
  build: resolve(root, 'build'),
  public: resolve(root, 'public'),
};

module.exports = {
  paths,
  files: {
    entry: resolve(paths.source, 'index'),
  }
};
