import { Stats } from '../types/stats.type';
import { DamageType } from '../types/damageType';
import { getMainStat } from './getMainStat';
import { getSecondaryStat } from './getSecondaryStat';

export const getStatusAtk = (
  stats: Stats,
  damageType: DamageType,
): number => {
  const mainStat = getMainStat(stats, damageType);
  const secondaryStat = getSecondaryStat(stats, damageType);
  const { baseLevel, luk } = stats;

  return Math.floor((baseLevel / 4) + mainStat + (secondaryStat / 5) + (luk / 3));
}