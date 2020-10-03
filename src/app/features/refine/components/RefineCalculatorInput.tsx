import React, { useCallback } from 'react';
import { NumberInput } from '../../../components/NumberInput';
import { RefineType } from '../../../../types/refineType.type';
import { DropDown } from '../../../components/DropDown';
import { RefineInput } from '../../../../types/refineInput.type';

const refineTypeLabels: Record<RefineType, string> = {
  [RefineType.Armor]: 'Armor',
  [RefineType.Weapon1]: 'Weapon level 1',
  [RefineType.Weapon2]: 'Weapon level 2',
  [RefineType.Weapon3]: 'Weapon level 3',
  [RefineType.Weapon4]: 'Weapon level 4',
};

type Props = {
  readonly onRefineInputChange: (value: RefineInput) => void;
  readonly refineInput: RefineInput;
}

export const RefineCalculatorInput: React.FC<Props> = ({
  onRefineInputChange,
  refineInput,
}) => {
  const {
    baseItemCost,
    refineType,
    startingRefineLevel,
    targetRefineLevel,
  } = refineInput;

  const onBaseItemCostChange = useCallback((baseItemCost: number): void => {
    onRefineInputChange({ ...refineInput, baseItemCost });
  }, []);

  const onStartingRefineLevelChange = useCallback((startingRefineLevel: number): void => {
    onRefineInputChange({ ...refineInput, startingRefineLevel });
  }, []);

  const onTargetRefineLevelChange = useCallback((targetRefineLevel: number): void => {
    onRefineInputChange({ ...refineInput, targetRefineLevel });
  }, []);

  const onRefineTypeChange = useCallback((refineType: RefineType): void => {
    onRefineInputChange({ ...refineInput, refineType });
  }, []);

  return (
    <div>
      <h2>Input</h2>

      <NumberInput
        label="Base cost"
        value={baseItemCost}
        onChange={onBaseItemCostChange}
        minValue={0}
      />

      <NumberInput
        label="Starting refine level"
        value={startingRefineLevel}
        onChange={onStartingRefineLevelChange}
        minValue={0}
        maxValue={targetRefineLevel - 1}
      />

      <NumberInput
        label="Target refine level"
        value={targetRefineLevel}
        onChange={onTargetRefineLevelChange}
        minValue={startingRefineLevel + 1}
      />

      <DropDown<RefineType>
        label="Refine type"
        selectedValue={refineType}
        values={Object.values(RefineType)}
        onChange={onRefineTypeChange}
        getId={refineType => refineType}
        getName={refineType => refineTypeLabels[refineType]}
      />
    </div>
  );
};

RefineCalculatorInput.displayName = 'RefineCalculatorInput';