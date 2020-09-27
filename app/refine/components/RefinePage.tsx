import React, { useMemo, useState } from 'react';
import { Prices } from './Prices';
import { RefineCalculatorInput } from './RefineCalculatorInput';
import { RefineType } from '../../../types/refineType.type';
import { calculateTotalRefineCost } from '../../../calculations/calculateTotalRefineCost';
import { RefineResult } from './RefineResult';

export const RefinePage: React.FC = () => {
  const [baseItemCost, setBaseItemCost] = useState(2_000_000);
  const [startingRefineLevel, setStartingRefineLevel] = useState(0);
  const [targetRefineLevel, setTargetRefineLevel] = useState(9);
  const [refineType, setRefineType] = useState<RefineType>(RefineType.Armor);

  const refineResult = useMemo(() => calculateTotalRefineCost({
    baseCost: baseItemCost,
    refineType,
    startingRefineLevel,
    targetRefineLevel,
  }), [baseItemCost, refineType, startingRefineLevel, targetRefineLevel]);

  return (
    <div>
      <Prices />

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
      />
    </div>
  );
};

RefinePage.displayName = 'RefinePage';