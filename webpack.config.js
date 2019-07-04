let webpack = require('webpack');
let path = require('path');
let fs = require('fs');

let nodeModules = {};
fs.readdirSync('node_modules')
  .filter((x) => {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  mode: 'production',
  entry: './src/server/server.ts',
  target: 'node',
  node: {
    __dirname: false, // Corrects it so __dirname isn't root.
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    path: path.resolve('./dist/server'),
    filename: 'server.js'
  },
  externals: nodeModules
};
