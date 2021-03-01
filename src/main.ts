import { ErrorMapper } from "utils/ErrorMapper";

import { Brain } from "global/brain";

// Initialise main brain
const mainBrain = new Brain();

export const loop = ErrorMapper.wrapLoop(() => {
  mainBrain.loop(); // Loop main brain
});
