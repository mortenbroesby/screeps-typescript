const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

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

  let filesToUpload = [];
  const dirname = "./dist";
  const promises = [];

  fs.readdir(dirname, (error, fileNames) => {
    if (error) {
      throw new Error(error);
    }

    filesToUpload = fileNames;
  });

  for (const file of filesToUpload) {
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

const dayjs = require("dayjs");
const buildConfig = require("./webpack.build");

console.log(`Time of execution: ${dayjs(new Date(), "MMMM Do YYYY, HH:mm:ss")}.\n`);

buildConfig
  .buildProjectUsingWebpack()
  .then(() => {
    uploadCodeToScreeps();

    console.log(chalk.bold.green("\nDeploy to Screeps succeded.\n"));
  })
  .catch(error => {
    console.log("error: ", error);
  });
