import { useState } from 'react';
import { AspdInput } from '../types/aspdInput.type';
import { LocalStorageManager } from '../../../models/localStorageManager';
import { PotAspdModifier } from '../types/potAspdModifier';
import { SkillAspdModifier } from '../types/skillAspdModifier';
import { Class } from '../types/class';
import { Equip } from '../types/equip';
import { adjustAspdInput } from '../utils/adjustAspdInput';

const localStorageManager = new LocalStorageManager<AspdInput>({
  key: 'aspdInput',
});

const loadAspdInputFromLocalStorage = () =>
  localStorageManager.load({
    agi: 138,
    characterClass: Class.Hunter,
    dex: 92,
    flatBonus: 0,
    leftHandEquip: Equip.Bow,
    percentageBonus: 70,
    potModifer: PotAspdModifier.AwakeningPotion,
    rightHandEquip: Equip.Bow,
    skillModifier: SkillAspdModifier.None,
  });

export const useAspdInput = () => {
  const [aspdInput, setAspdInput] = useState<AspdInput>(loadAspdInputFromLocalStorage);

  const changeAspdInput = (input: AspdInput): void => {
    const adjustedInput = adjustAspdInput(input);

    setAspdInput(adjustedInput);
    localStorageManager.save(adjustedInput);
  };

  return { aspdInput, changeAspdInput };
};