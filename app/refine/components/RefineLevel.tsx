import React, { useState } from 'react';
import { CheckBox } from '../../_components/CheckBox';
import { RefineType } from '../../../types/refineType.type';
import { RefineMaterial } from '../../../types/refineMaterial.type';
import { TotalRefineResult } from '../../../types/totalRefineResult';

const getOreLabel = (refineType: RefineType, ore: RefineMaterial): string => {
  const isWeapon = refineType !== RefineType.Armor;
  const oreName = isWeapon ? 'Oridecon' : 'Elunium';

  switch(ore) {
    case RefineMaterial.Enriched:
      return `Enriched ${oreName}`;
    case RefineMaterial.HD:
      return `HD ${oreName}`;
    case RefineMaterial.Normal:
      return oreName;
    default:
      throw new Error(`Unknown ore type: ${ore}`);
  }
};


type Props = {
  readonly level: number;
  readonly refineType: RefineType;
  readonly totalRefineResult: TotalRefineResult;
}

export const RefineLevel: React.FC<Props> = ({
  level,
  refineType,
  totalRefineResult,
}) => {
  const refineParamsResults = [...totalRefineResult.refineParamsResults.values()];
  const [showDetails, setShowDetails] = useState<ReadonlyMap<string, boolean>>(new Map<string, boolean>());

  return (
    <div>
      <h3>+{level}</h3>

      {refineParamsResults.map(paramsResult => {
        const isBest = paramsResult.id === totalRefineResult.bestRefineParamsId;
        const oreLabel = getOreLabel(refineType, paramsResult.refineParams.oreType);
        const shouldShowDetails = showDetails.get(paramsResult.id);

        return (
          <div
            key={paramsResult.id}
            style={isBest ? { color: 'green', margin: 10, border: '1px black solid' } : { margin: 10, border: '1px black solid' }}
          >
            <div>Ore: {oreLabel}</div>
            {level >= 7 && (
              <div>
                BSB
                <CheckBox
                  disabled
                  isChecked={paramsResult.refineParams.useBsb}
                />
              </div>
            )}
            <div>Cost: {Math.round(paramsResult.cost)}</div>
            <div>
              <h4
                onClick={() => {
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
                  <div>Base items: {paramsResult.consumedMaterials.baseItemCount.toFixed(2)}</div>
                  <div>{getOreLabel(refineType, RefineMaterial.Normal)}: {paramsResult.consumedMaterials.normalOre.toFixed(2)}</div>
                  <div>{getOreLabel(refineType, RefineMaterial.Enriched)}: {paramsResult.consumedMaterials.enrichedOre.toFixed(2)}</div>
                  <div>{getOreLabel(refineType, RefineMaterial.HD)}: {paramsResult.consumedMaterials.hdOre.toFixed(2)}</div>
                  <div>BSB: {paramsResult.consumedMaterials.bsb.toFixed(2)}</div>
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