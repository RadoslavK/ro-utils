import React from 'react';
import { css } from '@emotion/core';

type Props = {
  readonly isSelected: boolean;
  readonly label: string;
  readonly onClick: () =>  void;
}

export const RefineResultsTab: React.FC<Props> = ({ isSelected, label, onClick }) => {
  return (
    <div
      css={css`
        border: solid 1px darkgreen;
        padding: 4px;
        ${isSelected ? css`background-color: mediumspringgreen` : undefined};
      `}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

RefineResultsTab.displayName = 'RefineResultsTab';