import { Stats } from '../types/stats.type';
import { DamageType } from '../types/damageType';

export const getMainStat = ({ str, dex }: Stats, damageType: DamageType): number =>
  damageType === DamageType.PhysicalMelee ? str : dex;