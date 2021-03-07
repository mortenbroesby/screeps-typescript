/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const webpack = require("webpack");

const isProduction = process.env.NODE_ENV === "production";
const defaultConfigTarget = isProduction ? "main" : "sim";

let configTarget = defaultConfigTarget;

const destination = process.env.DEST;
if (!destination) {
  console.log("No destination specified, using destination: ", configTarget);
} else if (require("./screeps.json")[destination] == null) {
  throw new Error("Invalid upload destination");
} else {
  configTarget = destination;
  console.log("Using destination: ", configTarget);
}

// const configFile = require("./screeps")[configTarget];

/** *******************************/

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
    new webpack.ProgressPlugin(),

    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(isProduction),
      PROFILER_ENABLED: JSON.stringify(!isProduction),

      __BUILD_TIME__: JSON.stringify(Date.now()),
      __REVISION__: JSON.stringify(require("git-rev-sync").short())
    })
  ]
};
