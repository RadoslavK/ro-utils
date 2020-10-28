import React from 'react';
import { Stats } from '../types/stats.type';
import { NumberInput } from '../../../components/NumberInput';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';
import { CheckBox } from '../../../components/CheckBox';

type Props = {
  readonly onChange: (stats: Stats) => void;
  readonly stats: Stats;
}

export const StatsInput: React.FC<Props> = ({ onChange, stats }) => {
  const {
    baseLevel,
    dex,
    luk,
    str,
    useCritical,
  } = stats;

  const onChangeCb = createOnChangeCallback(stats, onChange);

  return (
    <div>
      <h2>
        Stats
      </h2>
      <NumberInput
        label="Base level"
        value={baseLevel}
        onChange={onChangeCb('baseLevel')}
        maxValue={99}
        minValue={1}
      />
      <NumberInput
        label="STR"
        value={str}
        onChange={onChangeCb('str')}
        minValue={1}
      />
      <NumberInput
        label="DEX"
        value={dex}
        onChange={onChangeCb('dex')}
        minValue={1}
      />
      <NumberInput
        label="LUK"
        value={luk}
        onChange={onChangeCb('luk')}
        minValue={1}
      />
      <CheckBox
        label="Use Critical"
        isChecked={useCritical}
        onChange={onChangeCb('useCritical')}
      />
    </div>
  );
};