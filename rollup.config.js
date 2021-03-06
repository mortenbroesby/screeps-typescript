"use strict";

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import clear from "rollup-plugin-clear";
import replace from "rollup-plugin-replace";
import screeps from "rollup-plugin-screeps";
import typescript from "rollup-plugin-typescript2";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";

import LogLevel from "./loglevel";

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

const configFile = require("./screeps")[configTarget];

const logLevel = isProduction ? LogLevel.ERROR : LogLevel.DEBUG;

export default {
  input: "src/main.ts",

  output: {
    file: "dist/main.js",
    format: "cjs",
    sourcemap: true
  },

  plugins: [
    clear({ targets: ["dist"] }),

    replace({
      PRODUCTION: JSON.stringify(isProduction),
      LOG_LEVEL: JSON.stringify(logLevel),
      PROFILER_ENABLED: JSON.stringify(!isProduction),

      __BUILD_TIME__: JSON.stringify(Date.now()),
      __REVISION__: JSON.stringify(require("git-rev-sync").short())
    }),

    babel({
      exclude: "node_modules/**"
    }),

    commonjs(),

    typescript({ tsconfig: "./src/tsconfig.build.json" }),

    resolve({
      browser: true,
      jsnext: true,
      main: true,
      preferBuiltins: false
    }),

    uglify(),

    screeps({
      config: configFile,

      // if `NODE_ENV` is local, perform a dry run
      dryRun: process.env.NODE_ENV === "local"
    })
  ]
};
