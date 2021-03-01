
import { logLevel, LogConfig} from "./logLevel";
import { settings } from "./settings";

export * from './logLevel';
export * from './settings';

interface MainConfig {
  logLevel: LogConfig;
  settings: MemorySettings;
}

const Config: MainConfig = {
  logLevel,
  settings
}

export default Config;
