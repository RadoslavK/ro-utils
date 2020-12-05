import { Variance } from '../types/variance.type';
import { RefineType } from '../../refine/types/refineType.type';
import { refineAtkBonuses } from '../constants/refineAtkBonuses';

type Params = {
  readonly refineLevel: number;
  readonly weaponLevel: number;
};

const getRefineType = (weaponLevel: number): Exclude<RefineType, RefineType.Armor> => {
  switch (weaponLevel) {
    case 1: return RefineType.Weapon1;
    case 2: return RefineType.Weapon2;
    case 3: return RefineType.Weapon3;
    case 4: return RefineType.Weapon4;
    default: throw new Error(`Unknown weapon level: ${weaponLevel}`);
  }
};

const getSafeRefineLevel = (refineType: Exclude<RefineType, RefineType.Armor>): number => {
  switch (refineType) {
    case RefineType.Weapon1:
      return 7;
    case RefineType.Weapon2:
      return 6;
    case RefineType.Weapon3:
      return 5;
    case RefineType.Weapon4:
      return 4;
    default:
      throw new Error(`Unknown safe refine type ${refineType}`);
  }
};

export const getRefinementBonus = ({
  refineLevel,
  weaponLevel,
}: Params): Variance => {
  const refineType = getRefineType(weaponLevel);
  const safeRefineLevel = getSafeRefineLevel(refineType);
  const refinesOverSafeLevel = Math.max(0, refineLevel - safeRefineLevel);
  const refineBonus = refineAtkBonuses[refineType];

  const standardRefineBonus = refineBonus.upgrade * refineLevel;
  const overUpgradeRefineBonusMax = refineBonus.overUpgradeMax * refinesOverSafeLevel;

  return {
    min: standardRefineBonus,
    max: standardRefineBonus + overUpgradeRefineBonusMax,
  };
};