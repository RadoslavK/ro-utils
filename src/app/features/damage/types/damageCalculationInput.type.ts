import { Stats } from './stats.type';
import { Weapon } from './weapon.type';
import { Target } from './reductions.type';
import { BonusAtk } from './bonusAtk.type';
import { AtkMultipliers } from './atkMultipliers.type';
import { FinalMultipliers } from './finalMultipliers.type';
import { FinalReductions } from './finalReductions.type';
import { SkillInput } from './skillInput.type';
import { DamageType } from './damageType';
import { PropertyElement } from './propertyElement';
import { WeaponType } from './weaponType';
import { Size } from './size';

export type DamageCalculationInput = {
  readonly atkMultipliers: AtkMultipliers;
  readonly bonusAtk: BonusAtk;
  readonly finalMultipliers: FinalMultipliers;
  readonly finalReductions: FinalReductions;
  readonly ignoreSizePenalty: boolean;
  readonly removeVariance: boolean;
  readonly skillInput: SkillInput;
  readonly stats: Stats;
  readonly target: Target;
  readonly useSkill: boolean;
  readonly weapon: Weapon;
};

export const defaultDamageCalculationInput: DamageCalculationInput = {
  stats: {
    baseLevel: 99,
    dex: 98,
    luk: 112,
    str: 6,
    crit: 53,
  },
  weapon: {
    baseDamage: 120,
    damageType: DamageType.PhysicalRanged,
    element: PropertyElement.Holy,
    level: 3,
    refineLevel: 9,
    type: WeaponType.Bow,
  },
  target: {
    def: {
      hard: 279,
      soft: 114,
    },
    critShield: 14.2,
    atkReductionMultiplier: {
      property: 1,
      race: 1,
      size: 1,
      targetProperty: 1,
    },
    property: {
      element: PropertyElement.Undead,
      level: 1,
    },
    size: Size.Medium,
  },
  bonusAtk: {
    extraAtk: {
      pseudoBuff: 0,
      equip: 85,
      consumable: 0,
      ammunition: 25,
    },
    masteryAtk: 0,
    buffAtk: 25,
  },
  atkMultipliers: {
    atk: 1,
    monster: 1,
    race: 1,
    size: 1,
    targetProperty: 1,
  },
  finalMultipliers: {
    damage: 1,
    finalDamage: 1,
    ranged: 1.3,
    critical: 1.1,
  },
  finalReductions: {
    finalDamage: 1,
    ranged: 1,
  },
  ignoreSizePenalty: false,
  removeVariance: false,
  skillInput: {
    canCrit: true,
    multiplier: 3,
    hits: 1,
  },
  useSkill: false,
};