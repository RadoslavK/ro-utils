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

    case Equip.DaggerLeft:
    case Equip.OneHandAxeLeft:
    case Equip.OneHandSwordLeft:
    case Equip.Shield:
    case Equip.BareHand:
    case Equip.Whip:
    case Equip.OneHandStaff:
    case Equip.OneHandSpear:
    case Equip.Mace:
    case Equip.Knuckle:
    case Equip.Instrument:
    case Equip.Book:
    case Equip.Dagger:
    case Equip.OneHandAxe:
    case Equip.OneHandSword:
      return false;

    default:
      throw new Error(`Invalid equip ${equip}`);
  }
};