import React from 'react';

type Props = {
  readonly disabled?: boolean;
  readonly isChecked: boolean;
  readonly onChange?: (isChecked: boolean) => void;
}

export const CheckBox: React.FC<Props> = ({
  isChecked,
  onChange,
  disabled,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { checked } = event.currentTarget;
    onChange(checked);
  };

  return (
    <input
      disabled={disabled}
      checked={isChecked}
      onChange={disabled ? undefined : handleChange}
      type="checkbox"
    />
  );
};

CheckBox.propTypes = {
  onChange: (props: Props, propName, componentName, location, propFullName,) => {
    if (props.disabled === undefined) {
      throw new Error('Provide onChange callback when CheckBox is not disabled');
    }
    else if (props.onChange !== undefined) {
      throw new Error('Can not provide onChange callback when CheckBox is disabled');
    }

    return undefined;
  },
};