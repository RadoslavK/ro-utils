import React from 'react';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';
import { NumberInput } from '../../../components/NumberInput';

type Props = {
  readonly atkMultipliers: AtkMultipliers;
  readonly onChange: (atkMultipliers: AtkMultipliers) => void;
};

export const AtkMultipliersInput: React.FC<Props> = ({ atkMultipliers, onChange }) => {
  const {
    atk,
    race,
    size,
    targetProperty,
  } = atkMultipliers;
  const onChangeCb = createOnChangeCallback(atkMultipliers, onChange);

  return (
    <div>
      <h2>
        ATK Multipliers
      </h2>
      <NumberInput
        label="ATK"
        value={atk}
        onChange={onChangeCb('atk')}
      />
      <NumberInput
        label="Race"
        value={race}
        onChange={onChangeCb('race')}
      />
      <NumberInput
        label="Size"
        value={size}
        onChange={onChangeCb('size')}
      />
      <NumberInput
        label="Property Element"
        value={targetProperty}
        onChange={onChangeCb('targetProperty')}
      />
    </div>
  );
};