/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

function buildProjectUsingWebpack() {
  return new Promise(resolve => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        throw error;
      }

      process.stdout.write(
        stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        })
      );

      if (stats.hasErrors()) {
        console.log(chalk.red("  Build failed with errors.\n"));
        process.exit(1);
      }

      resolve();
    });
  });
}

function uploadCodeToScreeps() {
  const isProduction = process.env.NODE_ENV === "production";
  const defaultConfigTarget = isProduction ? "main" : "sim";

  let configTarget = defaultConfigTarget;

  const destination = process.env.DEST;
  if (!destination) {
    console.log("\nNo destination specified, using destination: ", configTarget);
  } else if (require("./screeps.json")[destination] == null) {
    throw new Error("Invalid upload destination");
  } else {
    configTarget = destination;
    console.log("Using destination: ", configTarget);
  }

  const configFile = require("./screeps")[configTarget];

  const files = ["main.js", "main.js.map"];
  const promises = [];

  for (const file of files) {
    promises.push(
      new Promise((resolve, reject) => {
        fs.readFile(`./dist/${file}`, "utf-8", (error, data) => {
          if (error) {
            return reject(error);
          }

          const moduleName = path.basename(file, ".js");

          resolve({ [moduleName]: data });
        });
      })
    );
  }

  Promise.all(promises)
    .then(resolvedFiles => {
      const resolvedModules = resolvedFiles.reduce((modules, file) => {
        Object.assign(modules, file);
        return modules;
      }, {});

      const ScreepsModules = require("screeps-modules");

      const client = new ScreepsModules({
        email: configFile.email,
        password: configFile.password,
        token: configFile.token,
        serverUrl: "https://screeps.com",
        gzip: false
      });

      client.commit(configFile.branch, resolvedModules).catch(error => {
        console.log("error: ", error);
      });
    })
    .catch(error => {
      console.log("error: ", error);
    });
}

buildProjectUsingWebpack()
  .then(() => {
    uploadCodeToScreeps();
  })
  .catch(error => {
    console.log("error: ", error);
  });
