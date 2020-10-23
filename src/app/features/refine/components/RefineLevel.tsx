import React, { useMemo, useState } from 'react';
import { css } from '@emotion/core';
import { CheckBox } from '../../../components/CheckBox';
import { RefineType } from '../../../../types/refineType.type';
import { TotalRefineResult } from '../../../../types/totalRefineResult.type';
import { isOreRefineParameters } from '../../../../types/RefineParameters.type';
import { getOreLabel } from '../../utils/getOreLabel';
import { ConsumedMaterials } from './ConsumedMaterials';

type Props = {
  readonly level: number;
  readonly onPreferredRefineParamsChange: (id: string | null) => void;
  readonly preferredRefineParamsId: string | undefined;
  readonly refineType: RefineType;
  readonly shouldShowOnlyBestResults: boolean;
  readonly totalRefineResult: TotalRefineResult;
}

export const RefineLevel: React.FC<Props> = ({
  level,
  onPreferredRefineParamsChange,
  preferredRefineParamsId,
  refineType,
  shouldShowOnlyBestResults,
  totalRefineResult,
}) => {
  const [showDetails, setShowDetails] = useState<ReadonlyMap<string, boolean>>(new Map<string, boolean>());

  let sortedRefineParamsResults = useMemo(() => {
    const results = [...totalRefineResult.refineParamsResults.values()];

    return results.sort((result, otherResult) => result.totalCost - otherResult.totalCost);
  }, [totalRefineResult]);

  if (shouldShowOnlyBestResults) {
    sortedRefineParamsResults = sortedRefineParamsResults.slice(0, 1);
  }

  return (
    <div css={css`flex: 0 0 auto`}>
      <h3 css={css`text-align: center`}>
        +{level}
      </h3>

      {sortedRefineParamsResults.map(paramsResult => {
        const isUsed = paramsResult.id === totalRefineResult.usedRefineParamsId;
        const shouldBeMarked = !shouldShowOnlyBestResults && isUsed;
        const refineMethodLabel = isOreRefineParameters(paramsResult.refineParams)
          ? `${paramsResult.refineParams.useBsb ? 'BSB + ' : ''}${getOreLabel(refineType, paramsResult.refineParams.oreType)}`
          : 'Random refine box';
        const shouldShowDetails = showDetails.get(paramsResult.id);

        return (
          <div
            key={paramsResult.id}
            css={css`
              margin: 10px;
              border: ${shouldBeMarked ? 2.5 : 1}px ${shouldBeMarked ? 'gold' : 'black'} solid;
            `}
            onClick={() => {
              if (preferredRefineParamsId === paramsResult.id) {
                onPreferredRefineParamsChange(null);
              }
              else {
                onPreferredRefineParamsChange(paramsResult.id);
              }
            }}
          >
            <div>Method: {refineMethodLabel}</div>
            <div>Cost: {Math.round(paramsResult.totalCost).toLocaleString()}</div>
            <div>
              <h4
                onClick={(e) => {
                  e.stopPropagation();
                  const newMap = new Map<string, boolean>(showDetails);

                  if (shouldShowDetails) {
                    newMap.delete(paramsResult.id);
                  }
                  else {
                    newMap.set(paramsResult.id, true);
                  }

                  setShowDetails(newMap);
                }}
              >
                {shouldShowDetails ? 'Hide' : 'Show'} consumed materials
              </h4>
              {shouldShowDetails && (
                <div>
                  <div css={css`margin-right: 10px`}>
                    <h3>Upgrade</h3>
                    <ConsumedMaterials
                      consumedMaterials={paramsResult.refineConsumedMaterials}
                      refineType={refineType}
                    />
                  </div>
                  <div>
                    <h3>Total</h3>
                    <ConsumedMaterials
                      consumedMaterials={paramsResult.totalConsumedMaterials}
                      refineType={refineType}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

RefineLevel.displayName = 'RefineLevel';