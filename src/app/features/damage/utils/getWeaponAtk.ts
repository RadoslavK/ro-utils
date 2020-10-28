import { Variance } from '../types/variance.type';
import { Stats } from '../types/stats.type';
import { getRefinementBonus } from './getRefinementBonus';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { getMainStat } from './getMainStat';
import { Weapon } from '../types/weapon.type';
import { Target } from '../types/reductions.type';
import { getPropertyMultiplier } from './getPropertyMultiplier';
import { getSizePenalty } from './getSizePenalty';

type Params = {
  readonly atkMultipliers: AtkMultipliers;
  readonly stats: Stats;
  readonly target: Target;
  readonly weapon: Weapon;
}

export const getWeaponAtk = ({
  atkMultipliers,
  stats,
  target,
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

  const propertyMultiplier = getPropertyMultiplier(weapon.element, target.property);
  const totalAtkMultiplier = atkMultipliers.race
    * atkMultipliers.size
    * atkMultipliers.targetProperty
    * atkMultipliers.monster
    * atkMultipliers.atk
    * propertyMultiplier;

  const sizePenalty = getSizePenalty(weapon.type, target.size);
  const totalAtkReductionMultiplier = sizePenalty
    * target.atkReductionMultiplier.race
    * target.atkReductionMultiplier.size
    * target.atkReductionMultiplier.property
    * target.atkReductionMultiplier.targetProperty;

  const totalMultiplier = totalAtkMultiplier * totalAtkReductionMultiplier;

  const minVariance = stats.useCritical
    ? variance
    : -variance;
  const maxVariance = variance;

  const min = Math.floor((baseWeaponDamage + minVariance + statBonus + refinementBonus.min) * totalMultiplier);
  const max = Math.floor((baseWeaponDamage + maxVariance + statBonus + refinementBonus.max) * totalMultiplier);

  return { min, max };
}

