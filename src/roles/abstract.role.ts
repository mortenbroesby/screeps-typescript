export interface BaseRoleInternals {
  role: CreepRole;
  creep: Creep;
  homeRoom: Room;
}

export interface BaseRoleMemory extends CreepMemory {
  homeRoom: string;
  role: CreepRole;
}

export abstract class BaseRole<TMemory extends BaseRoleMemory> {
  private _internals: BaseRoleInternals;

  public constructor(internals: BaseRoleInternals) {
    this._internals = internals;
  }

  public get creep(): Creep {
    return this._internals.creep;
  }

  public get homeRoom(): Room {
    return this._internals.homeRoom;
  }

  public get role(): CreepRole {
    return this._internals.role;
  }

  public get memory(): TMemory {
    return this.creep.memory as TMemory;
  }
  public set memory(memory: TMemory) {
    this.creep.memory = memory;
  }

  public run(): void {
    throw new Error("role should override run()");
  }
}
