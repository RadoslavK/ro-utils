import { Stats } from '../types/stats.type';
import { WeaponType } from '../types/weaponType';
import { isWearingRangedWeapon } from './isWearingRangedWeapon';

export const getMainStat = ({ str, dex }: Stats, weaponType: WeaponType): number =>
  isWearingRangedWeapon(weaponType) ? dex : str;