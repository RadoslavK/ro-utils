import { Variance } from '../types/variance.type';
import { Stats } from '../types/stats.type';
import { getRefinementBonus } from './getRefinementBonus';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { AtkReductions } from '../types/atkReductions.type';
import { DamageType } from '../types/damageType';
import { getMainStat } from './getMainStat';

type Params = {
  readonly atkMultipliers: AtkMultipliers;
  readonly atkReductions: AtkReductions;
  readonly baseWeaponDamage: number;
  readonly damageType: DamageType;
  readonly refineLevel: number;
  readonly stats: Stats;
  readonly useCritical: boolean;
  readonly weaponLevel: number;
}

export const getWeaponAtk = ({
  atkReductions,
  atkMultipliers,
  baseWeaponDamage,
  damageType,
  refineLevel,
  stats,
  useCritical,
  weaponLevel,
}: Params): Variance => {
  const variance = 0.05 * weaponLevel * baseWeaponDamage;
  const statBonus = baseWeaponDamage * getMainStat(stats, damageType) / 200;
  const refinementBonus = getRefinementBonus({ refineLevel, weaponLevel });

  const totalAtkMultiplier = Object
    .values(atkMultipliers)
    .reduce((reduced, multiplier) => reduced * multiplier, 1);

  const totalAtkReduction = Object
    .values(atkReductions)
    .reduce((reduced, reduction) => reduced * reduction, 1);

  const totalMultiplier = totalAtkMultiplier * totalAtkReduction;

  const minVariance = useCritical
    ? variance
    : -variance;
  const maxVariance = variance;

  const min = Math.floor((baseWeaponDamage + minVariance + statBonus + refinementBonus.min) * totalMultiplier);
  const max = Math.floor((baseWeaponDamage + maxVariance + statBonus + refinementBonus.max) * totalMultiplier);

  return { min, max };
}

