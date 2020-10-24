import { Equip } from '../types/equip';

export const isLeftHandEquip = (equip: Equip): boolean => {
  switch (equip) {
    case Equip.Shield:
    case Equip.DaggerLeft:
    case Equip.OneHandAxeLeft:
    case Equip.OneHandSwordLeft:
      return true;

    default:
      return false;
  }
};