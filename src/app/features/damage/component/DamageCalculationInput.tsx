import React from 'react';
import { css } from '@emotion/core';
import { StatsInput } from './StatsInput';
import { WeaponInput } from './WeaponInput';
import { CheckBox } from '../../../components/CheckBox';
import { NumberInput } from '../../../components/NumberInput';
import { BonusAtkInput } from './BonusAtkInput';
import { AtkMultipliersInput } from './AtkMultipliersInput';
import { TargetInput } from './TargetInput';
import { FinalMultipliersInput } from './FinalMultipliersInput';
import { FinalReductionsInput } from './FinalReductionsInput';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';
import { DamageCalculationInput as DamageCalculationInputModel } from '../types/damageCalculationInput.type';

type Props = {
  readonly damageCalculationInput: DamageCalculationInputModel;
  readonly onDamageCalculationInputChange: (input: DamageCalculationInputModel) => void;
};

export const DamageCalculationInput: React.FC<Props> = (props) => {
  const { damageCalculationInput, onDamageCalculationInputChange } = props;

  const onChange = createOnChangeCallback(damageCalculationInput, onDamageCalculationInputChange);
  const onChangeSkillInput = createOnChangeCallback(damageCalculationInput.skillInput, v => onChange('skillInput')(v));

  const {
    atkMultipliers,
    bonusAtk,
    finalMultipliers,
    finalReductions,
    ignoreSizePenalty,
    removeVariance,
    skillInput,
    stats,
    target,
    useSkill,
    weapon,
  } = damageCalculationInput;

  return (
    <div
      css={css`
        display: flex;
        > * {
          margin-right: 32px;
        }
      `}
    >
      <StatsInput
        onChange={onChange('stats')}
        stats={stats}
      />
      <div>
        <WeaponInput
          onChange={onChange('weapon')}
          weapon={weapon}
        />
        <CheckBox
          isChecked={ignoreSizePenalty}
          label="Ignore size penalty"
          onChange={onChange('ignoreSizePenalty')}
        />
        <CheckBox
          isChecked={removeVariance}
          label="Remove ATK variance"
          onChange={onChange('removeVariance')}
        />
        <NumberInput
          label="Skill Multiplier"
          value={skillInput.multiplier}
          onChange={onChangeSkillInput('multiplier')}
        />
        <NumberInput
          label="Skill Hits"
          value={skillInput.hits}
          onChange={onChangeSkillInput('hits')}
        />
        <CheckBox
          isChecked={useSkill}
          onChange={onChange('useSkill')}
          label="Use Skill"
        />
        <CheckBox
          isChecked={skillInput.canCrit}
          onChange={onChangeSkillInput('canCrit')}
          label="Can Skill Crit"
        />
      </div>
      <BonusAtkInput
        bonusAtk={bonusAtk}
        onChange={onChange('bonusAtk')}
      />
      <AtkMultipliersInput
        atkMultipliers={atkMultipliers}
        onChange={onChange('atkMultipliers')}
      />
      <TargetInput
        target={target}
        onChange={onChange('target')}
      />
      <FinalMultipliersInput
        finalMultipliers={finalMultipliers}
        onChange={onChange('finalMultipliers')}
      />
      <FinalReductionsInput
        finalReductions={finalReductions}
        onChange={onChange('finalReductions')}
      />
    </div>
  );
};

DamageCalculationInput.displayName = 'DamageCalculationInput';