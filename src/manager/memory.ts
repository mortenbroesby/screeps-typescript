import { Manager, ManagerPriority } from "./abstract";

export class MemoryManager extends Manager {
  public constructor() {
    super({
      name: MemoryManager.name,
      priority: ManagerPriority.Standard
    });
  }

  /**
   * Game loop.
   */
  public loop(): void {
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];
        console.log('Clearing non-existing creep memory:', name);
      }
    }
  }
}
