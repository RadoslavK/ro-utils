import React, { useEffect, useState } from 'react';
import { RefineBoxCalculationResult } from '../utils/calculateRefineBox';
import { TotalRefineResult } from '../types/totalRefineResult.type';
import { css } from '@emotion/core';
import { RefineResultsTab } from './RefineResultsTab';
import { RefineResult } from './RefineResult';
import { RefineBoxResults } from './RefineBoxResults';
import { RefineInput } from '../types/refineInput.type';
import { usePrevious } from '../../../hooks/usePrevious';

type Props = {
  readonly allRefineBoxesResults: Map<number, RefineBoxCalculationResult>;
  readonly itemCosts: Map<number, number>;
  readonly noRefineBoxResults: readonly TotalRefineResult[];
  readonly onPreferencesChange: (preferences: Map<number, string>) => void;
  readonly preferences: Map<number, string>;
  readonly refineInput: RefineInput;
  readonly shouldExpandOnlyUsedResults: boolean;
};

const getInitialSelectedRefineBoxTargetLevel = (
  allRefineBoxesResults: Map<number, RefineBoxCalculationResult>,
  noRefineBoxResults: readonly TotalRefineResult[],
): number | undefined => {
  const noRefineBoxLastResult = noRefineBoxResults[noRefineBoxResults.length - 1];
  let cheapestRefineBoxLevel: number | undefined = undefined;
  let cheapestItemCost = noRefineBoxLastResult.refineParamsResults.get(noRefineBoxLastResult.usedRefineParamsId).totalItemCost;

  for (const [refineBoxTargetLevel, refineBoxResult] of allRefineBoxesResults) {
    if (refineBoxResult.averageCost < cheapestItemCost) {
      cheapestItemCost = refineBoxResult.averageCost;
      cheapestRefineBoxLevel = refineBoxTargetLevel;
    }
  }

  return cheapestRefineBoxLevel;
}

export const RefineResults: React.FC<Props> = ({
  allRefineBoxesResults,
  itemCosts,
  noRefineBoxResults,
  onPreferencesChange,
  preferences,
  refineInput,
  shouldExpandOnlyUsedResults,
}: Props) => {
  const [selectedRefineBoxTargetLevel, setSelectedRefineBoxTargetLevel] = useState<number | undefined>(() => {
    return getInitialSelectedRefineBoxTargetLevel(allRefineBoxesResults, noRefineBoxResults);
  });

  const prevItemCosts = usePrevious(itemCosts);
  const prevRefineInput = usePrevious(refineInput)

  useEffect(() => {
    if (prevItemCosts === itemCosts && prevRefineInput === refineInput) {
      return;
    }

    const newInitialState =  getInitialSelectedRefineBoxTargetLevel(allRefineBoxesResults, noRefineBoxResults);

    setSelectedRefineBoxTargetLevel(newInitialState);
  }, [allRefineBoxesResults, noRefineBoxResults, prevItemCosts, itemCosts, prevRefineInput, refineInput]);

  return (
    <div>
      <h2>Results</h2>
      <div css={css`display: flex`}>
        <RefineResultsTab
          isSelected={selectedRefineBoxTargetLevel === undefined}
          label="No refine box"
          onClick={() => setSelectedRefineBoxTargetLevel(undefined)}
        />
        {[...allRefineBoxesResults.keys()].map(targetRefineBoxLevel => (
          <RefineResultsTab
            key={targetRefineBoxLevel}
            isSelected={selectedRefineBoxTargetLevel === targetRefineBoxLevel}
            label={`Refine box to +${targetRefineBoxLevel}`}
            onClick={() => setSelectedRefineBoxTargetLevel(targetRefineBoxLevel)}
          />
        ))}
      </div>
      {selectedRefineBoxTargetLevel === undefined && (
        <RefineResult
          onPreferencesChange={onPreferencesChange}
          preferences={preferences}
          refineType={refineInput.refineType}
          shouldExpandOnlyUsedResults={shouldExpandOnlyUsedResults}
          totalRefineResults={noRefineBoxResults}
        />
      )}
      {selectedRefineBoxTargetLevel !== undefined && (
        <RefineBoxResults
          refineBoxResults={allRefineBoxesResults.get(selectedRefineBoxTargetLevel)}
          refineType={refineInput.refineType}
          shouldExpandOnlyUsedResults={shouldExpandOnlyUsedResults}
        />
      )}
    </div>
  );
};

RefineResults.displayName = 'RefineResults';