import React, { useState } from 'react';
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
  readonly refineType: RefineType;
  readonly totalRefineResult: TotalRefineResult;
  readonly preferredRefineParamsId: string | undefined;
  readonly onPreferredRefineParamsChange: (id: string | null) => void;
}

export const RefineLevel: React.FC<Props> = ({
  level,
  refineType,
  totalRefineResult,
  onPreferredRefineParamsChange,
  preferredRefineParamsId,
}) => {
  const refineParamsResults = [...totalRefineResult.refineParamsResults.values()];
  const [showDetails, setShowDetails] = useState<ReadonlyMap<string, boolean>>(new Map<string, boolean>());

  return (
    <div style={{ flex: '0 0 auto' }}>
      <h3>+{level}</h3>

      {refineParamsResults.map(paramsResult => {
        const isBest = paramsResult.id === totalRefineResult.bestRefineParamsId;
        const isUsed = paramsResult.id === totalRefineResult.usedRefineParamsId;
        const refineMethodLabel = isOreRefineParameters(paramsResult.refineParams)
          ? getOreLabel(refineType, paramsResult.refineParams.oreType)
          : 'Random refine box';
        const shouldShowDetails = showDetails.get(paramsResult.id);

        return (
          <div
            key={paramsResult.id}
            style={{
              margin: 10,
              border: '1px ' + (isUsed ? 'gold' : 'black') + ' solid',
              color: isBest ? 'green' : undefined,
            }}
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
              <div>
                BSB
                <CheckBox
                  disabled
                  isChecked={paramsResult.refineParams.useBsb}
                />
              </div>
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
                  <div style={{ marginRight: 10 }}>
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