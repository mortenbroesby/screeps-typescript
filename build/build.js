const buildConfig = require("./webpack.build");

buildConfig.buildProjectUsingWebpack().catch(error => {
  console.log("error: ", error);
});
