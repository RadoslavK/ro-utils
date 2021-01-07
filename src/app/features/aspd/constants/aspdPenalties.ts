import { Equip } from '../types/equip';
import { Class } from '../types/class';
import { AspdPenalties } from '../types/aspdPenalties.type';

export const aspdPenalties: Record<Class, AspdPenalties> = {
  [Class.Novice]: {
    [Equip.Shield]: 10,
    [Equip.Dagger]: 15,
    [Equip.Mace]: 10,
    [Equip.OneHandSword]: 17,
    [Equip.OneHandAxe]: 10,
    [Equip.OneHandStaff]: 25,
  },

  [Class.Archer]: {
    [Equip.Bow]: 10,
    [Equip.Dagger]: 15,
    [Equip.Shield]: 9,
  },
  [Class.Hunter]: {
    [Equip.Bow]: 7,
    [Equip.Dagger]: 13,
    [Equip.Shield]: 9,
  },
  [Class.Bard]: {
    [Equip.Shield]: 5,
    [Equip.Dagger]: 13,
    [Equip.Bow]: 8,
    [Equip.Instrument]: 5,
  },
  [Class.Dancer]: {
    [Equip.Bow]: 8,
    [Equip.Shield]: 5,
    [Equip.Dagger]: 13,
    [Equip.Whip]: 5,
  },

  [Class.Swordman]: {
    [Equip.Shield]: 5,
    [Equip.Dagger]: 7,
    [Equip.OneHandSword]: 7,
    [Equip.TwoHandSword]: 14,
    [Equip.OneHandAxe]: 15,
    [Equip.TwoHandAxe]: 20,
    [Equip.OneHandSpear]: 17,
    [Equip.TwoHandSpear]: 25,
  },
  [Class.Knight]: {
    [Equip.Shield]: 5,
    [Equip.Dagger]: 9,
    [Equip.OneHandSword]: 5,
    [Equip.TwoHandSword]: 2,
    [Equip.OneHandAxe]: 10,
    [Equip.TwoHandAxe]: 15,
    [Equip.Mace]: 5,
    [Equip.OneHandSpear]: 15,
    [Equip.TwoHandSpear]: 20,
  },
  [Class.Crusader]: {
    [Equip.Shield]: 5,
    [Equip.Dagger]: 8,
    [Equip.OneHandSword]: 3,
    [Equip.TwoHandSword]: 15,
    [Equip.OneHandAxe]: 10,
    [Equip.TwoHandAxe]: 15,
    [Equip.Mace]: 5,
    [Equip.OneHandSpear]: 13,
    [Equip.TwoHandSpear]: 10,
  },

  [Class.Merchant]: {
    [Equip.Shield]: 5,
    [Equip.Dagger]: 12,
    [Equip.OneHandSword]: 12,
    [Equip.OneHandAxe]: 8,
    [Equip.TwoHandAxe]: 15,
    [Equip.Mace]: 10,
  },
  [Class.Blacksmith]: {
    [Equip.Shield]: 5,
    [Equip.Dagger]: 10,
    [Equip.OneHandSword]: 10,
    [Equip.OneHandAxe]: 6,
    [Equip.TwoHandAxe]: 12,
    [Equip.Mace]: 8,
  },
  [Class.Alchemist]: {
    [Equip.Shield]: 4,
    [Equip.Dagger]: 10,
    [Equip.OneHandSword]: 5,
    [Equip.OneHandAxe]: 5,
    [Equip.TwoHandAxe]: 12,
    [Equip.Mace]: 5,
  },

  [Class.Mage]: {
    [Equip.Shield]: 10,
    [Equip.Dagger]: 0,
    [Equip.OneHandStaff]: 5,
    [Equip.TwoHandStaff]: 5,
  },
  [Class.Wizard]: {
    [Equip.Shield]: 8,
    [Equip.Dagger]: 4,
    [Equip.OneHandStaff]: 3,
    [Equip.TwoHandStaff]: 3,
  },
  [Class.Sage]: {
    [Equip.Shield]: 3,
    [Equip.Dagger]: 8,
    [Equip.OneHandStaff]: 10,
    [Equip.TwoHandStaff]: 10,
    [Equip.Book]: 2,
  },

  [Class.Acolyte]: {
    [Equip.Shield]: 7,
    [Equip.Mace]: 5,
    [Equip.OneHandStaff]: 20,
    [Equip.TwoHandStaff]: 20,
  },
  [Class.Priest]: {
    [Equip.Shield]: 5,
    [Equip.Mace]: 3,
    [Equip.OneHandStaff]: 20,
    [Equip.TwoHandStaff]: 20,
    [Equip.Book]: 4,
    [Equip.Knuckle]: 20,
  },
  [Class.Monk]: {
    [Equip.Shield]: 3,
    [Equip.Mace]: 3,
    [Equip.OneHandStaff]: 20,
    [Equip.TwoHandStaff]: 18,
    [Equip.Knuckle]: 0,
  },

  [Class.Thief]: {
    [Equip.Shield]: 6,
    [Equip.Dagger]: 8,
    [Equip.OneHandSword]: 10,
    [Equip.OneHandAxe]: 20,
    [Equip.Bow]: 13,
  },
  [Class.Assassin]: {
    [Equip.Shield]: 6,
    [Equip.Dagger]: 2,
    [Equip.OneHandSword]: 10,
    [Equip.OneHandAxe]: 11,
    [Equip.Katar]: 2,
    [Equip.DaggerLeft]: 10,
    [Equip.OneHandSwordLeft]: 12,
    [Equip.OneHandAxeLeft]: 12,
  },
  [Class.Rogue]: {
    [Equip.Shield]: 3,
    [Equip.Dagger]: 5,
    [Equip.OneHandSword]: 10,
    [Equip.Bow]: 10,
  },
};