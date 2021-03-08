const path = require("path");
const webpack = require("webpack");
const WebpackBar = require("webpackbar");

const { isProduction, isDebug, nodeEnvironment } = require("./build/variables")();

module.exports = {
  mode: "production",

  entry: "./src/main.ts",
  target: "node",

  devtool: "source-map",

  externals: {
    "main.js.map": "main.js.map"
  },

  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2"
  },

  resolve: {
    extensions: [".ts", ".js"]
  },

  module: {
    rules: [{ test: /\.ts?$/, loader: "ts-loader" }]
  },

  plugins: [
    new WebpackBar({
      name: "Screeps build",
      profile: true
    }),

    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(nodeEnvironment),
      BUILD_DATE: JSON.stringify(Date.now()),
      IS_PRODUCTION: JSON.stringify(isProduction),
      IS_DEBUG: JSON.stringify(isDebug)
    })
  ]
};
