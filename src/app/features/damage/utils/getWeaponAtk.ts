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
  readonly ignoreSizePenalty: boolean;
  readonly stats: Stats;
  readonly target: Target;
  readonly useCritical: boolean;
  readonly weapon: Weapon;
}

export const getWeaponAtk = ({
  atkMultipliers,
  ignoreSizePenalty,
  stats,
  target,
  useCritical,
  weapon,
}: Params): Variance => {
  const {
    baseDamage: baseWeaponDamage,
    level: weaponLevel,
    refineLevel,
    type: weaponType,
  } = weapon;

  const mainStat = getMainStat(stats, weaponType);
  const variance = 0.05 * weaponLevel * baseWeaponDamage;
  const statBonus = baseWeaponDamage * mainStat / 200; // TODO: Make it pseudo-elemental
  const refinementBonus = getRefinementBonus({ refineLevel, weaponLevel });

  const sizePenalty = ignoreSizePenalty ? 1 : getSizePenalty(weapon.type, target.size);

  const propertyMultiplier = getPropertyMultiplier(weapon.element, target.property);
  const totalAtkMultiplier = atkMultipliers.race
    * atkMultipliers.size
    * atkMultipliers.targetProperty
    * atkMultipliers.monster
    * atkMultipliers.atk
    * propertyMultiplier;

  const totalAtkReductionMultiplier = target.atkReductionMultiplier.race
    * target.atkReductionMultiplier.size
    * target.atkReductionMultiplier.property
    * target.atkReductionMultiplier.targetProperty;

  const totalMultiplier = sizePenalty * totalAtkMultiplier * totalAtkReductionMultiplier;

  const minVariance = useCritical ? variance : -variance;
  const maxVariance = variance;

  const min = Math.floor((baseWeaponDamage + minVariance + statBonus + refinementBonus.min) * totalMultiplier);
  const max = Math.floor((baseWeaponDamage + maxVariance + statBonus + refinementBonus.max) * totalMultiplier);

  return { min, max };
}

