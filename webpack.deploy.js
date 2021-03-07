const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

function uploadCodeToScreeps() {
  readDirectory()
    .then(filesInDir => {
      processFiles(createPromises(filesInDir));
    })
    .catch(() => {
      process.exit(1);
    });
}

function readDirectory() {
  return new Promise((resolve, reject) => {
    const dirname = "./dist";

    fs.readdir(dirname, (error, fileNames) => {
      if (error) {
        reject(error);
      }

      resolve(fileNames);
    });
  });
}

function createPromises(fileNames) {
  const promises = [];

  for (const file of fileNames) {
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

  return promises;
}

function processFiles(promises) {
  const isProduction = process.env.NODE_ENV === "production";
  const defaultConfigTarget = isProduction ? "main" : "sim";

  let configTarget = defaultConfigTarget;

  const destination = process.env.DEST;
  if (!destination) {
    console.log(`\n\nDeploying to branch: ${chalk.bold.yellow(`${configTarget}`)}`);
  } else if (require("./screeps.json")[destination] == null) {
    throw new Error("Invalid upload destination");
  } else {
    configTarget = destination;
    console.log("Using destination: ", configTarget);
  }

  const configFile = require("./screeps")[configTarget];

  Promise.all(promises)
    .then(resolvedFiles => {
      const resolvedModules = resolvedFiles.reduce((modules, file) => {
        Object.assign(modules, file);
        return modules;
      }, {});

      deployToScreeps(configFile, resolvedModules);
    })
    .catch(error => {
      console.log("error: ", error);
    });
}

function deployToScreeps(configFile, resolvedModules) {
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

  const packageJson = require("./package.json");

  const deployMessage = `Successfully deployed version ${packageJson.version} to Screeps`;

  console.log(chalk.bold.green(`\n${deployMessage}\n`));
}

const dayjs = require("dayjs");
const buildConfig = require("./webpack.build");

console.log(`Time of execution: ${dayjs(new Date(), "MMMM Do YYYY, HH:mm:ss")}.\n`);

buildConfig
  .buildProjectUsingWebpack()
  .then(() => {
    uploadCodeToScreeps();
  })
  .catch(error => {
    console.log("error: ", error);
  });
