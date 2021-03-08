type DefaultMemory = (role?: CreepRole) => CreepMemory;

export const defaultCreepMemory: DefaultMemory = (role: CreepRole = "unassigned") => ({
  version: "1.0.3",
  role,
  state: "idle"
});
