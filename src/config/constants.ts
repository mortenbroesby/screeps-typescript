const packageJson = require("../../package.json");

interface IConstants {
  version: string;
  isProduction: boolean;
  isDebug: boolean;
}

const Constants: IConstants = {
  version: packageJson.version,
  isProduction: IS_PRODUCTION,
  isDebug: IS_DEBUG
};

export default Constants;
