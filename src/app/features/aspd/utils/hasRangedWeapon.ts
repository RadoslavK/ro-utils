import { Equip } from '../types/equip';

const rangedWeapons: readonly Equip[] = [
  Equip.Bow,
  Equip.Whip,
  Equip.Instrument,
];

export const isWearingRangedWeapon = (equip: readonly Equip[]): boolean =>
  equip.some(e => rangedWeapons.includes(e));