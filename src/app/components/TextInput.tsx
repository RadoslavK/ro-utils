import React, { useEffect, useRef } from 'react';

type Props = {
  readonly autoFocus?: boolean;
  readonly onChange: (value: string) => void;
  readonly value: string;
}

export const TextInput: React.FC<Props> = (props) => {
  const { autoFocus, onChange, value } = props;

  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <input
      ref={inputRef}
      onChange={e => onChange(e.currentTarget.value)}
      value={value}
    />
  );
};

TextInput.displayName = 'TextInput';