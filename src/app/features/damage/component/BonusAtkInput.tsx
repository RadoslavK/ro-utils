import React from 'react';
import { BonusAtk } from '../types/bonusAtk.type';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';
import { NumberInput } from '../../../components/NumberInput';
import { ExtraAtkInput } from './ExtraAtkInput';

type Props = {
  readonly bonusAtk: BonusAtk;
  readonly onChange: (bonusAtk: BonusAtk) => void;
};

export const BonusAtkInput: React.FC<Props> = ({ bonusAtk, onChange }) => {
  const {
    buffAtk,
    extraAtk,
    masteryAtk,
  } = bonusAtk;
  const onChangeCb = createOnChangeCallback(bonusAtk, onChange);

  return (
    <>
      <NumberInput
        label="Buff ATK"
        value={buffAtk}
        onChange={onChangeCb('buffAtk')}
        minValue={0}
      />
      <NumberInput
        label="Mastery ATK"
        value={masteryAtk}
        onChange={onChangeCb('masteryAtk')}
        minValue={0}
      />
      <ExtraAtkInput
        extraAtk={extraAtk}
        onChange={onChangeCb('extraAtk')}
      />
    </>
  );
};