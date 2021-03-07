const chalk = require("chalk");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

function buildProjectUsingWebpack() {
  return new Promise(resolve => {
    console.log(chalk.bold.blue("Starting Webpack build.\n"));

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

module.exports = {
  buildProjectUsingWebpack
};
