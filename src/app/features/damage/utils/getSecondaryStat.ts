import { Stats } from '../types/stats.type';
import { DamageType } from '../types/damageType';

export const getSecondaryStat = ({ str, dex }: Stats, damageType: DamageType): number =>
  damageType === DamageType.PhysicalMelee ? dex : str;