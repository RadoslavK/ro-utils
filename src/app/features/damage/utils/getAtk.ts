import { Variance } from '../types/variance.type';
import { Stats } from '../types/stats.type';
import { getStatusAtk } from './getStatusAtk';
import { DamageType } from '../types/damageType';
import { getWeaponAtk } from './getWeaponAtk';
import { getExtraAtk } from './getExtraAtk';
import { BonusAtk } from '../types/bonusAtk.type';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { AtkReductions } from '../types/atkReductions.type';

type Params = {
  readonly atkMultipliers: AtkMultipliers;
  readonly atkReductions: AtkReductions;
  readonly baseWeaponDamage: number;
  readonly bonusAtk: BonusAtk;
  readonly damageType: DamageType;
  readonly refineLevel: number;
  readonly stats: Stats;
  readonly useCritical: boolean;
  readonly weaponLevel: number;
};

export const getAtk = ({
  atkMultipliers,
  atkReductions,
  baseWeaponDamage,
  bonusAtk,
  damageType,
  refineLevel,
  stats,
  useCritical,
  weaponLevel,
}: Params): Variance => {
  const statusAtk = getStatusAtk(stats, damageType);
  const weaponAtk = getWeaponAtk({
    atkMultipliers,
    atkReductions,
    baseWeaponDamage,
    damageType,
    refineLevel,
    stats,
    useCritical,
    weaponLevel,
  });
  const { extraAtk, buffAtk, masteryAtk } = bonusAtk;
  const totalExtraAtk = getExtraAtk({ atkMultipliers, atkReductions, extraAtk });

  return {
    min: statusAtk * 2 + weaponAtk.min + totalExtraAtk + masteryAtk + buffAtk,
    max: statusAtk * 2 + weaponAtk.max + totalExtraAtk + masteryAtk + buffAtk,
  };
};