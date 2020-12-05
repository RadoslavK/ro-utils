import { LocalStorageManager } from '../../../models/localStorageManager';
import { LocalStorageKeys } from '../../../constants/localStorageKeys';
import { useState } from 'react';
import { defaultRefineItemsPrices } from '../constants/defaultRefineItemsPrices';
import { deserializeMap, serializeMap } from '../../../utils/mapParsing';

export const useCosts = () => {
  const localStorageManager = new LocalStorageManager<Map<number, number>>({
    key: LocalStorageKeys.Prices,
    parseRawObject: deserializeMap,
    parseValue: serializeMap,
  })

  const [prices, setPrices] = useState<ReadonlyMap<number, number>>(() => {
    const loadedPrices = localStorageManager.load(defaultRefineItemsPrices);

    [...defaultRefineItemsPrices.entries()]
      .forEach(([itemId, defaultPrice]) => {
        if (loadedPrices.get(itemId) === undefined) {
          loadedPrices.set(itemId, defaultPrice);
        }
      });

    return loadedPrices;
  });

  const setPrice = (itemId: number, price: number): void => {
    const newPrices = new Map<number, number>(prices);

    newPrices.set(itemId, price);
    setPrices(newPrices);

    localStorageManager.save(newPrices);
  };

  return {
    costs: prices,
    setCost: setPrice,
  };
};