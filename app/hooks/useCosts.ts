import { LocalStorageManager } from '../models/localStorageManager';
import { LocalStorageKeys } from '../constants/localStorageKeys';
import { useState } from 'react';
import { defaultRefineItemsPrices } from '../../constants/defaultRefineItemsPrices';

export const useCosts = () => {
  const localStorageManager = new LocalStorageManager<Map<number, number>>({
    key: LocalStorageKeys.Prices,
    parseRawObject: pricesRaw => new Map<number, number>(JSON.parse(pricesRaw)),
    parseValue: prices => JSON.stringify(Array.from(prices.entries())),
  })

  const [prices, setPrices] = useState<Map<number, number>>(() => {
    return localStorageManager.load(defaultRefineItemsPrices);
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