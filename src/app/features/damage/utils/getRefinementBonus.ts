import { Variance } from '../types/variance.type';
import { refineChances } from '../../refine/constants/refineChances';
import { RefineType } from '../../refine/types/refineType.type';
import { refineAtkBonuses } from '../constants/refineAtkBonuses';

type Params = {
  readonly refineLevel: number;
  readonly weaponLevel: number;
};

const getRefineType = (weaponLevel: number): RefineType => {
  switch (weaponLevel) {
    case 1: return RefineType.Weapon1;
    case 2: return RefineType.Weapon2;
    case 3: return RefineType.Weapon3;
    case 4: return RefineType.Weapon4;
    default: throw new Error(`Unknown weapon level: ${weaponLevel}`);
  }
};

const getSafeRefineChance = (refineType: RefineType): number =>
  refineChances[refineType].normal.filter(chance => chance === 100).length;

export const getRefinementBonus = ({
  refineLevel,
  weaponLevel,
}: Params): Variance => {
  const refineType = getRefineType(weaponLevel);
  const safeRefineLevel = getSafeRefineChance(refineType);
  const refinesOverSafeLevel = Math.max(0, refineLevel - safeRefineLevel);
  const refineBonus = refineAtkBonuses[refineType];

  const standardRefineBonus = refineBonus.standard * refineLevel;
  const overUpgradeRefineBonusMin = refineBonus.overUpgrade.min * refinesOverSafeLevel;
  const overUpgradeRefineBonusMax = refineBonus.overUpgrade.max * refinesOverSafeLevel;

  return {
    min: standardRefineBonus + overUpgradeRefineBonusMin,
    max: standardRefineBonus + overUpgradeRefineBonusMax,
  };
};