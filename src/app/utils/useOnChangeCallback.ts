export const createOnChangeCallback = <TValue>(originalValue: TValue, onChange: (newValue: TValue) => void) =>
  <TProp extends keyof TValue>(prop: TProp) =>
    (value: TValue[TProp]): void => {
      onChange({
        ...originalValue,
        [prop]: value,
      });
    };
