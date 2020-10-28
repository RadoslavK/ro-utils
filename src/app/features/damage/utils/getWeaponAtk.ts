import { Variance } from '../types/variance.type';
import { Stats } from '../types/stats.type';
import { getRefinementBonus } from './getRefinementBonus';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { getMainStat } from './getMainStat';
import { Weapon } from '../types/weapon.type';
import { Reductions } from '../types/reductions.type';
import { getPropertyMultiplier } from './getPropertyMultiplier';

type Params = {
  readonly atkMultipliers: AtkMultipliers;
  readonly reductions: Reductions;
  readonly stats: Stats;
  readonly weapon: Weapon;
}

export const getWeaponAtk = ({
  atkMultipliers,
  reductions,
  stats,
  weapon,
}: Params): Variance => {
  const {
    baseDamage: baseWeaponDamage,
    damageType,
    level: weaponLevel,
    refineLevel,
  } = weapon;
  const variance = 0.05 * weaponLevel * baseWeaponDamage;
  const statBonus = baseWeaponDamage * getMainStat(stats, damageType) / 200;
  const refinementBonus = getRefinementBonus({ refineLevel, weaponLevel });

  const propertyMultiplier = getPropertyMultiplier(weapon.element, reductions);
  const totalAtkMultiplier = atkMultipliers.race
    * atkMultipliers.size
    * atkMultipliers.targetProperty
    * atkMultipliers.monster
    * atkMultipliers.atk
    * propertyMultiplier;

  const totalAtkReductionMultiplier = reductions.atkMultiplier.sizePenalty
    * reductions.atkMultiplier.race
    * reductions.atkMultiplier.size
    * reductions.atkMultiplier.property
    * reductions.atkMultiplier.targetProperty;

  const totalMultiplier = totalAtkMultiplier * totalAtkReductionMultiplier;

  const minVariance = stats.useCritical
    ? variance
    : -variance;
  const maxVariance = variance;

  const min = Math.floor((baseWeaponDamage + minVariance + statBonus + refinementBonus.min) * totalMultiplier);
  const max = Math.floor((baseWeaponDamage + maxVariance + statBonus + refinementBonus.max) * totalMultiplier);

  return { min, max };
}

