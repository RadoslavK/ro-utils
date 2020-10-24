import React from 'react';
import { AspdInput as AspdInputType } from '../types/aspdInput.type';
import { NumberInput } from '../../../components/NumberInput';
import { DropDown } from '../../../components/DropDown';
import { AspdWeaponType } from '../types/aspdWeaponType';
import { SkillAspdModifier } from '../types/skillAspdModifier';
import { PotAspdModifier } from '../types/potAspdModifier';

type Props = {
  readonly aspdInput: AspdInputType;
  readonly onAspdInputChange: (input: AspdInputType) => void;
}

export const AspdInput: React.FC<Props> = ({
  aspdInput,
  onAspdInputChange,
}) => {
  const {
    agi,
    baseAspd,
    dex,
    flatBonus,
    penalty,
    percentageBonus,
    potModifer,
    skillModifier,
    weaponType,
  } = aspdInput;

  const onChange = <TKey extends keyof AspdInputType>(prop: TKey) => (value: AspdInputType[TKey]): void => {
    onAspdInputChange({
      ...aspdInput,
      [prop]: value,
    });
  };

  return (
    <div>
      <NumberInput
        label="Base ASPD"
        value={baseAspd}
        onChange={onChange('baseAspd')}
      />
      <NumberInput
        label="Penalty"
        value={penalty}
        onChange={onChange('penalty')}
      />
      <DropDown<AspdWeaponType>
        selectedValue={weaponType}
        values={Object.values(AspdWeaponType)}
        onChange={onChange('weaponType')}
        getId={type => type}
        getName={type => type}
        label="Weapon type"
      />
      <NumberInput
        label="AGI"
        value={agi}
        onChange={onChange('agi')}
      />
      <NumberInput
        label="DEX"
        value={dex}
        onChange={onChange('dex')}
      />
      <DropDown<PotAspdModifier>
        onChange={onChange('potModifer')}
        selectedValue={potModifer}
        values={Object.values(PotAspdModifier)}
        getId={modifier => modifier}
        getName={modifier => modifier}
        label="Potion modifier"
      />
      <DropDown<SkillAspdModifier>
        onChange={onChange('skillModifier')}
        selectedValue={skillModifier}
        values={Object.values(SkillAspdModifier)}
        getId={modifier => modifier}
        getName={modifier => modifier}
        label="Skill modifiers"
      />
      <NumberInput
        label="% Bonus"
        value={percentageBonus}
        onChange={onChange('percentageBonus')}
      />
      <NumberInput
        label="Flat Bonus"
        value={flatBonus}
        onChange={onChange('flatBonus')}
      />
    </div>
  );
};