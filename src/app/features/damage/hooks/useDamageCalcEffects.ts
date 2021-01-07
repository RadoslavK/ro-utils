import { useCallback, useState } from 'react';
import { DamageCalcEffect } from '../types/damageCalcEffect';
import { LocalStorageManager } from '../../../models/localStorageManager';
import { LocalStorageKeys } from '../../../constants/localStorageKeys';
import { deserializeMap, serializeMap } from '../../../utils/mapParsing';

const localStorageManager = new LocalStorageManager<ReadonlyMap<string, DamageCalcEffect>>({
  key: LocalStorageKeys.DamageCalculationEffects,
  parseRawObject: deserializeMap,
  parseValue: serializeMap,
})

const loadEffects = (): ReadonlyMap<string, DamageCalcEffect> =>
  localStorageManager.load(new Map<string, DamageCalcEffect>());

export const useDamageCalcEffects = () => {
  const [effects, setEffects] = useState<ReadonlyMap<string, DamageCalcEffect>>(loadEffects);

  const setEffect = useCallback((effect: DamageCalcEffect): void => {
    const newEffects = new Map(effects);

    newEffects.set(effect.id, effect);
    setEffects(newEffects);
    localStorageManager.save(newEffects);
  }, [effects]);

  const removeEffect = (effect: DamageCalcEffect): void => {
    const newEffects = new Map(effects);

    newEffects.delete(effect.id);
    setEffects(newEffects);
    localStorageManager.save(newEffects);
  };

  return {
    effects,
    setEffect,
    removeEffect,
  };
};