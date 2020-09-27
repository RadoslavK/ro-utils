import React from 'react';
import { NumberInput } from '../../_components/NumberInput';
import { RefineType } from '../../../types/refineType.type';
import { DropDown } from '../../_components/DropDown';

const refineTypeLabels: Record<RefineType, string> = {
  [RefineType.Armor]: 'Armor',
  [RefineType.Weapon1]: 'Weapon level 1',
  [RefineType.Weapon2]: 'Weapon level 2',
  [RefineType.Weapon3]: 'Weapon level 3',
  [RefineType.Weapon4]: 'Weapon level 4',
};

type Props = {
  readonly baseItemCost: number;
  readonly onBaseItemCostChange: (value: number) => void;
  readonly startingRefineLevel: number;
  readonly onStartingRefineLevelChange: (value: number) => void;
  readonly targetRefineLevel: number;
  readonly onTargetRefineLevelChange: (value: number) => void;
  readonly refineType: RefineType;
  readonly onRefineTypeChange: (value: RefineType) => void;
}

export const RefineCalculatorInput: React.FC<Props> = ({
  startingRefineLevel,
  targetRefineLevel,
  refineType,
  baseItemCost,
  onBaseItemCostChange,
  onRefineTypeChange,
  onStartingRefineLevelChange,
  onTargetRefineLevelChange,
}) => (
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

RefineCalculatorInput.displayName = 'RefineCalculatorInput';