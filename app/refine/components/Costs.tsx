import React from 'react';
import { items } from '../../_constants/items';
import { NumberInput } from '../../_components/NumberInput';

export const refineItemIds = {
  Elunium: 985,
  EnrichedElunium: 6291,
  HDElunium: 6241,
  Oridecon: 984,
  EnrichedOridecon: 6292,
  HDOridecon: 6240,
  BlacksmithBlessing: 6635,
  Phracon: 1010,
  Emveretarcon: 1011,
}

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