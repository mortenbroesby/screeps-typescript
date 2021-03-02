import { Service } from "./abstract";

export class RoomService extends Service {
  public constructor() {
    super({ name: RoomService.name });
  }

  /**
   * Game loop.
   */
  public loop(): void {
    // logger.debug("RoomService is looping");
  }
}
