import { Equip } from '../types/equip';

export const isDualWieldLeftWeapon = (equip: Equip): boolean => {
  switch (equip) {
    case Equip.DaggerLeft:
    case Equip.OneHandSwordLeft:
    case Equip.OneHandAxeLeft:
      return true;

    case Equip.Whip:
    case Equip.TwoHandSword:
    case Equip.TwoHandStaff:
    case Equip.TwoHandSpear:
    case Equip.TwoHandAxe:
    case Equip.Shield:
    case Equip.OneHandStaff:
    case Equip.OneHandSpear:
    case Equip.Mace:
    case Equip.Knuckle:
    case Equip.Katar:
    case Equip.Instrument:
    case Equip.Bow:
    case Equip.Book:
    case Equip.BareHand:
    case Equip.Dagger:
    case Equip.OneHandAxe:
    case Equip.OneHandSword:
      return false;

    default:
      throw new Error(`Invalid equip: ${equip}`);
  }
}