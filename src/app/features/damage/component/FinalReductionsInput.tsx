import React from 'react';
import { FinalReductions } from '../types/finalReductions.type';
import { NumberInput } from '../../../components/NumberInput';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';

type Props = {
  readonly finalReductions: FinalReductions;
  readonly onChange: (finalReductions: FinalReductions) => void;
}

export const FinalReductionsInput: React.FC<Props> = ({ finalReductions, onChange }) => {
  const { finalDamage, ranged } = finalReductions;
  const onChangeCb = createOnChangeCallback(finalReductions, onChange);

  return (
    <div>
      <h2>
        Final Reductions
      </h2>
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
    </div>
  );
};