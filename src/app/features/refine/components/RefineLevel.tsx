import React, { useMemo, useState } from 'react';
import { css } from '@emotion/core';
import { CheckBox } from '../../../components/CheckBox';
import { RefineType } from '../../../../types/refineType.type';
import { TotalRefineResult } from '../../../../types/totalRefineResult.type';
import { OreType } from '../../../../types/oreType.type';
import { isOreRefineParameters } from '../../../../types/RefineParameters.type';

const getOreLabel = (refineType: RefineType, ore: OreType): string => {
  const isWeapon = refineType !== RefineType.Armor;
  const oreName = isWeapon ? 'Oridecon' : 'Elunium';

  switch(ore) {
    case OreType.Enriched:
      return `Enriched ${oreName}`;
    case OreType.HD:
      return `HD ${oreName}`;
    case OreType.Normal:
      return oreName;
    default:
      throw new Error(`Unknown ore type: ${ore}`);
  }
};

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
          ? getOreLabel(refineType, paramsResult.refineParams.oreType)
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
            {level > 7 && isOreRefineParameters(paramsResult.refineParams) && (
              <CheckBox
                disabled
                isChecked={paramsResult.refineParams.useBsb}
                label="BSB"
              />
            )}
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
                    <div>Extra base items: {paramsResult.refineConsumedMaterials.baseItems.toFixed(2)}</div>
                    <div>{getOreLabel(refineType, OreType.Normal)}: {paramsResult.refineConsumedMaterials.normalOre.toFixed(2)}</div>
                    <div>{getOreLabel(refineType, OreType.Enriched)}: {paramsResult.refineConsumedMaterials.enrichedOre.toFixed(2)}</div>
                    <div>{getOreLabel(refineType, OreType.HD)}: {paramsResult.refineConsumedMaterials.hdOre.toFixed(2)}</div>
                    <div>BSB: {paramsResult.refineConsumedMaterials.bsb.toFixed(2)}</div>
                    <div>Random refine boxes: {paramsResult.refineConsumedMaterials.refineBox.toFixed(2)}</div>
                  </div>
                  <div>
                    <h3>Total</h3>
                    <div>Base items: {paramsResult.totalConsumedMaterials.baseItems.toFixed(2)}</div>
                    <div>{getOreLabel(refineType, OreType.Normal)}: {paramsResult.totalConsumedMaterials.normalOre.toFixed(2)}</div>
                    <div>{getOreLabel(refineType, OreType.Enriched)}: {paramsResult.totalConsumedMaterials.enrichedOre.toFixed(2)}</div>
                    <div>{getOreLabel(refineType, OreType.HD)}: {paramsResult.totalConsumedMaterials.hdOre.toFixed(2)}</div>
                    <div>BSB: {paramsResult.totalConsumedMaterials.bsb.toFixed(2)}</div>
                    <div>Random refine boxes: {paramsResult.totalConsumedMaterials.refineBox.toFixed(2)}</div>
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