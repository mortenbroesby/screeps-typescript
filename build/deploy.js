const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

function uploadCodeToScreeps() {
  readDirectory()
    .then(filesInDir => {
      processFiles(createPromises(filesInDir));
    })
    .catch(error => {
      console.error("error: ", error);
      process.exit(1);
    });
}

function readDirectory() {
  return new Promise((resolve, reject) => {
    fs.readdir("./dist", (error, fileNames) => {
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
  Promise.all(promises)
    .then(resolvedFiles => {
      const resolvedModules = resolvedFiles.reduce((modules, file) => {
        Object.assign(modules, file);
        return modules;
      }, {});

      deployToScreeps(resolvedModules);
    })
    .catch(error => {
      console.log("error: ", error);
    });
}

function deployToScreeps(resolvedModules) {
  const ScreepsModules = require("screeps-modules");
  const config = require("../build/variables")();

  const { configFile, version, targetBranch } = config;

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

  let deployMessage = `Successfully deployed version ${chalk.bold.green(version)}`;
  deployMessage += ` to branch [${chalk.bold.yellow(targetBranch)}]`;

  console.log(`${deployMessage}\n`);
}

const buildConfig = require("./webpack.build");

buildConfig
  .buildProjectUsingWebpack()
  .catch(error => {
    console.log("error: ", error);
  })
  .finally(() => {
    uploadCodeToScreeps();
  });
