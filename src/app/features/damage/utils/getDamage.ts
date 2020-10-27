import { getAtk } from './getAtk';
import { Variance } from '../types/variance.type';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { AtkReductions } from '../types/atkReductions.type';
import { BonusAtk } from '../types/bonusAtk.type';
import { DamageType } from '../types/damageType';
import { Stats } from '../types/stats.type';
import { Def } from '../types/def.type';
import { baseCriticalMultiplier } from '../constants/baseCriticalMultiplier';

type SharedParams = {
  readonly criticalMultiplier: number;
  readonly damageMultiplier: number;
  readonly def: Def;
  readonly finalDamageMultiplier: number;
  readonly finalDamageReduction: number;
  readonly rangedMultiplier: number;
  readonly rangedReduction: number;
  readonly useCritical: boolean;
};

type CalculateAtkDamageParams = SharedParams & {
  readonly atk: number;
};

const getAtkDamage = ({
  atk,
  criticalMultiplier,
  damageMultiplier,
  def,
  finalDamageMultiplier,
  finalDamageReduction,
  rangedMultiplier,
  rangedReduction,
  useCritical,
}: CalculateAtkDamageParams): number => {
  const { hard: hardDef, soft: softDef } = def;
  const hardDefReduction = (4000 + hardDef) / (4000 + hardDef * 10);

  return Math.floor(
    Math.floor(
      Math.floor(
        Math.floor(
          Math.floor(
            Math.floor(
              Math.floor(
                Math.floor(
                  Math.floor(atk * (useCritical ? criticalMultiplier : 1))
                  * rangedMultiplier)
                * rangedReduction)
              * damageMultiplier)
            * hardDefReduction)
          - softDef)
        * (useCritical ? baseCriticalMultiplier : 1))
      * finalDamageMultiplier)
    * finalDamageReduction);
};

type Params = SharedParams & {
  readonly atkMultipliers: AtkMultipliers;
  readonly atkReductions: AtkReductions;
  readonly baseWeaponDamage: number;
  readonly bonusAtk: BonusAtk;
  readonly damageType: DamageType;
  readonly refineLevel: number;
  readonly stats: Stats;
  readonly weaponLevel: number;
};

export const getDamage = ({
  atkMultipliers,
  atkReductions,
  baseWeaponDamage,
  bonusAtk,
  criticalMultiplier,
  damageMultiplier,
  damageType,
  def,
  finalDamageMultiplier,
  finalDamageReduction,
  rangedMultiplier,
  rangedReduction,
  refineLevel,
  stats,
  useCritical,
  weaponLevel,
}: Params): Variance => {
  const { min: minAtk, max: maxAtk } = getAtk({
    atkMultipliers,
    atkReductions,
    baseWeaponDamage,
    bonusAtk,
    damageType,
    refineLevel,
    stats,
    useCritical,
    weaponLevel,
  });

  const minDamage = getAtkDamage({
    atk: minAtk,
    criticalMultiplier,
    damageMultiplier,
    def,
    finalDamageMultiplier,
    finalDamageReduction,
    rangedMultiplier,
    rangedReduction,
    useCritical,
  });

  const maxDamage = getAtkDamage({
    atk: maxAtk,
    criticalMultiplier,
    damageMultiplier,
    def,
    finalDamageMultiplier,
    finalDamageReduction,
    rangedMultiplier,
    rangedReduction,
    useCritical,
  });

  return {
    min: minDamage,
    max: maxDamage,
  };
};
