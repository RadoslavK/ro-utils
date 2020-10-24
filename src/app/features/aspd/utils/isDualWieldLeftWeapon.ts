import { Equip } from '../types/equip';

export const isDualWieldLeftWeapon = (equip: Equip): boolean => {
  switch (equip) {
    case Equip.DaggerLeft:
    case Equip.OneHandSwordLeft:
    case Equip.OneHandAxeLeft:
      return true;

    default:
      return false;
  }
}