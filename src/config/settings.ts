type RoleMap = {
  [key in Role]: number;
};

const minimumCreepsInRoom: RoleMap = {
  Harvester: 2,
  Builder: 1,
  Upgrader: 1,
  Unassigned: 0
};

export const defaultSettings: MemorySettings = {
  version: "1.0.2",

  minimumCreepsInRoom
};
