import { Equip } from '../types/equip';

export const isRightHandEquip = (equip: Equip): boolean => {
  switch (equip) {
    case Equip.Dagger:
    case Equip.Instrument:
    case Equip.Mace:
    case Equip.OneHandAxe:
    case Equip.OneHandSpear:
    case Equip.OneHandStaff:
    case Equip.OneHandSword:
    case Equip.Whip:
    case Equip.Book:
    case Equip.Knuckle:
      return true;

    default:
      return false;
  }
};