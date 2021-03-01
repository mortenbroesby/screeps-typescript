import dayjs from "dayjs";
import { logger } from "tools/logger";

import { Manager, ManagerPriority } from "./abstract";

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
    logger.debug(`Current game tick is ${Game.time}`);

    for (var name in Game.rooms) {
      logger.debug('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
    }
  }

  /**
   * Internal functions.
   */
  private logInitialDebugMessage(): void {
    console.log("----------------------------")
    console.log("Is production? -", PRODUCTION ? "Yes." : "No.")

    const currentDate = dayjs().format('MM.DD.YYYY');
    const currentTime = dayjs().format('HH:mm:ss');

    console.log(`Build date: ${currentDate}`)
    console.log(`Build time: ${currentTime}`)
    console.log("----------------------------")
  }
}
