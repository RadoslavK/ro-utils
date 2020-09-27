import React, { useState } from 'react';
import { CheckBox } from '../../_components/CheckBox';
import { RefineType } from '../../../types/refineType.type';
import { TotalRefineResult } from '../../../types/totalRefineResult';
import { OreType } from '../../../types/oreType.type';

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
  const refineParamsErrors = [...totalRefineResult.refineParamsErrors.values()];
  const [showDetails, setShowDetails] = useState<ReadonlyMap<string, boolean>>(new Map<string, boolean>());

  return (
    <div>
      <h3>+{level}</h3>

      {refineParamsErrors.map(paramsError => {
        const oreLabel = getOreLabel(refineType, paramsError.refineParams.oreType);

        return (
          <div
            key={paramsError.id}
            style={{
              margin: 10,
              border: '1px black solid',
            }}
          >
            <div>Ore: {oreLabel}</div>
            {level > 7 && (
              <div>
                BSB
                <CheckBox
                  disabled
                  isChecked={paramsError.refineParams.useBsb}
                />
              </div>
            )}
            <div>Error message: {paramsError.message}</div>
          </div>
        );
      })}

      {refineParamsResults.map(paramsResult => {
        const isBest = paramsResult.id === totalRefineResult.bestRefineParamsId;
        const isUsed = paramsResult.id === totalRefineResult.usedRefineParamsId;
        const oreLabel = getOreLabel(refineType, paramsResult.refineParams.oreType);
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
            <div>Ore: {oreLabel}</div>
            {level > 7 && (
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
                  <div>Base items: {paramsResult.consumedMaterials.baseItemCount.toFixed(2)}</div>
                  <div>{getOreLabel(refineType, OreType.Normal)}: {paramsResult.consumedMaterials.normalOre.toFixed(2)}</div>
                  <div>{getOreLabel(refineType, OreType.Enriched)}: {paramsResult.consumedMaterials.enrichedOre.toFixed(2)}</div>
                  <div>{getOreLabel(refineType, OreType.HD)}: {paramsResult.consumedMaterials.hdOre.toFixed(2)}</div>
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