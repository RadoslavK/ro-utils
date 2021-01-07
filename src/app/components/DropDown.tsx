import React from 'react';
import { css } from '@emotion/core';

type Props<T> = {
  readonly getId: (value: T) => string;
  readonly getName: (value: T) => string;
  readonly label: string;
  readonly onChange: (value: T) => void;
  readonly placeholder?: string;
  readonly selectedValue: T;
  readonly values: readonly T[];
}

export const DropDown = <T extends unknown>({
  getId,
  getName,
  label,
  onChange,
  placeholder,
  selectedValue,
  values,
}: Props<T>) => {
  const changeValue = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.currentTarget;

    onChange(values.find(x => getId(x) === value))
  };

  return (
    <div css={css`margin-top: 8px; margin-bottom: 8px`}>
      <div>{label}</div>
      <select
        onChange={changeValue}
        placeholder={placeholder}
        value={selectedValue ? getId(selectedValue) : undefined}
      >
        {values.map(value => (
          <option
            key={getId(value)}
            value={getId(value)}
          >
            {getName(value)}
          </option>
        ))}
      </select>
    </div>
  );
};