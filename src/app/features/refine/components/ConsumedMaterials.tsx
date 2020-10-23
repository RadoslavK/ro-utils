import React from 'react';
import { TotalConsumedMaterials } from '../../../../types/consumedMaterials.type';
import { OreType } from '../../../../types/oreType.type';
import { RefineType } from '../../../../types/refineType.type';
import { getOreLabel } from '../../utils/getOreLabel';

type Props = {
  readonly consumedMaterials: TotalConsumedMaterials;
  readonly refineType: RefineType;
}

export const ConsumedMaterials: React.FC<Props> = ({
  consumedMaterials,
  refineType,
}) => {
  const {
    refineBox,
    baseItems,
    hdOre,
    enrichedOre,
    normalOre,
    bsb,
  } = consumedMaterials;

  return (
    <>
      {!!baseItems && <div>Base items: {baseItems.toFixed(2)}</div>}
      {!!normalOre && <div>{getOreLabel(refineType, OreType.Normal)}: {normalOre.toFixed(2)}</div>}
      {!!enrichedOre && <div>{getOreLabel(refineType, OreType.Enriched)}: {enrichedOre.toFixed(2)}</div>}
      {!!hdOre && <div>{getOreLabel(refineType, OreType.HD)}: {hdOre.toFixed(2)}</div>}
      {!!bsb && <div>BSB: {bsb.toFixed(2)}</div>}
      {!!refineBox && <div>Random refine boxes: {refineBox.toFixed(2)}</div>}
    </>
  );
};