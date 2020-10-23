import React from 'react';
import { TotalConsumedMaterials } from '../../../../types/consumedMaterials.type';
import { RefineType } from '../../../../types/refineType.type';
import { css } from '@emotion/core';
import { refineItemIds } from '../../../../constants/refineItemIds';
import { getOreId } from '../../../../utils/getOreId';
import { OreType } from '../../../../types/oreType.type';
import { items } from '../../../constants/items';

const renderImageWithCount = (count: number, itemId: number, title?: string): JSX.Element | null => {
  if (!count) {
    return null;
  }

  const imageLink = getImageLink(itemId);

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
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

const renderTextWithCount = (count: number, text: string): JSX.Element | null => {
  if (!count) {
    return null;
  }

  return (
    <div css={css`display: flex`}>
      <div css={css`margin-right: 6px`}>{text}</div>
      <div>{count.toFixed(2)}</div>
    </div>
  );
};

type Props = {
  readonly consumedMaterials: TotalConsumedMaterials;
  readonly refineType: RefineType;
}

const getImageLink = (id: number): string =>
  `https://static.divine-pride.net/images/items/item/${id}.png`;

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
    <div>
      {renderImageWithCount(baseItems, refineType === RefineType.Armor ? 2306 : 100383, 'Base items')}
      {renderImageWithCount(normalOre, getOreId(OreType.Normal, refineType))}
      {renderImageWithCount(enrichedOre, getOreId(OreType.Enriched, refineType))}
      {renderImageWithCount(hdOre, getOreId(OreType.HD, refineType))}
      {renderImageWithCount(bsb, refineItemIds.BlacksmithBlessing)}
      {renderImageWithCount(refineBox, refineItemIds.RandomRefineBox)}
    </div>
  );
};