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
