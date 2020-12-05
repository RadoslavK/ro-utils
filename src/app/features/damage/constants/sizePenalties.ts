import { Size } from '../types/size';
import { WeaponType } from '../types/weaponType';

export const sizePenalties: Record<WeaponType, Record<Size, number>> = {
  [WeaponType.BareHand]: {
    [Size.Small]: 100,
    [Size.Medium]: 100,
    [Size.Large]: 100,
  },

  [WeaponType.Dagger]: {
    [Size.Small]: 100,
    [Size.Medium]: 75,
    [Size.Large]: 50,
  },

  [WeaponType.OneHandSword]: {
    [Size.Small]: 75,
    [Size.Medium]: 100,
    [Size.Large]: 75,
  },

  [WeaponType.TwoHandSword]: {
    [Size.Small]: 75,
    [Size.Medium]: 75,
    [Size.Large]: 100,
  },

  [WeaponType.Spear]: {
    [Size.Small]: 75,
    [Size.Medium]: 75,
    [Size.Large]: 100,
  },

  [WeaponType.SpearPeco]: {
    [Size.Small]: 75,
    [Size.Medium]: 100,
    [Size.Large]: 100,
  },

  [WeaponType.Axe]: {
    [Size.Small]: 50,
    [Size.Medium]: 75,
    [Size.Large]: 100,
  },

  [WeaponType.Mace]: {
    [Size.Small]: 75,
    [Size.Medium]: 100,
    [Size.Large]: 100,
  },

  [WeaponType.Staff]: {
    [Size.Small]: 100,
    [Size.Medium]: 100,
    [Size.Large]: 100,
  },

  [WeaponType.Bow]: {
    [Size.Small]: 100,
    [Size.Medium]: 100,
    [Size.Large]: 75,
  },

  [WeaponType.Katar]: {
    [Size.Small]: 75,
    [Size.Medium]: 100,
    [Size.Large]: 75,
  },

  [WeaponType.Book]: {
    [Size.Small]: 100,
    [Size.Medium]: 100,
    [Size.Large]: 50,
  },

  [WeaponType.Knuckle]: {
    [Size.Small]: 100,
    [Size.Medium]: 100,
    [Size.Large]: 75,
  },

  [WeaponType.Instrument]: {
    [Size.Small]: 75,
    [Size.Medium]: 100,
    [Size.Large]: 75,
  },

  [WeaponType.Whip]: {
    [Size.Small]: 75,
    [Size.Medium]: 100,
    [Size.Large]: 50,
  },
}