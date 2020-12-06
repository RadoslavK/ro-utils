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

    case Equip.TwoHandSword:
    case Equip.TwoHandStaff:
    case Equip.TwoHandSpear:
    case Equip.TwoHandAxe:
    case Equip.Katar:
    case Equip.Bow:
    case Equip.BareHand:
    case Equip.Shield:
    case Equip.OneHandSwordLeft:
    case Equip.OneHandAxeLeft:
    case Equip.DaggerLeft:
      return false;

    default:
      throw new Error(`Invalid equip ${equip}`);
  }
};