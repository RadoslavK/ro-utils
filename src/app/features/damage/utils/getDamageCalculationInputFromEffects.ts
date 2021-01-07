import { DamageCalcEffectType, DamageCalcEffectValue } from '../types/damageCalcEffect';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { BonusAtk } from '../types/bonusAtk.type';

type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> };

type Result = {
  readonly atkMultipliers: AtkMultipliers;
  readonly bonusAtk: BonusAtk;
};

export const getDamageCalculationInputFromEffects = (effectValues: readonly DamageCalcEffectValue[]): Result => {
  const atkMultipliers: DeepMutable<AtkMultipliers> = {
    atk: 1,
    monster: 1,
    race: 1,
    size: 1,
    targetProperty: 1,
  };

  const bonusAtk: DeepMutable<BonusAtk> = {
    buffAtk: 0,
    masteryAtk: 0,
    extraAtk: {
      equip: 0,
      ammunition: 0,
      consumable: 0,
      pseudoBuff: 0,
    },
  };

  effectValues.forEach(effect => {
    switch (effect.type) {
      //  Bonus ATK
      case DamageCalcEffectType.BuffATK: { bonusAtk.buffAtk += effect.value; break; }
      case DamageCalcEffectType.MasteryATK: { bonusAtk.masteryAtk += effect.value; break; }
      case DamageCalcEffectType.EquipATK: { bonusAtk.extraAtk.equip += effect.value; break; }
      case DamageCalcEffectType.AmmunitionATK: { bonusAtk.extraAtk.ammunition += effect.value; break; }
      case DamageCalcEffectType.ConsumableATK: { bonusAtk.extraAtk.consumable += effect.value; break; }
      case DamageCalcEffectType.PseudoBuffATK: { bonusAtk.extraAtk.pseudoBuff += effect.value; break; }

      //  ATK Multipliers
      case DamageCalcEffectType.ATK: { atkMultipliers.atk += effect.value; break; }
      case DamageCalcEffectType.Monster: { atkMultipliers.monster += effect.value; break; }
      case DamageCalcEffectType.Race: { atkMultipliers.race += effect.value; break; }
      case DamageCalcEffectType.Size: { atkMultipliers.size += effect.value; break; }
      case DamageCalcEffectType.Property: { atkMultipliers.targetProperty += effect.value; break; }
    }
  });

  return {
    atkMultipliers,
    bonusAtk,
  };
};