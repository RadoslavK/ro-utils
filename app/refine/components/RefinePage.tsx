import React, { useMemo, useState } from 'react';
import { Costs} from './Costs';
import { RefineCalculatorInput } from './RefineCalculatorInput';
import { RefineType } from '../../../types/refineType.type';
import { calculateTotalRefineCost } from '../../../calculations/calculateTotalRefineCost';
import { RefineResult } from './RefineResult';
import { refineItemIds } from '../../../constants/refineItemIds';

const PricesStorageKey = 'prices';

const loadPrices = (): Map<number, number> => {
  const pricesRaw = localStorage.getItem(PricesStorageKey);

  return pricesRaw
    ? new Map<number, number>(JSON.parse(pricesRaw))
    : new Map<number, number>([
      [refineItemIds.Elunium, 2_000],
      [refineItemIds.Oridecon, 5_000],
      [refineItemIds.BlacksmithBlessing, 3_600_000],
      [refineItemIds.Phracon, 100],
      [refineItemIds.Emveretarcon, 1_000],
      [refineItemIds.RandomRefineBox, 4_000_000],
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

  const [baseItemCost, setBaseItemCost] = useState(1_500_000);
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
      <div style={{ display: 'flex' }}>
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

        <Costs
          costs={costs}
          setCost={setCost}
        />
      </div>

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