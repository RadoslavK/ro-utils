import { LocalStorageManager } from '../../../models/localStorageManager';
import { LocalStorageKeys } from '../../../constants/localStorageKeys';
import { useCallback, useState } from 'react';
import { RefineType } from '../types/refineType.type';
import { RefineInput } from '../types/refineInput.type';

const defaultRefineItemInput: RefineInput = {
  baseItemCost: 1_500_000,
  refineType: RefineType.Armor,
  startingRefineLevel: 0,
  targetRefineLevel: 9,
};

const localStorageManager = new LocalStorageManager<RefineInput>({
  key: LocalStorageKeys.RefineInput,
});

export const useRefineInput = () => {
  const [refineInput, setRefineInput] = useState<RefineInput>(() => {
    const loadedInput = localStorageManager.load(defaultRefineItemInput);

    //  TODO get rid of this
    Object
      .entries(defaultRefineItemInput)
      .forEach((([key, value]) => {
        if (!(key in loadedInput)) {
          loadedInput[key] = value;
        }
      }));

    return loadedInput;
  });

  const changeRefineInput = useCallback((refineInput: RefineInput): void => {
    setRefineInput(refineInput);

    localStorageManager.save(refineInput);
  }, [setRefineInput]);

  return {
    refineInput,
    setRefineInput: changeRefineInput,
  };
};