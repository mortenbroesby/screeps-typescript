import { Role } from "../enums";

export interface RoleSettings {
  name: string;
  role: Role;
}

export abstract class CreepRole {
  private _name = "AbstractRole";
  private _role: Role = Role.Unassigned;
  private _creep: Creep;
  private _currentRoom: Room;

  public get creep(): Creep {
    return this._creep;
  }

  public get currentRoom(): Room {
    return this._currentRoom;
  }

  public get settings(): RoleSettings {
    return {
      name: this._name,
      role: this._role
    };
  }

  public constructor({ name, role, creep, room }: { name: string; role: Role; creep: Creep; room: Room }) {
    this._name = name;
    this._role = role;
    this._creep = creep;
    this._currentRoom = room;
  }

  public run(): void {
    throw new Error("role should override run()");
  }
}
