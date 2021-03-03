type RoleMap = {
  [key in CreepRole]: number;
};

const minimumCreepsOfType: () => RoleMap = () => ({
  harvester: 2,
  builder: 1,
  upgrader: 1,
  unassigned: 0
});

export const defaultSettings: () => MemorySettings = () => ({
  version: "1.0.3",

  minimumCreepsOfType: minimumCreepsOfType()
});
