import React, { useEffect, useState } from 'react';
import {
  DamageCalcEffect,
  DamageCalcEffectType,
  DamageCalcEffectValue,
} from '../../types/damageCalcEffect';
import { TextInput } from '../../../../components/TextInput';
import { NumberInput } from '../../../../components/NumberInput';
import { DropDown } from '../../../../components/DropDown';

type Props = {
  readonly effect: DamageCalcEffect;
  readonly onChange: (effect: DamageCalcEffect) => void;
  readonly onRemove: () =>  void;
};

export const EffectBuilderEditor: React.FC<Props> = (props) => {
  const { effect, onChange } = props;

  const [name, setName] = useState('');
  const [values, setValues] = useState<readonly DamageCalcEffectValue[]>([]);

  useEffect(() => {
    setName(effect.name);
    setValues(effect.values);
  }, [effect]);

  const saveEffect = (): void => {
    const updatedEffect: DamageCalcEffect = {
      id: effect.id,
      name,
      values,
    };

    onChange(updatedEffect);
  };

  const addEffectValue = (): void => {
    const effectValue: DamageCalcEffectValue = {
      type: DamageCalcEffectType.ATK,
      value: 0,
    };

    setValues(values.concat([effectValue]));
  };

  const changeEffectValue = (index: number) => (value: number): void => {
    setValues(values.map((effectValue, i) => index === i
      ? { value, type: effectValue.type }
      : effectValue));
  };

  const changeEffectType = (index: number) => (type: DamageCalcEffectType): void => {
    setValues(values.map((effectValue, i) => index === i
      ? { value: effectValue.value, type }
      : effectValue));
  };

  return (
    <div>
      <TextInput
        label="Name"
        onChange={setName}
        value={name}
      />
      <button onClick={addEffectValue}>
        Add value
      </button>
      {values.map(({ type, value }, index) => (
        <div key={index}>
          <DropDown<DamageCalcEffectType>
            getId={x => x}
            getName={x => x}
            label="Type"
            onChange={changeEffectType(index)}
            selectedValue={type}
            values={Object.values(DamageCalcEffectType)}
          />
          <NumberInput
            label="Value"
            value={value}
            onChange={changeEffectValue(index)}
          />
        </div>
      ))}
      <button onClick={saveEffect}>
        Save
      </button>
    </div>
  );
};

EffectBuilderEditor.displayName = 'EffectBuilderEditor';