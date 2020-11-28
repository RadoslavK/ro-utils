import React, { useMemo, useState } from 'react';
import { useCosts } from '../hooks/useCosts';
import { useRefineInput } from '../hooks/useRefineInput';
import { RefineCalculatorInput } from './RefineCalculatorInput';
import { calculateAllRefineResults } from '../utils/calculateAllRefineResults';
import { AllRefineResults } from './AllRefineResults';

export const RefinePage: React.FC = () => {
  const { costs, setCost } = useCosts();
  const { refineInput, setRefineInput } = useRefineInput();
  const [noRefineBoxPreferences, setNoRefineBoxPreferences] = useState<ReadonlyMap<number, string>>(new Map<number, string>());

  const allRefineResults = useMemo(() => {
    return calculateAllRefineResults({
      itemCosts: costs,
      noRefineBoxPreferences,
      refineInput,
    });
  }, [costs, refineInput, noRefineBoxPreferences]);

  return (
    <div>
      <RefineCalculatorInput
        itemCosts={costs}
        onItemCostChange={setCost}
        onRefineInputChange={setRefineInput}
        refineInput={refineInput}
      />
      <AllRefineResults
        key={refineInput.targetRefineLevel}
        allResults={allRefineResults}
        noRefineBoxPreferences={noRefineBoxPreferences}
        onNoRefineBoxPreferencesChange={setNoRefineBoxPreferences}
        refineType={refineInput.refineType}
      />
    </div>
  );
};

RefinePage.displayName = 'RefinePage';