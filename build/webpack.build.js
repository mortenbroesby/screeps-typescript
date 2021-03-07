const chalk = require("chalk");
const webpack = require("webpack");
const webpackConfig = require("../webpack.config");

function buildProjectUsingWebpack() {
  return new Promise(resolve => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        throw error;
      }

      const dayjs = require("dayjs");
      console.log(`Time of execution: ${dayjs(new Date(), "MMMM Do YYYY, HH:mm:ss")}.\n`);

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

      const packageJson = require("../package.json");
      const deployMessage = `Successfully built version ${packageJson.version}`;
      console.log(chalk.bold.magenta(`\n\n${deployMessage}\n`));

      resolve();
    });
  });
}

module.exports = {
  buildProjectUsingWebpack
};
