import { Stats } from '../types/stats.type';
import { getMainStat } from './getMainStat';
import { getSecondaryStat } from './getSecondaryStat';
import { WeaponType } from '../types/weaponType';

export const getStatusAtk = (stats: Stats, weaponType: WeaponType): number => {
  const mainStat = getMainStat(stats, weaponType);
  const secondaryStat = getSecondaryStat(stats, weaponType);
  const { baseLevel, luk } = stats;

  return Math.floor(baseLevel / 4
    + mainStat
    + secondaryStat / 5
    + luk / 3);
}