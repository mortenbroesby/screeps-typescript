const chalk = require("chalk");
const webpack = require("webpack");
const webpackConfig = require("../webpack.config");

const config = require("../build/variables")();

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

      const deployMessage = `Successfully built version ${config.version}`;
      console.log(chalk.bold.yellow(`\n\n${deployMessage}\n`));

      const dayjs = require("dayjs");

      const currentDate = dayjs().format("DD MMMM YYYY");
      const currentTime = dayjs().format("HH:mm:ss");

      console.log(`Time of execution: ${currentDate} @ ${currentTime}\n`);

      printConfigVariables();

      resolve();
    });
  });
}

function printConfigVariables() {
  const { environment, isProduction, nodeEnvironment, isDebug, targetBranch } = config;

  console.log(`------------------------------------`);
  console.log(`Configuration:`);
  console.log(`- Environment: ${chalk.green(environment)}`);
  console.log(`- Node environment: ${chalk.green(nodeEnvironment)}`);
  console.log(`- Is production? ${chalk.green(isProduction)}`);
  console.log(`- Is debug? ${chalk.green(isDebug)}`);
  console.log(`- Target branch? ${chalk.green(targetBranch)}`);
  console.log(`------------------------------------\n`);
}

module.exports = {
  buildProjectUsingWebpack
};
