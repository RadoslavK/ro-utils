import React from 'react';
import { Def } from '../types/def.type';
import { NumberInput } from '../../../components/NumberInput';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';

type Props = {
  readonly def: Def;
  readonly onChange: (def: Def) => void;
}

export const DefInput: React.FC<Props> = ({ def, onChange }) => {
  const onChangeCb = createOnChangeCallback(def, onChange);

  return (
    <>
      <NumberInput
        label="Hard DEF"
        value={def.hard}
        onChange={onChangeCb('hard')}
        minValue={0}
      />
      <NumberInput
        label="Soft DEF"
        value={def.soft}
        onChange={onChangeCb('soft')}
        minValue={0}
      />
    </>
  );
};