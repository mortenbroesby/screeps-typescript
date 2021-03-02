export interface ManagerSettings {
  name: string;
}

export abstract class Manager {
  private _name = "AbstractManager";

  public get settings(): ManagerSettings {
    return {
      name: this._name
    };
  }

  public constructor({ name }: { name: string }) {
    this._name = name;
  }

  public loop(): void {
    throw new Error("manager should override loop()");
  }
}
