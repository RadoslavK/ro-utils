import React, { useRef } from 'react';
import { css } from '@emotion/core';

type Props = {
  readonly disabled?: boolean;
  readonly isChecked: boolean;
  readonly label: string;
  readonly onChange?: (isChecked: boolean) => void;
}

export const CheckBox: React.FC<Props> = ({
  disabled = false,
  isChecked,
  label,
  onChange,
}) => {
  const { current: id } = useRef(Math.random().toString(16).slice(-4));

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.currentTarget;
    onChange(checked);
  };

  return (
    <div css={css`display: flex`}>
      <input
        id={id}
        disabled={disabled}
        checked={isChecked}
        onChange={disabled ? undefined : handleChange}
        type="checkbox"
      />
      <label htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

CheckBox.propTypes = {
  onChange: (props: Props, propName, componentName, location, propFullName,) => {
    if (!props.disabled && !props.onChange) {
      throw new Error('Provide onChange callback when CheckBox is not disabled');
    }
    else if (props.disabled && props.onChange) {
      throw new Error('Can not provide onChange callback when CheckBox is disabled');
    }

    return undefined;
  },
};