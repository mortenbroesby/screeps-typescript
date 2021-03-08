/* eslint-disable camelcase */

/**
 * Setup environment defaults
 */
process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

process.env.npm_config_environment = process.env.npm_config_environment
  ? process.env.npm_config_environment
  : "development";

process.env.npm_config_branch = process.env.npm_config_branch ? process.env.npm_config_branch : "unknown";
process.env.npm_config_debug = process.env.npm_config_debug ? process.env.npm_config_debug : "false";

/**
 * Use environment defaults
 */
const nodeEnvironment = process.env.NODE_ENV;
const environment = process.env.npm_config_environment;
const isProduction = environment === "production";
const isDebug = process.env.npm_config_debug === "true";
const branchOverride = process.env.npm_config_branch;
const defaultBranch = isProduction ? "main" : "development";

/**
 * Setup screeps config
 */

let targetBranch = defaultBranch;

if (branchOverride !== "unknown") {
  if (require("../screeps.json")[branchOverride] == null) {
    throw new Error(`Invalid config for branch: ${branchOverride}`);
  } else {
    targetBranch = branchOverride;
  }
}

const packageJson = require("../package.json");
const configFile = require("../screeps")[targetBranch];
const version = packageJson.version;

/**
 * Expose full configuration
 */
function getEnvironmentVariables() {
  return {
    version,
    environment,
    nodeEnvironment,
    isProduction,
    isDebug,
    targetBranch,
    configFile
  };
}

module.exports = function () {
  return getEnvironmentVariables();
};
