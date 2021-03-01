import dayjs from "dayjs";

import { logger } from "tools/logger";

import { Manager } from "./abstract";
import { ManagerPriority } from "enums";

export class DebugManager extends Manager {
  public constructor() {
    super({
      name: DebugManager.name,
      priority: ManagerPriority.Standard
    });

    this.logInitialDebugMessage();
  }

  /**
   * Game loop.
   */
  public loop(): void {
    this.logGameInfo({ shouldLog: false });
  }

  /**
   * Internal functions.
   */
  private logInitialDebugMessage(): void {
    console.log("----------------------------")

    console.log("Is this production?", PRODUCTION ? "Yes." : "No.")

    const currentDate = dayjs().format('MM.DD.YYYY');
    const currentTime = dayjs().format('HH:mm:ss');

    console.log(`Date: ${currentDate}`)
    console.log(`Time: ${currentTime}`)

    console.log("----------------------------")
  }

  private logGameInfo({ shouldLog }: { shouldLog: boolean; }): void {
    if (!shouldLog) return;

    logger.debug(`Current game tick is ${Game.time}`);

    for (var name in Game.rooms) {
      logger.debug('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
    }
  }
}
