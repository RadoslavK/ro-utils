import { RefineType } from '../types/refineType.type';
import { OreType } from '../types/oreType.type';

export const getRefineCost = (refineType: RefineType, oreType: OreType): number => {
  switch (refineType) {
    case RefineType.Armor: return oreType === OreType.HD ? 20_000 : 2_000;
    case RefineType.Weapon1: return 50;
    case RefineType.Weapon2: return 200;
    case RefineType.Weapon3: return 5_000;
    case RefineType.Weapon4: return 20_000;
    default: throw new Error(`Unknown refine type: ${refineType}`);
  }
};