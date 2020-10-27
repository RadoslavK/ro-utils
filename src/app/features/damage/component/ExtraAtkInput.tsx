import React from 'react';
import { ExtraAtk } from '../types/extraAtk.type';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';
import { NumberInput } from '../../../components/NumberInput';

type Props = {
  readonly extraAtk: ExtraAtk;
  readonly onChange: (extraAtk: ExtraAtk) =>  void;
}

export const ExtraAtkInput: React.FC<Props> = ({ extraAtk, onChange }) => {
  const {
    ammunition,
    consumable,
    equip,
    pseudoBuff,
  } = extraAtk;
  const onChangeCb = createOnChangeCallback(extraAtk, onChange);

  return (
    <>
      <NumberInput
        label="Ammunition"
        value={ammunition}
        onChange={onChangeCb('ammunition')}
        minValue={0}
      />
      <NumberInput
        label="Consumable"
        value={consumable}
        onChange={onChangeCb('consumable')}
        minValue={0}
      />
      <NumberInput
        label="Equip"
        value={equip}
        onChange={onChangeCb('equip')}
        minValue={0}
      />
      <NumberInput
        label="Pseudo Buff"
        value={pseudoBuff}
        onChange={onChangeCb('pseudoBuff')}
        minValue={0}
      />
    </>
  );
};