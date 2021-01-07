import { RefineType } from '../../refine/types/refineType.type';
import { RefineAtkBonus } from '../types/refineAtkBonus.type';

//  TODO: this was bugged and seemed to not add any in the game
export const refineAtkBonuses: Record<Exclude<RefineType, RefineType.Armor>, RefineAtkBonus> = {
  [RefineType.Weapon1]: {
    upgrade: 2,
    overUpgradeMin: 1,
    overUpgradeMax: 3,
  },
  [RefineType.Weapon2]: {
    upgrade: 3,
    overUpgradeMin: 1,
    overUpgradeMax: 5,
  },
  [RefineType.Weapon3]: {
    upgrade: 5,
    overUpgradeMin: 0,
    overUpgradeMax: 0,
  },
  [RefineType.Weapon4]: {
    upgrade: 7,
    overUpgradeMin: 1,
    overUpgradeMax: 14,
  },
};