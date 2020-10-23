import { RefineType } from '../../../types/refineType.type';
import { OreType } from '../../../types/oreType.type';

export const getOreLabel = (refineType: RefineType, ore: OreType): string => {
  const isWeapon = refineType !== RefineType.Armor;
  const oreName = isWeapon ? 'Oridecon' : 'Elunium';

  switch(ore) {
    case OreType.Enriched:
      return `Enriched ${oreName}`;
    case OreType.HD:
      return `HD ${oreName}`;
    case OreType.Normal:
      return oreName;
    default:
      throw new Error(`Unknown ore type: ${ore}`);
  }
};