import { getAtk } from './getAtk';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { BonusAtk } from '../types/bonusAtk.type';
import { Stats } from '../types/stats.type';
import { baseCriticalMultiplier } from '../constants/baseCriticalMultiplier';
import { Weapon } from '../types/weapon.type';
import { Target } from '../types/reductions.type';
import { FinalMultipliers } from '../types/finalMultipliers.type';
import { FinalReductions } from '../types/finalReductions.type';
import { SkillInput } from '../types/skillInput.type';
import { DamageType } from '../types/damageType';
import { Damage } from '../types/damage.type';

type SharedParams = {
  readonly finalMultipliers: FinalMultipliers;
  readonly finalReductions: FinalReductions;
  readonly target: Target;
};

type CalculateAtkDamageParams = SharedParams & {
  readonly atk: number;
  readonly damageType: DamageType;
  readonly useCritical: boolean;
};

const getAtkDamage = ({
  atk,
  damageType,
  finalMultipliers,
  finalReductions,
  target,
  useCritical,
}: CalculateAtkDamageParams): number => {
  const { hard: hardDef, soft: softDef } = target.def;
  const hardDefReduction = (4000 + hardDef) / (4000 + hardDef * 10);
  const isRanged = damageType === DamageType.PhysicalRanged;

  return Math.floor(
    Math.floor(
      Math.floor(
        Math.floor(
          Math.floor(
            Math.floor(
              Math.floor(
                Math.floor(
                  Math.floor(atk * (useCritical ? finalMultipliers.critical : 1))
                  * (isRanged ? finalMultipliers.ranged : 1))
                * (isRanged ? finalReductions.ranged : 1))
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
  readonly skillInput: SkillInput | undefined;
  readonly stats: Stats;
  readonly weapon: Weapon;
};

export const getDamage = ({
  atkMultipliers,
  bonusAtk,
  finalMultipliers,
  finalReductions,
  skillInput,
  stats,
  target,
  weapon,
}: Params): Damage => {
  const canCrit = skillInput ? skillInput.canCrit : true;
  const skillMultiplier = skillInput ? skillInput.multiplier : 1;
  const numberOfHits = skillInput ? skillInput.hits : 1;

  const { min: minAtkNonCrit, max: maxAtkNonCrit } = getAtk({
    atkMultipliers,
    bonusAtk,
    stats,
    target,
    useCritical: false,
    weapon,
  });

  const { min: minAtkCrit, max: maxAtkCrit } = getAtk({
    atkMultipliers,
    bonusAtk,
    stats,
    target,
    useCritical: canCrit,
    weapon,
  });

  const minNonCritDamage = getAtkDamage({
    atk: minAtkNonCrit * skillMultiplier,
    damageType: weapon.damageType,
    finalMultipliers,
    finalReductions,
    target,
    useCritical: false,
  });

  const maxNonCritDamage = getAtkDamage({
    atk: maxAtkNonCrit * skillMultiplier,
    damageType: weapon.damageType,
    finalMultipliers,
    finalReductions,
    target,
    useCritical: false,
  });

  const minCritDamage = getAtkDamage({
    atk: minAtkCrit * skillMultiplier,
    damageType: weapon.damageType,
    finalMultipliers,
    finalReductions,
    target,
    useCritical: canCrit,
  });

  const maxCritDamage = getAtkDamage({
    atk: maxAtkCrit * skillMultiplier,
    damageType: weapon.damageType,
    finalMultipliers,
    finalReductions,
    target,
    useCritical: canCrit,
  });

  const critChance = Math.min(100, Math.max(0, stats.crit - target.critShield)) / 100;
  const nonCritChance = 1 - critChance;

  const minAveragedDamage = minNonCritDamage * nonCritChance + minCritDamage * critChance;
  const maxAveragedDamage = maxNonCritDamage * nonCritChance + maxCritDamage * critChance;

  // TODO: is number of hits multiplying the ATK or its multiplying the final damage of 1 hit?

  return {
    averaged: {
      min: minAveragedDamage * numberOfHits,
      max: maxAveragedDamage * numberOfHits,
    },
    crit: {
      min: minCritDamage * numberOfHits,
      max: maxCritDamage * numberOfHits,
    },
    nonCrit: {
      min: minNonCritDamage * numberOfHits,
      max: maxNonCritDamage * numberOfHits,
    },
  };
};
