import React from 'react';
import { NumberInput } from '../../../components/NumberInput';
import { DropDown } from '../../../components/DropDown';
import { DamageType } from '../types/damageType';
import { Weapon } from '../types/weapon.type';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';
import { WeaponType } from '../types/weaponType';
import { PropertyElement } from '../types/propertyElement';

type Props = {
  readonly onChange: (weapon: Weapon) => void;
  readonly weapon: Weapon;
};

export const WeaponInput: React.FC<Props> = ({ onChange, weapon }) => {
  const {
    baseDamage,
    damageType,
    element,
    level,
    refineLevel,
    type,
  } = weapon;
  const onChangeCb = createOnChangeCallback(weapon, onChange);

  return (
    <div>
      <h2>
        Weapon
      </h2>
      <NumberInput
        label="Refine level"
        value={refineLevel}
        onChange={onChangeCb('refineLevel')}
        minValue={0}
        maxValue={10}
      />
      <NumberInput
        label="Weapon level"
        value={level}
        onChange={onChangeCb('level')}
        minValue={1}
        maxValue={4}
      />
      <NumberInput
        label="Weapon Damage"
        value={baseDamage}
        onChange={onChangeCb('baseDamage')}
        minValue={0}
      />
      <DropDown<PropertyElement>
        selectedValue={element}
        values={Object.values(PropertyElement)}
        onChange={onChangeCb('element')}
        getId={element => element}
        getName={element => element}
        label="Element"
      />
      <DropDown<WeaponType>
        selectedValue={type}
        values={Object.values(WeaponType)}
        onChange={onChangeCb('type')}
        getId={type => type}
        getName={type => type}
        label="Weapon Type"
      />
      <DropDown<DamageType>
        selectedValue={damageType}
        values={Object.values(DamageType)}
        onChange={onChangeCb('damageType')}
        getId={type => type}
        getName={type => type}
        label="Damage Type"
      />
    </div>
  );
};