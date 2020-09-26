import { RefineType } from '../types/refineType.type';

export const refineCosts: Record<RefineType, number> = {
  [RefineType.Armor]: 2000,
  [RefineType.Weapon1]: 50,
  [RefineType.Weapon2]: 200,
  [RefineType.Weapon3]: 5000,
  [RefineType.Weapon4]: 20000,
};