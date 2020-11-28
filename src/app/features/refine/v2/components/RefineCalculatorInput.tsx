import React from 'react';
import { NumberInput } from '../../../../components/NumberInput';
import { RefineType } from '../../common/types/refineType.type';
import { DropDown } from '../../../../components/DropDown';
import { RefineInput } from '../../common/types/refineInput.type';
import { css } from '@emotion/core';
import { refineItemIds } from '../../common/constants/refineItemIds';
import { items } from '../../../../constants/items';
import { createOnChangeCallback } from '../../../../utils/useOnChangeCallback';

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
  readonly refineInput: RefineInput;
}

export const RefineCalculatorInput: React.FC<Props> = ({
  itemCosts,
  onItemCostChange,
  onRefineInputChange,
  refineInput,
}) => {
  const {
    baseItemCost,
    refineType,
    targetRefineLevel,
  } = refineInput;

  const onChange = createOnChangeCallback(refineInput, onRefineInputChange);

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
          label="Target refine level"
          value={targetRefineLevel}
          onChange={onChange('targetRefineLevel')}
          minValue={1}
          maxValue={10}
        />
        <DropDown<RefineType>
          label="Refine type"
          selectedValue={refineType}
          values={Object.values(RefineType)}
          onChange={onChange('refineType')}
          getId={refineType => refineType}
          getName={refineType => refineTypeLabels[refineType]}
        />
      </div>
      <div>
        <h2>Costs</h2>
        <NumberInput
          label="Base cost"
          value={baseItemCost}
          onChange={onChange('baseItemCost')}
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