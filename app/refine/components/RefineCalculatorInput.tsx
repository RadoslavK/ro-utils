import React, { useMemo, useState } from 'react';
import { NumberInput } from '../../_components/NumberInput';
import { RefineType } from '../../../types/refineType.type';
import { DropDown } from '../../_components/DropDown';
import { calculateTotalRefineCost } from '../../../calculations/calculateTotalRefineCost';

const refineTypeLabels: Record<RefineType, string> = {
  [RefineType.Armor]: 'Armor',
  [RefineType.Weapon1]: 'Weapon level 1',
  [RefineType.Weapon2]: 'Weapon level 2',
  [RefineType.Weapon3]: 'Weapon level 3',
  [RefineType.Weapon4]: 'Weapon level 4',
};

export const RefineCalculatorInput: React.FC = () => {
  const [baseItemCost, setBaseItemCost] = useState(0);
  const [startingRefineLevel, setStartingRefineLevel] = useState(0);
  const [targetRefineLevel, setTargetRefineLevel] = useState(4);
  const [refineType, setRefineType] = useState<RefineType>(RefineType.Armor);

  const totalCost = useMemo(() => {
    const result = [...calculateTotalRefineCost({
      baseCost: baseItemCost,
      refineType,
      startingRefineLevel,
      targetRefineLevel,
    }).totalRefineResults.values()];

    return result[result.length - 1].cost;
  }, [baseItemCost, refineType, startingRefineLevel, targetRefineLevel]);

  return (
    <div>
      <h2>Input</h2>

      <NumberInput
        label="Base cost"
        value={baseItemCost}
        onChange={setBaseItemCost}
        minValue={0}
      />

      <NumberInput
        label="Starting refine level"
        value={startingRefineLevel}
        onChange={setStartingRefineLevel}
        minValue={0}
        maxValue={targetRefineLevel}
      />

      <NumberInput
        label="Target refine level"
        value={targetRefineLevel}
        onChange={setTargetRefineLevel}
        minValue={startingRefineLevel + 1}
      />

      <DropDown<RefineType>
        label="Refine type"
        selectedValue={refineType}
        values={Object.values(RefineType)}
        onChange={setRefineType}
        getId={refineType => refineType}
        getName={refineType => refineTypeLabels[refineType]}
      />

      Cost: {totalCost}
    </div>
  );
};