import { Equip } from '../types/equip';

export const isDualWieldRightWeapon = (equip: Equip): boolean => {
  switch (equip) {
    case Equip.Dagger:
    case Equip.OneHandSword:
    case Equip.OneHandAxe:
      return true;

    default:
      return false;
  }
}