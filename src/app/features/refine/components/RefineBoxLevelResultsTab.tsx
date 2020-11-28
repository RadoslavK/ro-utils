import React from 'react';
import { css } from '@emotion/core';

type Props = {
  readonly averageTotalCost: number;
  readonly chance: number;
  readonly isSelected: boolean;
  readonly level: number;
  readonly maxTotalCost: number;
  readonly minTotalCost: number;
  readonly onClick: () => void;
};

export const RefineBoxLevelResultsTab: React.FC<Props> = (props) => {
  const {
    averageTotalCost,
    chance,
    isSelected,
    level,
    maxTotalCost,
    minTotalCost,
    onClick,
  } = props;

  return (
    <div
      css={css`
        margin: 4px;
        border: solid 1px darkgreen;
        padding: 4px;
        ${isSelected ? css`background-color: mediumspringgreen` : undefined};
      `}
      onClick={onClick}
    >
      <div><strong>Level</strong>: {level}</div>
      <div><strong>Chance</strong>: {chance} %</div>
      <div><strong>Average total cost</strong>: {Math.round(averageTotalCost).toLocaleString()} Z</div>
      <div><strong>Variance</strong>: {Math.round(minTotalCost).toLocaleString()} - {Math.round(maxTotalCost).toLocaleString()} Z</div>
    </div>
  );
};

RefineBoxLevelResultsTab.displayName = 'RefineBoxLevelRefineResults';