import { Stats } from '../types/stats.type';
import { isWearingRangedWeapon } from './isWearingRangedWeapon';
import { WeaponType } from '../types/weaponType';

export const getSecondaryStat = ({ str, dex }: Stats, weaponType: WeaponType): number =>
  isWearingRangedWeapon(weaponType) ? str : dex;