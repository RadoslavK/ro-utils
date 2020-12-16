import React, { useEffect, useMemo, useState } from 'react';
import { getDamage } from '../utils/getDamage';
import { Presets } from './presets/Presets';
import { DamageCalcPreset, useDamageCalcPresets } from '../hooks/useDamageCalcPresets';
import { DamageCalculationResult } from './DamageCalculationResult';
import { DamageCalculationInput } from './DamageCalculationInput';
import {
  DamageCalculationInput as DamageCalculationInputModel,
  defaultDamageCalculationInput,
} from '../types/damageCalculationInput.type';
import { generateId } from '../../../utils/generateId';

export const DamagePage: React.FC = () => {
  const { deletePreset, presets, updatePreset } = useDamageCalcPresets();
  const [selectedPreset, setSelectedPreset] = useState<DamageCalcPreset>([...presets.values()][0]);

  useEffect(() => {
    if (!presets.has(selectedPreset.id)) {
      setSelectedPreset([...presets.values()][0]);
    }
  }, [presets, selectedPreset]);

  const {
    atkMultipliers,
    bonusAtk,
    finalMultipliers,
    finalReductions,
    ignoreSizePenalty,
    removeVariance,
    skillInput,
    stats,
    target,
    useSkill,
    weapon,
  } = selectedPreset.input;

  const damage = useMemo(() => getDamage({
    atkMultipliers,
    bonusAtk,
    finalMultipliers,
    finalReductions,
    ignoreSizePenalty,
    removeVariance,
    skillInput: useSkill ? skillInput : undefined,
    stats,
    target,
    weapon,
  }), [
    atkMultipliers,
    bonusAtk,
    finalMultipliers,
    finalReductions,
    ignoreSizePenalty,
    removeVariance,
    skillInput,
    stats,
    target,
    useSkill,
    weapon,
  ]);

  const changeInput = (input: DamageCalculationInputModel): void => {
    const updatedPreset: DamageCalcPreset = {
      ...selectedPreset,
      input,
    };

    updatePreset(updatedPreset);
    setSelectedPreset(updatedPreset)
  };

  const addPreset = (): string => {
    const preset: DamageCalcPreset = {
      id: generateId(),
      input: defaultDamageCalculationInput,
      name: 'New preset',
    }

    updatePreset(preset);
    setSelectedPreset(preset);

    return preset.id;
  };

  const changeName = (id: string, name: string): void => {
    const preset = presets.get(id);
    const updatedPreset: DamageCalcPreset = {
      ...preset,
      name,
    };

    updatePreset(updatedPreset);
    setSelectedPreset(preset)
  };

  const copyPreset = (id: string): string => {
    const preset = presets.get(id);
    const newId = generateId();
    const copiedPreset: DamageCalcPreset = {
      id: newId,
      name: `${preset.name} (Copy)`,
      input: {
        ...preset.input,
      }
    };

    updatePreset(copiedPreset);
    setSelectedPreset(copiedPreset);

    return newId;
  };

  return (
    <div>
      <Presets
        changePresetName={changeName}
        onAddPreset={addPreset}
        onCopyPreset={copyPreset}
        onDeletePreset={presets.size > 1 ? deletePreset : null}
        onSelectedPresetChange={setSelectedPreset}
        presets={presets}
        selectedPresetId={selectedPreset.id}
      />
      <DamageCalculationInput
        damageCalculationInput={selectedPreset.input}
        onDamageCalculationInputChange={changeInput}
      />
      <DamageCalculationResult damage={damage} />
    </div>
  );
};