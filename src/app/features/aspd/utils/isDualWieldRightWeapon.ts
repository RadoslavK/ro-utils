import { Equip } from '../types/equip';

export const isDualWieldRightWeapon = (equip: Equip): boolean => {
  switch (equip) {
    case Equip.Dagger:
    case Equip.OneHandSword:
    case Equip.OneHandAxe:
      return true;

    case Equip.BareHand:
    case Equip.Book:
    case Equip.Bow:
    case Equip.DaggerLeft:
    case Equip.Instrument:
    case Equip.Katar:
    case Equip.Knuckle:
    case Equip.Mace:
    case Equip.OneHandAxeLeft:
    case Equip.OneHandSpear:
    case Equip.OneHandStaff:
    case Equip.OneHandSwordLeft:
    case Equip.Shield:
    case Equip.TwoHandAxe:
    case Equip.TwoHandSpear:
    case Equip.TwoHandStaff:
    case Equip.TwoHandSword:
    case Equip.Whip:
      return false;

    default:
      throw new Error(`Invalid equip: ${equip}`);
  }
}