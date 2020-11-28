import { RefineType } from '../../refine/types/refineType.type';
import { RefineAtkBonus } from '../types/refineAtkBonus.type';

export const refineAtkBonuses: Record<Exclude<RefineType, 'armor'>, RefineAtkBonus> = {
  [RefineType.Weapon1]: {
    standard: 2,
    overUpgrade: { min: 0, max: 3 },
  },
  [RefineType.Weapon2]: {
    standard: 3,
    overUpgrade: { min: 0, max: 5 },
  },
  [RefineType.Weapon3]: {
    standard: 5,
    overUpgrade: { min: 0, max: 8 },
  },
  [RefineType.Weapon4]: {
    standard: 7,
    overUpgrade: { min: 0, max: 14 },
  },
};