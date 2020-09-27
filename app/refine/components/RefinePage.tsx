import React, { useMemo, useState } from 'react';
import { Costs, refineItemIds } from './Costs';
import { RefineCalculatorInput } from './RefineCalculatorInput';
import { RefineType } from '../../../types/refineType.type';
import { calculateTotalRefineCost } from '../../../calculations/calculateTotalRefineCost';
import { RefineResult } from './RefineResult';

const PricesStorageKey = 'prices';

const loadPrices = (): Map<number, number> => {
  const pricesRaw = localStorage.getItem(PricesStorageKey);

  return pricesRaw
    ? new Map<number, number>(JSON.parse(pricesRaw))
    : new Map<number, number>([
      [refineItemIds.Elunium, 1_500],
      [refineItemIds.Oridecon, 5_000],
      [refineItemIds.EnrichedElunium, 501_500],
      [refineItemIds.EnrichedOridecon, 505_000],
      [refineItemIds.HDElunium, 1_501_500],
      [refineItemIds.HDOridecon, 1_505_000],
      [refineItemIds.BlacksmithBlessing, 3_600_000],
      [refineItemIds.Phracon, 100],
      [refineItemIds.Emveretarcon, 1_000],
    ]);
};

const useCosts = () => {
  const [prices, setPrices] = useState<Map<number, number>>(loadPrices());

  const setPrice = (itemId: number, price: number) => {
    const newPrices = new Map<number, number>(prices);

    newPrices.set(itemId, price);
    setPrices(newPrices);

    localStorage.setItem(PricesStorageKey, JSON.stringify(Array.from(newPrices.entries())));
  };

  return {
    costs: prices,
    setCost: setPrice,
  };
};

export const RefinePage: React.FC = () => {
  const {
    costs,
    setCost,
  } = useCosts();

  const [baseItemCost, setBaseItemCost] = useState(2_000_000);
  const [startingRefineLevel, setStartingRefineLevel] = useState(0);
  const [targetRefineLevel, setTargetRefineLevel] = useState(9);
  const [refineType, setRefineType] = useState<RefineType>(RefineType.Armor);
  const [refineParamsPreferences, setRefineParamsPreferences] = useState<Map<number, string>>(new Map<number, string>());

  const refineResult = useMemo(() => calculateTotalRefineCost({
    baseCost: baseItemCost,
    itemCosts: costs,
    refineType,
    startingRefineLevel,
    targetRefineLevel,
    refineParamsPreferences,
  }), [refineParamsPreferences, costs, baseItemCost, refineType, startingRefineLevel, targetRefineLevel]);

  return (
    <div>
      <Costs
        costs={costs}
        setCost={setCost}
      />

      <RefineCalculatorInput
        baseItemCost={baseItemCost}
        onBaseItemCostChange={setBaseItemCost}
        onRefineTypeChange={setRefineType}
        onStartingRefineLevelChange={setStartingRefineLevel}
        onTargetRefineLevelChange={setTargetRefineLevel}
        refineType={refineType}
        startingRefineLevel={startingRefineLevel}
        targetRefineLevel={targetRefineLevel}
      />

      <RefineResult
        refineType={refineType}
        result={refineResult}
        onPreferencesChange={setRefineParamsPreferences}
        preferences={refineParamsPreferences}
      />
    </div>
  );
};

RefinePage.displayName = 'RefinePage';