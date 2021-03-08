import { Controller, Subject } from "../../../core/controller";
import { Brain, Neuron } from "../..";
import { CreepGlia } from "./glia/creep.glia";

export interface Glia extends Subject {
  log(): void;
}

export class RoomNeuron extends Controller<Glia> implements Neuron {
  public constructor(public brain: Brain) {
    super();

    brain.register(this, this.constructor.name);

    Object.values(Game.rooms).forEach((room: Room) => {
      new CreepGlia(this, room);
    });
  }

  public initialise(): void {
    super.initialise();
  }

  public loop(): void {
    super.loop();
  }

  public cleanup(): void {
    super.cleanup();
  }

  public log(): void {
    // Do nothing for now
  }
}
