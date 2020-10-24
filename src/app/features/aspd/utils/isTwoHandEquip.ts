import { Equip } from '../types/equip';

export const isTwoHandEquip = (equip: Equip): boolean => {
  switch (equip) {
    case Equip.Bow:
    case Equip.TwoHandAxe:
    case Equip.TwoHandSpear:
    case Equip.TwoHandStaff:
    case Equip.TwoHandSword:
    case Equip.Katar:
      return true;

    default:
      return false;
  }
};