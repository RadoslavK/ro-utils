import React from 'react';
import { items } from '../../../constants/items';
import { NumberInput } from '../../../components/NumberInput';
import { refineItemIds } from '../../../../constants/refineItemIds';

type Props = {
  readonly costs: Map<number, number>;
  readonly setCost: (itemId: number, cost: number) => void;
}

export const Costs: React.FC<Props> = ({
  costs,
  setCost,
}) => {
  const changeCost = (itemId: number) => (newCost: number): void => {
    setCost(itemId, newCost);
  };

  return (
    <div>
      <h2>Item costs</h2>
      <div>
        {[refineItemIds.Oridecon, refineItemIds.Elunium, refineItemIds.BlacksmithBlessing].map(refineItemId => (
          <NumberInput
            key={refineItemId}
            value={costs.get(refineItemId) || 0}
            onChange={changeCost(refineItemId)}
            label={items.get(refineItemId).name}
            minValue={0}
          />
        ))}
      </div>
    </div>
  );
};

Costs.displayName = 'Prices';