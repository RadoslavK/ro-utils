import { RefineType } from '../types/refineType.type';
import { RefineMaterial } from '../types/refineMaterial.type';

export const refineChances: Record<RefineType, Record<RefineMaterial, readonly number[]>> = {
  [RefineType.Weapon1]: {
    [RefineMaterial.Normal]: [100, 100, 100, 100, 100, 100, 100, 60, 40, 19],
    [RefineMaterial.Enriched]: [100, 100, 100, 100, 100, 100, 100, 90, 70, 30],
    [RefineMaterial.HD]: [100, 100, 100, 100, 100, 100, 100, 90, 70, 30],
  },
  [RefineType.Weapon2]: {
    [RefineMaterial.Normal]: [100, 100, 100, 100, 100, 100, 60, 40, 20, 19],
    [RefineMaterial.Enriched]: [100, 100, 100, 100, 100, 100, 90, 70, 40, 30],
    [RefineMaterial.HD]: [100, 100, 100, 100, 100, 100, 90, 70, 40, 30],
  },
  [RefineType.Weapon3]: {
    [RefineMaterial.Normal]: [100, 100, 100, 100, 100, 60, 50, 20, 20, 19],
    [RefineMaterial.Enriched]: [100, 100, 100, 100, 100, 90, 80, 40, 40, 30],
    [RefineMaterial.HD]: [100, 100, 100, 100, 100, 90, 80, 40, 40, 30],
  },
  [RefineType.Weapon4]: {
    [RefineMaterial.Normal]: [100, 100, 100, 100, 60, 40, 40, 20, 20, 9],
    [RefineMaterial.Enriched]: [100, 100, 100, 100, 90, 70, 70, 40, 40, 20],
    [RefineMaterial.HD]: [100, 100, 100, 100, 90, 70, 70, 40, 40, 20],
  },
  [RefineType.Armor]: {
    [RefineMaterial.Normal]: [100, 100, 100, 100, 60, 40, 40, 20, 20, 9],
    [RefineMaterial.Enriched]: [100, 100, 100, 100, 90, 70, 70, 40, 40, 20],
    [RefineMaterial.HD]: [100, 100, 100, 100, 90, 70, 70, 40, 40, 20],
  },
};