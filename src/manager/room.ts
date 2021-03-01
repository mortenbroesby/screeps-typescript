import { ManagerPriority } from "enums";
import { Manager } from "./abstract";

export class RoomManager extends Manager {
  public constructor() {
    super({
      name: RoomManager.name,
      priority: ManagerPriority.Standard
    });
  }

  /**
   * Game loop.
   */
  public loop(): void {}
}
