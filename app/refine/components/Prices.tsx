import React, { useEffect, useState } from 'react';
import { items } from '../../_constants/items';
import { NumberInput } from '../../_components/NumberInput';

const refineItemIds: Record<string, number> = {
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

const PricesStorageKey = 'prices';

const loadPrices = (): Map<number, number> => {
  const pricesRaw = localStorage.getItem(PricesStorageKey);

  return pricesRaw
    ? new Map<number, number>(JSON.parse(pricesRaw))
    : new Map<number, number>();
};

const usePrices = () => {
  const [prices, setPrices] = useState<Map<number, number>>(loadPrices());

  const setPrice = (itemId: number, price: number) => {
    const newPrices = new Map<number, number>(prices);

    newPrices.set(itemId, price);
    setPrices(newPrices);

    localStorage.setItem(PricesStorageKey, JSON.stringify(Array.from(newPrices.entries())));
  };

  return {
    prices,
    setPrice,
  };
};

export const Prices: React.FC = () => {
  const {
    prices,
    setPrice,
  } = usePrices();

  const changePrice = (itemId: number) => (newPrice: number): void => {
    setPrice(itemId, newPrice);
  };

  return (
    <>
      <h2>Item prices</h2>
      <div>
        {Object.values(refineItemIds).map(refineItemId => (
          <NumberInput
            key={refineItemId}
            value={prices.get(refineItemId) || 0}
            onChange={changePrice(refineItemId)}
            label={items.get(refineItemId).name}
            minValue={0}
          />
        ))}
      </div>
    </>
  );
};