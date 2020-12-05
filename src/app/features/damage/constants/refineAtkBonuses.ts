import { RefineType } from '../../refine/types/refineType.type';
import { RefineAtkBonus } from '../types/refineAtkBonus.type';

export const refineAtkBonuses: Record<Exclude<RefineType, RefineType.Armor>, RefineAtkBonus> = {
  [RefineType.Weapon1]: {
    upgrade: 2,
    overUpgradeMax: 3,
  },
  [RefineType.Weapon2]: {
    upgrade: 3,
    overUpgradeMax: 5,
  },
  [RefineType.Weapon3]: {
    upgrade: 5,
    overUpgradeMax: 8,
  },
  [RefineType.Weapon4]: {
    upgrade: 7,
    overUpgradeMax: 14,
  },
};