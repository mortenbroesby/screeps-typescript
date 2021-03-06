import { Priority } from "../enums";

const minimumCreepsOfType: () => MinimumCreepCountMap = () => ({
  harvester: {
    count: 1,
    priority: Priority.Critical
  },

  builder: {
    count: 2,
    priority: Priority.Standard
  },

  upgrader: {
    count: 2,
    priority: Priority.Standard
  },

  unassigned: {
    count: 0,
    priority: Priority.None
  }
});

export const defaultSettings: () => MemorySettings = () => ({
  version: "1.0.3",

  minimumCreepsOfType: minimumCreepsOfType()
});
