import dayjs from "dayjs";

import { logger } from "tools/logger";
import { Service } from "./abstract";

export class DebugService extends Service {
  public constructor() {
    super({ name: DebugService.name });

    this._logInitialDebugMessage();
  }

  /**
   * Game loop.
   */
  public loop(): void {
    this._logGameInfo({ shouldLog: false });
  }

  /**
   * Internal functions.
   */
  private _logInitialDebugMessage(): void {
    console.log("----------------------------");

    console.log("Is this production?", PRODUCTION ? "Yes." : "No.");

    const currentDate = dayjs().format("MM.DD.YYYY");
    const currentTime = dayjs().format("HH:mm:ss");

    console.log(`Date: ${currentDate}`);
    console.log(`Time: ${currentTime}`);

    console.log("----------------------------");
  }

  private _logGameInfo({ shouldLog }: { shouldLog: boolean }): void {
    if (!shouldLog) return;

    logger.debug(`Current game tick is ${Game.time}`);

    for (const name in Game.rooms) {
      logger.debug(`Room "${name}" has ${Game.rooms[name].energyAvailable} energy`);
    }
  }
}
