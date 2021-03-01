export enum ManagerPriority {
  Critical = 1,
  Standard = 2,
  Low = 3,
  Trivial = 4,
  Overflow = 5,
  None = 6
}

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
