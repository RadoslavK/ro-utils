import React from 'react';
import { DefInput } from './DefInput';
import { Reductions } from '../types/reductions.type';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';
import { AtkReductionMultipliersInput } from './AtkReductionMultipliersInput';
import { PropertyInput } from './PropertyInput';

type Props = {
  readonly onChange: (reductions: Reductions) => void;
  readonly reductions: Reductions;
}

export const ReductionsInput: React.FC<Props> = ({ onChange, reductions }) => {
  const {
    atkMultiplier,
    def,
    property,
  } = reductions;
  const onChangeCb = createOnChangeCallback(reductions, onChange);

  return (
    <div>
      <h2>
        Reductions
      </h2>
      <DefInput
        def={def}
        onChange={onChangeCb('def')}
      />
      <AtkReductionMultipliersInput
        atkReductions={atkMultiplier}
        onChange={onChangeCb('atkMultiplier')}
      />
      <PropertyInput
        onChange={onChangeCb('property')}
        property={property}
      />
    </div>
  );
};