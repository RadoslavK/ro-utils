import { WeaponType } from '../types/weaponType';

export const isWearingRangedWeapon = (weaponType: WeaponType): boolean => {
  switch (weaponType) {
    case WeaponType.Bow:
    case WeaponType.Instrument:
    case WeaponType.Whip:
      return true;

    case WeaponType.Axe:
    case WeaponType.BareHand:
    case WeaponType.Book:
    case WeaponType.Dagger:
    case WeaponType.Katar:
    case WeaponType.Knuckle:
    case WeaponType.Mace:
    case WeaponType.OneHandSword:
    case WeaponType.Spear:
    case WeaponType.SpearPeco:
    case WeaponType.Staff:
    case WeaponType.TwoHandSword:
      return false;

    default:
      throw new Error(`Invalid weapon ${weaponType}`);
  }
}