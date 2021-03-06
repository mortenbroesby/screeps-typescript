export function findStructuresByType<T extends StructureConstant>(
  room: Room,
  structureType: T,
  filter?: (s: ConcreteStructure<T>) => boolean
): ConcreteStructure<T>[] {
  const structures = room
    .find(FIND_STRUCTURES)
    .filter((s): s is ConcreteStructure<T> => s.structureType === structureType);

  return filter ? structures.filter(filter) : structures;
}
