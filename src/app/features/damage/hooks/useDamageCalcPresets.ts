import { DamageCalculationInput, defaultDamageCalculationInput } from '../types/damageCalculationInput.type';
import { useCallback, useState } from 'react';
import { LocalStorageManager } from '../../../models/localStorageManager';
import { LocalStorageKeys } from '../../../constants/localStorageKeys';
import { deserializeMap, serializeMap } from '../../../utils/mapParsing';
import { generateId } from '../../../utils/generateId';

export type DamageCalcPreset = {
  readonly id: string;
  readonly name: string;
  readonly input: DamageCalculationInput;
};

const localStorageManager = new LocalStorageManager<ReadonlyMap<string, DamageCalcPreset>>({
  key: LocalStorageKeys.DamageCalculationPresets,
  parseValue: serializeMap,
  parseRawObject: deserializeMap,
});

const loadDefaultValues = (): ReadonlyMap<string, DamageCalcPreset> => {
  const newId = generateId();

  return localStorageManager.load(new Map<string, DamageCalcPreset>([
    [newId, {
      id: newId,
      input: defaultDamageCalculationInput,
      name: 'Default',
    }],
  ]));
};

export const useDamageCalcPresets = () => {
  const [presets, setPresets] = useState<ReadonlyMap<string, DamageCalcPreset>>(loadDefaultValues);

  const updatePreset = useCallback((preset: DamageCalcPreset): void => {
    const updatedPresets = new Map(presets);

    updatedPresets.set(preset.id, preset);
    setPresets(updatedPresets);

    localStorageManager.save(updatedPresets);
  }, [presets]);

  const deletePreset = useCallback((id: string): void => {
    const updatedPresets = new Map(presets);

    updatedPresets.delete(id);
    setPresets(updatedPresets);

    localStorageManager.save(updatedPresets);
  }, [presets]);

  return { deletePreset, updatePreset, presets };
};