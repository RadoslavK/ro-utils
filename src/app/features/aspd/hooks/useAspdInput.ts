import { useState } from 'react';
import { AspdInput } from '../types/aspdInput.type';
import { LocalStorageManager } from '../../../models/localStorageManager';
import { AspdWeaponType } from '../types/aspdWeaponType';
import { PotAspdModifier } from '../types/potAspdModifier';
import { SkillAspdModifier } from '../types/skillAspdModifier';

const localStorageManager = new LocalStorageManager<AspdInput>({
  key: 'aspdInput',
});

const loadAspdInputFromLocalStorage = () =>
  localStorageManager.load({
    agi: 100,
    baseAspd: 156,
    dex: 80,
    flatBonus: 0,
    penalty: 2,
    percentageBonus: 0,
    potModifer: PotAspdModifier.AwakeningPotion,
    skillModifier: SkillAspdModifier.None,
    weaponType: AspdWeaponType.Ranged,
  });

export const useAspdInput = () => {
  const [aspdInput, setAspdInput] = useState<AspdInput>(loadAspdInputFromLocalStorage);

  const changeAspdInput = (input: AspdInput): void => {
    setAspdInput(input);
    localStorageManager.save(input);
  };

  return { aspdInput, changeAspdInput };
};