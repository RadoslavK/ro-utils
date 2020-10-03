import { RefineType } from '../types/refineType.type';
import { OreType } from '../types/oreType.type';

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