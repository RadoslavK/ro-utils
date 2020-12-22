import { ExtraAtk } from '../types/extraAtk.type';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { Target } from '../types/reductions.type';
import { getPropertyMultiplier } from './getPropertyMultiplier';
import { Stats } from '../types/stats.type';
import { getMainStat } from './getMainStat';
import { Weapon } from '../types/weapon.type';
import { Variance } from '../types/variance.type';

type Params = {
  readonly atkMultipliers: AtkMultipliers;
  readonly extraAtk: ExtraAtk;
  readonly removeVariance: boolean;
  readonly stats: Stats;
  readonly target: Target;
  readonly useCritical: boolean;
  readonly weapon: Weapon;
};

export const getExtraAtk = ({
  atkMultipliers,
  extraAtk,
  removeVariance,
  stats,
  target,
  useCritical,
  weapon,
}: Params): Variance => {
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

  const totalMultipliers = totalAtkMultiplier * totalAtkReductionMultiplier;
  //  TODO: this is probably bug and shouldnt be counted but it is in game now
  const statBonus = extraAtk.equip * getMainStat(stats, weapon.type) / 200;
  const totalExtraAtk = extraAtk.equip
    + statBonus
    + extraAtk.consumable
    + extraAtk.ammunition
    + extraAtk.pseudoBuff;

  //  TODO: this is probably bug and shouldnt be counted but it is in game now
  const variance = extraAtk.equip * 0.05 * weapon.level;
  const minVariance = (removeVariance || useCritical) ? variance : -variance;
  const maxVariance = variance;

  return {
    min: Math.floor((totalExtraAtk + minVariance) * totalMultipliers),
    max: Math.floor((totalExtraAtk + maxVariance) * totalMultipliers),
  };
};