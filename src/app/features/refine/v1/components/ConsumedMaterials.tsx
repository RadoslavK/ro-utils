import React from 'react';
import { ConsumedMaterials as ConsumedMaterialsType } from '../types/consumedMaterials.type';
import { RefineType } from '../../common/types/refineType.type';
import { css } from '@emotion/core';
import { refineItemIds } from '../../common/constants/refineItemIds';
import { getOreId } from '../../common/utils/getOreId';
import { OreType } from '../../common/types/oreType.type';
import { items } from '../../../../constants/items';
import { getItemImageLink } from '../../common/utils/getItemImageLink';

const renderImageWithCount = (count: number, itemId: number, title?: string): JSX.Element | null => {
  if (!count) {
    return null;
  }

  const imageLink = getItemImageLink(itemId);

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        margin: 4px;
      `}
    >
      <div
        css={css`
            background-size: auto;
            background-image: url("${imageLink}");
            background-repeat: no-repeat;
            width: 24px;
            height: 24px;
            margin-right: 6px;
        `}
        title={title ?? items.get(itemId)?.name}
      />
      <div>
        {count.toFixed(2)}
      </div>
    </div>
  );
}

type Props = {
  readonly consumedMaterials: ConsumedMaterialsType | undefined;
  readonly refineType: RefineType;
}

export const ConsumedMaterials: React.FC<Props> = ({
  consumedMaterials,
  refineType,
}) => {
  if (!consumedMaterials) {
    return null;
  }

  const {
    bsb,
    enrichedOre,
    hdOre,
    items,
    normalOre,
    refineBox,
  } = consumedMaterials;

  return (
    <div>
      {!!items?.amount && (
        <div css={css`display: flex; align-items: center`}>{renderImageWithCount(items.amount, refineType === RefineType.Armor ? 2306 : 100383, 'Base items')}</div>
      )}
      {renderImageWithCount(normalOre, getOreId(OreType.Normal, refineType))}
      {renderImageWithCount(enrichedOre, getOreId(OreType.Enriched, refineType))}
      {renderImageWithCount(hdOre, getOreId(OreType.HD, refineType))}
      {renderImageWithCount(bsb, refineItemIds.BlacksmithBlessing)}
      {renderImageWithCount(refineBox, refineItemIds.RandomRefineBox)}
    </div>
  );
};