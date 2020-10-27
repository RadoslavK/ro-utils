import React from 'react';
import { css } from '@emotion/core';

type Props = {
  readonly label: string;
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly maxValue?: number;
  readonly minValue?: number;
}

export const NumberInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  minValue,
  maxValue,
}) => {
  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = +event.currentTarget.value;

    if (maxValue !== undefined && value > maxValue) {
      value = maxValue;
    }
    else if (minValue !== undefined && value < minValue) {
      value = minValue;
    }

    onChange(+value);
  };

  return (
    <div css={css`margin-top: 8px; margin-bottom: 8px`}>
      <div>{label}</div>
      <input
        type="number"
        value={value}
        onChange={changeValue}
      />
    </div>
  );
};