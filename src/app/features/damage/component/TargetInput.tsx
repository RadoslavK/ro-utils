import React from 'react';
import { DefInput } from './DefInput';
import { Target } from '../types/reductions.type';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';
import { AtkReductionMultipliersInput } from './AtkReductionMultipliersInput';
import { PropertyInput } from './PropertyInput';
import { DropDown } from '../../../components/DropDown';
import { Size } from '../types/size';

type Props = {
  readonly onChange: (reductions: Target) => void;
  readonly target: Target;
}

export const TargetInput: React.FC<Props> = ({ onChange, target }) => {
  const {
    atkReductionMultiplier,
    def,
    property,
    size,
  } = target;
  const onChangeCb = createOnChangeCallback(target, onChange);

  return (
    <div>
      <h2>
        Target
      </h2>
      <DropDown
        selectedValue={size}
        values={Object.values(Size)}
        onChange={onChangeCb('size')}
        getId={size => size}
        getName={size => size}
        label="Size"
      />
      <DefInput
        def={def}
        onChange={onChangeCb('def')}
      />
      <AtkReductionMultipliersInput
        atkReductions={atkReductionMultiplier}
        onChange={onChangeCb('atkReductionMultiplier')}
      />
      <PropertyInput
        onChange={onChangeCb('property')}
        property={property}
      />
    </div>
  );
};