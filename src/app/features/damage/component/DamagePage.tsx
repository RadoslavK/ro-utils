import React, { useMemo } from 'react';
import { StatsInput } from './StatsInput';
import { getDamage } from '../utils/getDamage';
import { BonusAtkInput } from './BonusAtkInput';
import { AtkMultipliersInput } from './AtkMultipliersInput';
import { css } from '@emotion/core';
import { WeaponInput } from './WeaponInput';
import { TargetInput } from './TargetInput';
import { FinalMultipliersInput } from './FinalMultipliersInput';
import { FinalReductionsInput } from './FinalReductionsInput';
import { NumberInput } from '../../../components/NumberInput';
import { CheckBox } from '../../../components/CheckBox';
import { useDamageCalculationInput } from '../hooks/useDamageCalculationInput';
import { createOnChangeCallback } from '../../../utils/useOnChangeCallback';

export const DamagePage: React.FC = () => {
  const {
    damageCalculationInput,
    onDamageCalculationInputChange,
  } = useDamageCalculationInput();

  const {
    atkMultipliers,
    bonusAtk,
    finalMultipliers,
    finalReductions,
    skillInput,
    stats,
    target,
    useSkill,
    weapon,
  } = damageCalculationInput;

  const damage = useMemo(() => getDamage({
    atkMultipliers,
    bonusAtk,
    finalMultipliers,
    finalReductions,
    target,
    skillInput: useSkill ? skillInput : undefined,
    stats,
    weapon,
  }), [
    atkMultipliers,
    bonusAtk,
    finalMultipliers,
    finalReductions,
    skillInput,
    stats,
    target,
    useSkill,
    weapon,
  ]);

  const onChange = createOnChangeCallback(damageCalculationInput, onDamageCalculationInputChange);
  const onChangeSkillInput = createOnChangeCallback(skillInput, v => onChange('skillInput')(v));

  return (
    <div>
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
      <div>
        <h2>
          Damage
        </h2>
        <div>
          <h3>Non Crit</h3>
          <div>Min dmg: {damage.nonCrit.min.toFixed(2)}</div>
          <div>Max dmg: {damage.nonCrit.max.toFixed(2)}</div>
          <div>Average dmg: {((damage.nonCrit.min + damage.nonCrit.max) / 2).toFixed(2)}</div>
        </div>
        <div>
          <h3>Crit</h3>
          <div>Min dmg: {damage.crit.min.toFixed(2)}</div>
          <div>Max dmg: {damage.crit.max.toFixed(2)}</div>
          <div>Average dmg: {((damage.crit.min + damage.crit.max) / 2).toFixed(2)}</div>
        </div>
        <div>
          <h3>Averaged</h3>
          <div>Min dmg: {damage.averaged.min.toFixed(2)}</div>
          <div>Max dmg: {damage.averaged.max.toFixed(2)}</div>
          <div>Average dmg: {((damage.averaged.min + damage.averaged.max) / 2).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};