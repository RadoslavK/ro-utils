import { OreType } from '../types/oreType.type';
import { RefineType } from '../types/refineType.type';
import { refineItemIds } from '../constants/refineItemIds';

export const getOreId = (oreType: OreType, refineType: RefineType): number => {
  switch (oreType) {
    case OreType.Normal:
      switch (refineType) {
        case RefineType.Armor:
          return refineItemIds.Elunium;
        case RefineType.Weapon1:
          return refineItemIds.Phracon;
        case RefineType.Weapon2:
          return refineItemIds.Emveretarcon;
        case RefineType.Weapon3:
        case RefineType.Weapon4:
          return refineItemIds.Oridecon;

        default:
          throw new Error(`Unknown refine type: ${refineType}`);

      }

    case OreType.Enriched:
      return refineType === RefineType.Armor
        ? refineItemIds.EnrichedElunium
        : refineItemIds.EnrichedOridecon;

    case OreType.HD:
      return refineType === RefineType.Armor
        ? refineItemIds.HDElunium
        : refineItemIds.HDOridecon;

    default:
      throw new Error(`Unknown ore type: ${oreType}`);
  }
}