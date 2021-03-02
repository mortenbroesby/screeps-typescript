export interface IInternals {
  role: Role;
  creep: Creep;
  homeRoom: Room;
}

export abstract class CreepRole {
  private _internals!: IInternals;

  public get creep(): Creep {
    return this._internals.creep;
  }

  public get currentRoom(): Room {
    return this._internals.homeRoom;
  }

  public get role(): Role {
    return this._internals.role;
  }

  public constructor(internals: IInternals) {
    this._internals = internals;
  }

  public run(): void {
    throw new Error("role should override run()");
  }
}
