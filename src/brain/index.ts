import { Controller, Subject } from "../core/controller";
import { DebugNeuron } from "./neurons/debug/debug.neuron";
import { MemoryService } from "./neurons/memory/memory.neuron";
import { RoomNeuron } from "./neurons/room/room.neuron";

export interface Neuron extends Subject {
  log(): void;
}

export class Brain extends Controller<Neuron> {
  public constructor() {
    super();

    new DebugNeuron(this);
    new MemoryService(this);
    new RoomNeuron(this);
  }
}
