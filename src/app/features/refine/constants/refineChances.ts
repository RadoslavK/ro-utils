import { RefineType } from '../types/refineType.type';
import { OreType } from '../types/oreType.type';
import { RefineInput } from '../types/refineInput.type';

export const refineChances: Record<RefineType, Record<OreType, readonly number[]>> = {
  [RefineType.Weapon1]: {
    [OreType.Normal]: [100, 100, 100, 100, 100, 100, 100, 60, 40, 19],
    [OreType.Enriched]: [100, 100, 100, 100, 100, 100, 100, 90, 70, 30],
    [OreType.HD]: [100, 100, 100, 100, 100, 100, 100, 90, 70, 30],
  },
  [RefineType.Weapon2]: {
    [OreType.Normal]: [100, 100, 100, 100, 100, 100, 60, 40, 20, 19],
    [OreType.Enriched]: [100, 100, 100, 100, 100, 100, 90, 70, 40, 30],
    [OreType.HD]: [100, 100, 100, 100, 100, 100, 90, 70, 40, 30],
  },
  [RefineType.Weapon3]: {
    [OreType.Normal]: [100, 100, 100, 100, 100, 60, 50, 20, 20, 19],
    [OreType.Enriched]: [100, 100, 100, 100, 100, 90, 80, 40, 40, 30],
    [OreType.HD]: [100, 100, 100, 100, 100, 90, 80, 40, 40, 30],
  },
  [RefineType.Weapon4]: {
    [OreType.Normal]: [100, 100, 100, 100, 60, 40, 40, 20, 20, 9],
    [OreType.Enriched]: [100, 100, 100, 100, 90, 70, 70, 40, 40, 20],
    [OreType.HD]: [100, 100, 100, 100, 90, 70, 70, 40, 40, 20],
  },
  [RefineType.Armor]: {
    [OreType.Normal]: [100, 100, 100, 100, 60, 40, 40, 20, 20, 9],
    [OreType.Enriched]: [100, 100, 100, 100, 90, 70, 70, 40, 40, 20],
    [OreType.HD]: [100, 100, 100, 100, 90, 70, 70, 40, 40, 20],
  },
};

export const getRefineChance = (refineType: RefineType, oreType: OreType, level: number): number => {
  const typeTable = refineChances[refineType];

  if (!typeTable) {
    throw new Error(`Did not find refine type table for ${refineType}`);
  }

  const oreTable = typeTable[oreType];

  if (!oreType) {
    throw new Error(`Did not find refine table for ${refineType}, ore: ${oreType}`);
  }

  const chance = oreTable[level - 1];

  if (chance === undefined) {
    throw new Error(`Did not find refine chance for ${refineType}, ${oreType}, level: ${level}`);
  }

  return chance;
};