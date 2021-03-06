import { mockInstanceOf, mockStructure } from "screeps-jest";

import { findStructuresByType } from "../shared-logic";

describe("findStructuresByType", () => {
  const mockedRoom = mockInstanceOf<Room>({
    find: () => [
      mockStructure(STRUCTURE_CONTAINER),
      mockStructure(STRUCTURE_SPAWN),
      mockStructure(STRUCTURE_RAMPART, { isPublic: false }),
      mockStructure(STRUCTURE_RAMPART, { isPublic: true })
    ]
  });

  it("filters structures by type", () => {
    const spawns: StructureSpawn[] = findStructuresByType(mockedRoom, STRUCTURE_SPAWN);
    const allRamparts: StructureRampart[] = findStructuresByType(mockedRoom, STRUCTURE_RAMPART);
    expect(spawns).toHaveLength(1);
    expect(allRamparts).toHaveLength(2);
  });

  it("allows to use an additional filter", () => {
    const publicRamparts = findStructuresByType(mockedRoom, STRUCTURE_RAMPART, Room => Room.isPublic);
    expect(publicRamparts).toHaveLength(1);
  });
});
