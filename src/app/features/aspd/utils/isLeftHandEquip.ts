import { Equip } from '../types/equip';

export const isLeftHandEquip = (equip: Equip): boolean => {
  switch (equip) {
    case Equip.Shield:
    case Equip.DaggerLeft:
    case Equip.OneHandAxeLeft:
    case Equip.OneHandSwordLeft:
      return true;

    case Equip.OneHandSword:
    case Equip.OneHandAxe:
    case Equip.Dagger:
    case Equip.BareHand:
    case Equip.Book:
    case Equip.Bow:
    case Equip.Instrument:
    case Equip.Katar:
    case Equip.Knuckle:
    case Equip.Mace:
    case Equip.OneHandSpear:
    case Equip.OneHandStaff:
    case Equip.TwoHandAxe:
    case Equip.TwoHandSpear:
    case Equip.TwoHandStaff:
    case Equip.TwoHandSword:
    case Equip.Whip:
      return false;

    default:
      throw new Error(`Invalid equip ${equip}`);
  }
};