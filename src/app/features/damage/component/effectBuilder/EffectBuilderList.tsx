import React, { useMemo } from 'react';
import { DamageCalcEffect } from '../../types/damageCalcEffect';
import { DropDown } from '../../../../components/DropDown';

type Props = {
  readonly effects: ReadonlyMap<string, DamageCalcEffect>;
  readonly selectedEffectId: string | undefined;
  readonly onSelectedEffectIdChange: (id: string) => void;
};

export const EffectBuilderList: React.FC<Props> = (props) => {
  const { effects, selectedEffectId, onSelectedEffectIdChange } = props;

  const options = useMemo(() => [...effects.values()], [effects]);
  const effect: DamageCalcEffect | undefined = effects.get(selectedEffectId);

  return (
    <DropDown<DamageCalcEffect>
      getId={x => x.id}
      getName={x => x.name}
      label="Effects"
      onChange={x => onSelectedEffectIdChange(x.id)}
      placeholder="Select effect..."
      selectedValue={effect}
      values={options}
    />
  );
};

EffectBuilderList.displayName = 'EffectBuilderList';