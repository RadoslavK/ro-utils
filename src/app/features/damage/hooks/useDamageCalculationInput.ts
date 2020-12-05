import { DamageCalculationInput } from '../types/damageCalculationInput.type';
import { useCallback, useState } from 'react';
import { DamageType } from '../types/damageType';
import { PropertyElement } from '../types/propertyElement';
import { WeaponType } from '../types/weaponType';
import { Size } from '../types/size';
import { LocalStorageManager } from '../../../models/localStorageManager';
import { LocalStorageKeys } from '../../../constants/localStorageKeys';

const defaultValues: DamageCalculationInput = {
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

const localStorageManager = new LocalStorageManager<DamageCalculationInput>({
  key: LocalStorageKeys.DamageCalculationInput,
});

const loadInitialValues = (): DamageCalculationInput =>
  localStorageManager.load(defaultValues);

export const useDamageCalculationInput = () => {
  const [input, setInput] = useState<DamageCalculationInput>(loadInitialValues);

  const onDamageCalculationInputChange = useCallback((newInput: DamageCalculationInput) => {
    setInput(newInput);

    localStorageManager.save(newInput);
  }, []);

  return {
    damageCalculationInput: input,
    onDamageCalculationInputChange,
  }
};