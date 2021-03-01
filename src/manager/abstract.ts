import { ManagerPriority } from "enums";

export interface ManagerSettings {
  name: string;
  priority: ManagerPriority;
}

export abstract class Manager {
  private _name: string = "AbstractManager";
  private _priority: ManagerPriority = ManagerPriority.Standard;

  public get settings(): ManagerSettings {
    return {
      name: this._name,
      priority: this._priority
    }
  }

  constructor({ name, priority }: { name: string; priority: ManagerPriority; }) {
    this._name = name;
    this._priority = priority;
  }

  public loop(): void {
    throw new Error("manager should override loop()");
  };
}
