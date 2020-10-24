import React, { useEffect, useRef } from 'react';
import { css } from '@emotion/core';

type Props<T> = {
  readonly selectedValue: T;
  readonly values: readonly T[];
  readonly onChange: (value: T) => void;
  readonly getId: (value: T) => string;
  readonly getName: (value: T) => string;
  readonly label: string;
}

export const DropDown = <T extends unknown>({
  getId,
  getName,
  label,
  onChange,
  selectedValue,
  values,
}: Props<T>) => {
  const onChangeRef = useRef<(value: T) => void>();
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!values.includes(selectedValue)) {
      onChangeRef.current(values[0]);
    }
  }, [values, selectedValue]);

  const changeValue = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.currentTarget;

    onChange(values.find(x => getId(x) === value))
  };

  return (
    <div css={css`margin: 8px 0`}>
      <div>{label}</div>
      <select
        value={getId(selectedValue)}
        onChange={changeValue}
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