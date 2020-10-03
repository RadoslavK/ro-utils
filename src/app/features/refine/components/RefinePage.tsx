import React, { useMemo, useState } from 'react';
import { Costs} from './Costs';
import { RefineCalculatorInput } from './RefineCalculatorInput';
import { calculateTotalRefineCost } from '../../../../calculations/calculateTotalRefineCost';
import { RefineResult } from './RefineResult';
import { useCosts } from '../hooks/useCosts';
import { useRefineInput } from '../hooks/useRefineInput';

export const RefinePage: React.FC = () => {
  const { costs, setCost } = useCosts();
  const { refineInput, setRefineInput } = useRefineInput();
  const [refineParamsPreferences, setRefineParamsPreferences] = useState<Map<number, string>>(new Map<number, string>());

  const refineResult = useMemo(() => calculateTotalRefineCost({
    itemCosts: costs,
    refineInput,
    refineParamsPreferences,
  }), [refineParamsPreferences, costs, refineInput]);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <RefineCalculatorInput
          refineInput={refineInput}
          onRefineInputChange={setRefineInput}
        />

        <Costs
          costs={costs}
          setCost={setCost}
        />
      </div>

      <RefineResult
        refineType={refineInput.refineType}
        result={refineResult}
        onPreferencesChange={setRefineParamsPreferences}
        preferences={refineParamsPreferences}
        startingRefineLevel={refineInput.startingRefineLevel}
      />
    </div>
  );
};

RefinePage.displayName = 'RefinePage';