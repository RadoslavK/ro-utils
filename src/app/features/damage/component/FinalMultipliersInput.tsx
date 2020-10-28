import React from 'react';
import { FinalMultipliers } from '../types/finalMultipliers.type';
import { NumberInput } from '../../../components/NumberInput';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';

type Props = {
  readonly finalMultipliers: FinalMultipliers;
  readonly onChange: (finalMultipliers: FinalMultipliers) => void;
}

export const FinalMultipliersInput: React.FC<Props> = ({ finalMultipliers, onChange }) => {
  const {
    critical,
    damage,
    finalDamage,
    ranged,
  } = finalMultipliers;
  const onChangeCb = createOnChangeCallback(finalMultipliers, onChange);

  return (
    <div>
      <h2>
        Final Multipliers
      </h2>
      <NumberInput
        label="Damage"
        value={damage}
        onChange={onChangeCb('damage')}
        minValue={0}
      />
      <NumberInput
        label="Final Damage"
        value={finalDamage}
        onChange={onChangeCb('finalDamage')}
        minValue={0}
      />
      <NumberInput
        label="Ranged"
        value={ranged}
        onChange={onChangeCb('ranged')}
        minValue={0}
      />
      <NumberInput
        label="Critical"
        value={critical}
        onChange={onChangeCb('critical')}
        minValue={0}
      />
    </div>
  );
};