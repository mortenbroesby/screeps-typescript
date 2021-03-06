import dayjs from "dayjs";

import Constants from "../../../config/constants";
import { logger } from "../../../tools/logger";
import { Brain, Neuron } from "../..";

export class DebugNeuron implements Neuron {
  public constructor(public brain: Brain) {
    brain.register(this, this.constructor.name);
  }

  public initialise(): void {
    this._logInitialDebugMessage();
  }

  public loop(): void {
    this._logGameInfo({ shouldLog: false });
  }

  public cleanup(): void {
    // Do nothing for now
  }

  private _logInitialDebugMessage(): void {
    logger.global("----------------------------");

    logger.global("Is this production?", Constants.isProduction ? "Yes." : "No.");

    const currentDate = dayjs().format("DD MMMM YYYY");
    const currentTime = dayjs().format("HH:mm:ss");

    logger.global(`Date: ${currentDate} - Time: ${currentTime}`);

    let cpuMessage = `Time: [${Game.time}] - tickLimit: ${Game.cpu.tickLimit}`;
    cpuMessage += ` | limit: ${Game.cpu.limit ?? "Infinite"}`;
    cpuMessage += ` | Bucket: ${Game.cpu.bucket}`;

    logger.global(cpuMessage);

    logger.global("----------------------------");
  }

  private _logGameInfo({ shouldLog }: { shouldLog: boolean }): void {
    if (!shouldLog) return;

    logger.debug(`Current game tick is ${Game.time}`);

    for (const name in Game.rooms) {
      logger.debug(`Room "${name}" has ${Game.rooms[name].energyAvailable} energy`);
    }
  }

  public log(): void {
    // Do nothing for now
  }
}
