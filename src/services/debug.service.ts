import dayjs from "dayjs";

import { Profile } from "../profiler";
import { logger } from "../tools/logger";
import { Service } from "./abstract.service";

@Profile
export class DebugService extends Service {
  public constructor() {
    super({ name: DebugService.name });

    this._logInitialDebugMessage();
  }

  public loop(): void {
    this._logGameInfo({ shouldLog: false });
    this._logProfilerInfo({ shouldLog: true });
  }

  private _logInitialDebugMessage(): void {
    logger.global("----------------------------");

    logger.global("Is this production?", PRODUCTION ? "Yes." : "No.");

    const currentDate = dayjs().format("DD MMMM YYYY");
    const currentTime = dayjs().format("HH:mm:ss");

    logger.global(`Date: ${currentDate} - Time: ${currentTime}`);

    logger.global(
      `[${Game.time}] - tickLimit: ${Game.cpu.tickLimit} | limit: ${Game.cpu.limit} | Bucket: ${Game.cpu.bucket}`
    );

    logger.global("----------------------------");
  }

  private _logGameInfo({ shouldLog }: { shouldLog: boolean }): void {
    if (!shouldLog) return;

    logger.debug(`Current game tick is ${Game.time}`);

    for (const name in Game.rooms) {
      logger.debug(`Room "${name}" has ${Game.rooms[name].energyAvailable} energy`);
    }
  }

  private _logProfilerInfo({ shouldLog }: { shouldLog: boolean }): void {
    if (!shouldLog) return;

    global.Profiler?.loop();
  }
}
