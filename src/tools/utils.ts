type VoidAction = () => void;
type PotentialAction = VoidAction | undefined;

export function executeAction(action: PotentialAction): boolean {
  const actionIsFunction = typeof action === "function";

  if (action !== undefined && actionIsFunction) {
    action();

    return true;
  }

  return false;
}

export function convertToString(objects: unknown[]): string {
  const stringifiedObject: string = objects.reduce((accumulatedString: string, value: unknown) => {
    if (typeof value === "string") {
      return `${accumulatedString} ${value}`;
    }

    const stringifiedValue = JSON.stringify(value)
      .replace(/:(\d+)([,}])/g, ':"$1"$2')
      .replace(/:(true|false|null)/g, ':"$1"');

    return `${accumulatedString} ${stringifiedValue}`;
  }, "");

  return stringifiedObject;
}
