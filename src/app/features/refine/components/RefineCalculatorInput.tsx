import React, { useCallback } from 'react';
import { NumberInput } from '../../../components/NumberInput';
import { RefineType } from '../types/refineType.type';
import { DropDown } from '../../../components/DropDown';
import { RefineInput } from '../types/refineInput.type';
import { CheckBox } from '../../../components/CheckBox';
import { css } from '@emotion/core';
import { refineItemIds } from '../constants/refineItemIds';
import { items } from '../../../constants/items';

const refineTypeLabels: Record<RefineType, string> = {
  [RefineType.Armor]: 'Armor',
  [RefineType.Weapon1]: 'Weapon level 1',
  [RefineType.Weapon2]: 'Weapon level 2',
  [RefineType.Weapon3]: 'Weapon level 3',
  [RefineType.Weapon4]: 'Weapon level 4',
};

type Props = {
  readonly itemCosts: Map<number, number>;
  readonly onItemCostChange: (itemId: number, price: number) => void;
  readonly onRefineInputChange: (value: RefineInput) => void;
  readonly onShowOnlyBestResultsChange: (value: boolean) => void;
  readonly refineInput: RefineInput;
  readonly shouldShowOnlyBestResults: boolean;
}

export const RefineCalculatorInput: React.FC<Props> = ({
  itemCosts,
  onItemCostChange,
  onRefineInputChange,
  onShowOnlyBestResultsChange,
  refineInput,
  shouldShowOnlyBestResults,
}) => {
  const {
    baseItemCost,
    refineType,
    startingRefineLevel,
    targetRefineLevel,
  } = refineInput;

  const onBaseItemCostChange = useCallback((baseItemCost: number): void => {
    onRefineInputChange({ ...refineInput, baseItemCost });
  }, [refineInput, onRefineInputChange]);

  const onStartingRefineLevelChange = useCallback((startingRefineLevel: number): void => {
    onRefineInputChange({ ...refineInput, startingRefineLevel });
  }, [refineInput, onRefineInputChange]);

  const onTargetRefineLevelChange = useCallback((targetRefineLevel: number): void => {
    onRefineInputChange({ ...refineInput, targetRefineLevel });
  }, [refineInput, onRefineInputChange]);

  const onRefineTypeChange = useCallback((refineType: RefineType): void => {
    onRefineInputChange({ ...refineInput, refineType });
  }, [refineInput, onRefineInputChange]);

  return (
    <div
      css={css`
        display: flex;
        margin-right: 40px;
        
        > * {
          margin-right: 80px;
        }
      `}
    >
      <div>
        <h2>Input</h2>
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
        <CheckBox
          isChecked={shouldShowOnlyBestResults}
          label="Show only best methods"
          onChange={onShowOnlyBestResultsChange}
        />
      </div>
      <div>
        <h2>Costs</h2>
        <NumberInput
          label="Base cost"
          value={baseItemCost}
          onChange={onBaseItemCostChange}
          minValue={0}
        />
        {[refineItemIds.Oridecon, refineItemIds.Elunium, refineItemIds.BlacksmithBlessing].map(refineItemId => (
          <NumberInput
            key={refineItemId}
            value={itemCosts.get(refineItemId) || 0}
            onChange={newCost => onItemCostChange(refineItemId, newCost)}
            label={items.get(refineItemId).name}
            minValue={0}
          />
        ))}
      </div>
    </div>
  );
};

RefineCalculatorInput.displayName = 'RefineCalculatorInput';