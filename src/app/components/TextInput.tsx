import React, { useEffect, useRef } from 'react';
import { css } from '@emotion/core';

type Props = {
  readonly autoFocus?: boolean;
  readonly label?: string;
  readonly onChange: (value: string) => void;
  readonly value: string;
}

export const TextInput: React.FC<Props> = (props) => {
  const { autoFocus, label, onChange, value } = props;

  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div css={css`margin-top: 8px; margin-bottom: 8px`}>
      <div>{label}</div>
      <input
        ref={inputRef}
        onChange={e => onChange(e.currentTarget.value)}
        value={value}
      />
    </div>
  );
};

TextInput.displayName = 'TextInput';