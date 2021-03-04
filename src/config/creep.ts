export const defaultCreepMemory: (role?: CreepRole) => CreepMemory = (role: CreepRole = "unassigned") => ({
  version: "1.0.3",
  role,
  state: "idle"
});
