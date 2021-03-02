import { Role } from "../enums";

export interface RoleSettings {
  name: string;
  role: Role;
}

export abstract class CreepRole {
  private _name = "AbstractRole";
  private _role: Role = Role.Unassigned;
  private _creep: Creep;

  public get creep(): Creep {
    return this._creep;
  }

  public get settings(): RoleSettings {
    return {
      name: this._name,
      role: this._role
    };
  }

  public constructor({ name, role, creep }: { name: string; role: Role; creep: Creep }) {
    this._name = name;
    this._role = role;
    this._creep = creep;
  }

  public run(): void {
    throw new Error("role should override run()");
  }
}
