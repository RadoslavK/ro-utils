import { WeaponType } from '../types/weaponType';

export const isWearingRangedWeapon = (weaponType: WeaponType): boolean => {
  switch (weaponType) {
    case WeaponType.Bow:
    case WeaponType.Instrument:
    case WeaponType.Whip:
      return true;

    default:
      return false;
  }
}