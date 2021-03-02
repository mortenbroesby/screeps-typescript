/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */

"use strict";

import clear from "rollup-plugin-clear";
import replace from "rollup-plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import screeps from "rollup-plugin-screeps";

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
      __BUILD_TIME__: JSON.stringify(Date.now()),
      __REVISION__: JSON.stringify(require("git-rev-sync").short())
    }),

    resolve({ rootDir: "src" }),

    commonjs({
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules

        "node_modules/my-lib/index.js": ["named"]
      }
    }),

    typescript({ tsconfig: "./tsconfig.json" }),

    screeps({
      config: configFile,

      // if `NODE_ENV` is local, perform a dry run
      dryRun: process.env.NODE_ENV === "local"
    })
  ]
};
