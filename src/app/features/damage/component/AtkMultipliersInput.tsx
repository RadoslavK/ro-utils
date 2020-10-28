import React from 'react';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';
import { NumberInput } from '../../../components/NumberInput';

type Props = {
  readonly atkMultipliers: AtkMultipliers;
  readonly onChange: (atkMultipliers: AtkMultipliers) => void;
};

export const AtkMultipliersInput: React.FC<Props> = ({ atkMultipliers, onChange }) => {
  const { atk } = atkMultipliers;
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
    </div>
  );
};