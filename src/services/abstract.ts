export interface ServiceSettings {
  name: string;
}

export abstract class Service {
  private _name = "AbstractManager";

  public get settings(): ServiceSettings {
    return {
      name: this._name
    };
  }

  public constructor({ name }: { name: string }) {
    this._name = name;
  }

  public loop(): void {
    throw new Error("service should override loop()");
  }
}
