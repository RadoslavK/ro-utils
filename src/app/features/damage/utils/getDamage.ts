import { getAtk } from './getAtk';
import { Variance } from '../types/variance.type';
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

  return Math.floor(
    Math.floor(
      Math.floor(
        Math.floor(
          Math.floor(
            Math.floor(
              Math.floor(
                Math.floor(
                  Math.floor(atk * (useCritical ? finalMultipliers.critical : 1))
                  * (damageType === DamageType.PhysicalRanged ? finalMultipliers.ranged : 1))
                * finalReductions.ranged)
              * (damageType === DamageType.PhysicalRanged ? finalMultipliers.damage : 1))
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
}: Params): Variance => {
  const { min: minAtk, max: maxAtk } = getAtk({
    atkMultipliers,
    bonusAtk,
    stats,
    target,
    weapon,
  });

  if (skillInput !== undefined) {
    const skillMultiplier = skillInput.multiplier;

    const minDamage = getAtkDamage({
      atk: minAtk * skillMultiplier,
      damageType: weapon.damageType,
      finalMultipliers,
      finalReductions,
      target,
      useCritical: false,
    });

    const maxDamage = getAtkDamage({
      atk: maxAtk * skillMultiplier,
      damageType: weapon.damageType,
      finalMultipliers,
      finalReductions,
      target,
      useCritical: false,
    });

    return {
      min: minDamage * skillInput.hits,
      max: maxDamage * skillInput.hits,
    };
  }

  const minNonCritDamage = getAtkDamage({
    atk: minAtk,
    damageType: weapon.damageType,
    finalMultipliers,
    finalReductions,
    target,
    useCritical: false,
  });

  const maxNonCritDamage = getAtkDamage({
    atk: maxAtk,
    damageType: weapon.damageType,
    finalMultipliers,
    finalReductions,
    target,
    useCritical: false,
  });

  const minCritDamage = getAtkDamage({
    atk: minAtk,
    damageType: weapon.damageType,
    finalMultipliers,
    finalReductions,
    target,
    useCritical: true,
  });

  const maxCritDamage = getAtkDamage({
    atk: maxAtk,
    damageType: weapon.damageType,
    finalMultipliers,
    finalReductions,
    target,
    useCritical: true,
  });

  const critChance = Math.min(100, Math.max(0, stats.crit - target.critShield)) / 100;
  const nonCritChance = 1 - critChance;

  const minDamage = minNonCritDamage * nonCritChance + minCritDamage * critChance;
  const maxDamage = maxNonCritDamage * nonCritChance + maxCritDamage * critChance;

  return {
    min: minDamage,
    max: maxDamage,
  };
};
