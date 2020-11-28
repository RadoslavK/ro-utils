import React from 'react';
import { css } from '@emotion/core';

type Props = {
  readonly averageTotalCost: number;
  readonly isSelected: boolean;
  readonly label: string;
  readonly maxTotalCost: number;
  readonly minTotalCost: number;
  readonly onClick: () =>  void;
}

export const RefineResultsTab: React.FC<Props> = (props) => {
  const {
    averageTotalCost,
    isSelected,
    label,
    maxTotalCost,
    minTotalCost,
    onClick,
  } = props;

  return (
    <div
      css={css`
        border: solid 1px darkgreen;
        padding: 4px;
        ${isSelected ? css`background-color: mediumspringgreen` : undefined};
      `}
      onClick={onClick}
    >
      <div><strong>{label}</strong></div>
      <div><strong>Average cost</strong>: {Math.round(averageTotalCost).toLocaleString()} Z</div>
      <div><strong>Variance</strong>: {Math.round(minTotalCost).toLocaleString()} ~ {Math.round(maxTotalCost).toLocaleString()} Z</div>
    </div>
  );
};

RefineResultsTab.displayName = 'RefineResultsTab';