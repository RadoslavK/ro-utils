import { getAtk } from './getAtk';
import { Variance } from '../types/variance.type';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { BonusAtk } from '../types/bonusAtk.type';
import { Stats } from '../types/stats.type';
import { baseCriticalMultiplier } from '../constants/baseCriticalMultiplier';
import { Weapon } from '../types/weapon.type';
import { Reductions } from '../types/reductions.type';
import { FinalMultipliers } from '../types/finalMultipliers.type';
import { FinalReductions } from '../types/finalReductions.type';

type SharedParams = {
  readonly finalMultipliers: FinalMultipliers;
  readonly finalReductions: FinalReductions;
  readonly reductions: Reductions;
};

type CalculateAtkDamageParams = SharedParams & {
  readonly atk: number;
  readonly useCritical: boolean;
};

const getAtkDamage = ({
  atk,
  finalMultipliers,
  finalReductions,
  reductions,
  useCritical,
}: CalculateAtkDamageParams): number => {
  const { hard: hardDef, soft: softDef } = reductions.def;
  const hardDefReduction = (4000 + hardDef) / (4000 + hardDef * 10);

  return Math.floor(
    Math.floor(
      Math.floor(
        Math.floor(
          Math.floor(
            Math.floor(
              Math.floor(
                Math.floor(
                  Math.floor(atk * (useCritical ? finalMultipliers.critical : 1))
                  * finalMultipliers.ranged)
                * finalReductions.ranged)
              * finalMultipliers.damage)
            * hardDefReduction)
          - softDef)
        * (useCritical ? baseCriticalMultiplier : 1))
      * finalMultipliers.finalDamage)
    * finalReductions.finalDamage);
};

type Params = SharedParams & {
  readonly atkMultipliers: AtkMultipliers;
  readonly bonusAtk: BonusAtk;
  readonly reductions: Reductions;
  readonly stats: Stats;
  readonly weapon: Weapon;
};

export const getDamage = ({
  atkMultipliers,
  bonusAtk,
  finalMultipliers,
  finalReductions,
  reductions,
  stats,
  weapon,
}: Params): Variance => {
  const { min: minAtk, max: maxAtk } = getAtk({
    atkMultipliers,
    bonusAtk,
    reductions,
    stats,
    weapon,
  });

  const minDamage = getAtkDamage({
    atk: minAtk,
    finalMultipliers,
    finalReductions,
    reductions,
    useCritical: stats.useCritical,
  });

  const maxDamage = getAtkDamage({
    atk: maxAtk,
    finalMultipliers,
    finalReductions,
    reductions,
    useCritical: stats.useCritical,
  });

  return {
    min: minDamage,
    max: maxDamage,
  };
};
