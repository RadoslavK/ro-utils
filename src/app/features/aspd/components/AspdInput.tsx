import React, { useMemo } from 'react';
import { AspdInput as AspdInputType } from '../types/aspdInput.type';
import { NumberInput } from '../../../components/NumberInput';
import { DropDown } from '../../../components/DropDown';
import { SkillAspdModifier } from '../types/skillAspdModifier';
import { PotAspdModifier } from '../types/potAspdModifier';
import { Class } from '../types/class';
import { EquipChanges, EquipInput } from './EquipInput';
import { allowedPots } from '../constants/allowedPots';
import { getSkillModifiers } from '../utils/getSkillModifiers';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';

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
    characterClass,
    dex,
    flatBonus,
    leftHandEquip,
    percentageBonus,
    potModifer,
    rightHandEquip,
    skillModifier,
  } = aspdInput;

  const onChange = createOnChangeCallback(aspdInput, onAspdInputChange);

  const changeEquip = (equip: EquipChanges): void => {
    onAspdInputChange({
      ...aspdInput,
      leftHandEquip: equip.leftHand || aspdInput.leftHandEquip,
      rightHandEquip: equip.rightHand || aspdInput.rightHandEquip,
    })
  };

  const potOptions = [PotAspdModifier.None, ...allowedPots[characterClass]];
  const skillModifierOptions = useMemo(
    () => [...getSkillModifiers(characterClass, [leftHandEquip, rightHandEquip]).values()],
    [characterClass, leftHandEquip, rightHandEquip],
  );

  return (
    <div>
      <DropDown<Class>
        selectedValue={characterClass}
        values={Object.values(Class)}
        onChange={onChange('characterClass')}
        getId={type => type}
        getName={type => type}
        label="Class"
      />
      <EquipInput
        characterClass={characterClass}
        leftHandEquip={leftHandEquip}
        onChange={changeEquip}
        rightHandEquip={rightHandEquip}
      />
      <NumberInput
        label="AGI"
        value={agi}
        onChange={onChange('agi')}
        minValue={0}
      />
      <NumberInput
        label="DEX"
        value={dex}
        onChange={onChange('dex')}
        minValue={0}
      />
      <DropDown<PotAspdModifier>
        onChange={onChange('potModifer')}
        selectedValue={potModifer}
        values={potOptions}
        getId={modifier => modifier}
        getName={modifier => modifier}
        label="Potion modifier"
      />
      {skillModifierOptions.length > 1 && (
        <DropDown<SkillAspdModifier>
          onChange={onChange('skillModifier')}
          selectedValue={skillModifier}
          values={skillModifierOptions}
          getId={modifier => modifier}
          getName={modifier => modifier}
          label="Skill modifiers"
        />
      )}
      <NumberInput
        label="% Bonus"
        value={percentageBonus}
        onChange={onChange('percentageBonus')}
        minValue={0}
      />
      <NumberInput
        label="Flat Bonus"
        value={flatBonus}
        onChange={onChange('flatBonus')}
        minValue={0}
      />
    </div>
  );
};