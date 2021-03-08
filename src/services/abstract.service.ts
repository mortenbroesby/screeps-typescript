import { Brain } from "../global/brain";

export interface ServiceSettings {
  name: string;
}

export abstract class Service {
  public constructor(public brain: Brain) {
    brain.register(this);
  }

  /**
   * Initialise service
   * Note: Invoked every global reset.
   */
  public abstract initialise(): void;

  /**
   * Perform logic loop
   * Note: Invoked every tick.
   */
  public abstract loop(): void;

  /**
   * Cleanup after logic loop
   * Note: Invoked every tick.
   */
  public abstract cleanup(): void;
}
