const packageJson = require("../../package.json");

interface IConstants {
  VERSION: string;
}

const Constants: IConstants = {
  VERSION: packageJson.version
};

export default Constants;
