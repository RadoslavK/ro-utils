import React, { useMemo, useState } from 'react';
import { StatsInput } from './StatsInput';
import { Stats } from '../types/stats.type';
import { getDamage } from '../utils/getDamage';
import { DamageType } from '../types/damageType';
import { BonusAtk } from '../types/bonusAtk.type';
import { BonusAtkInput } from './BonusAtkInput';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { AtkMultipliersInput } from './AtkMultipliersInput';
import { css } from '@emotion/core';
import { WeaponInput } from './WeaponInput';
import { Weapon } from '../types/weapon.type';
import { TargetInput } from './TargetInput';
import { PropertyElement } from '../types/propertyElement';
import { Target } from '../types/reductions.type';
import { FinalMultipliers } from '../types/finalMultipliers.type';
import { FinalReductions } from '../types/finalReductions.type';
import { FinalMultipliersInput } from './FinalMultipliersInput';
import { FinalReductionsInput } from './FinalReductionsInput';
import { WeaponType } from '../types/weaponType';
import { Size } from '../types/size';
import { SkillInput } from '../types/skillInput.type';
import { NumberInput } from '../../../components/NumberInput';
import { CheckBox } from '../../../components/CheckBox';

export const DamagePage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    baseLevel: 99,
    dex: 98,
    luk: 107,
    str: 8,
    crit: 62,
  });
  const [weapon, setWeapon] = useState<Weapon>({
    baseDamage: 65,
    damageType: DamageType.PhysicalRanged,
    element: PropertyElement.Wind,
    level: 2,
    refineLevel: 6,
    type: WeaponType.Bow,
  });
  const [target, setTarget] = useState<Target>({
    def: {
      soft: 90,
      hard: 280,
    },
    critShield: 12,
    atkReductionMultiplier: {
      property: 1,
      race: 1,
      size: 1,
      targetProperty: 1,
    },
    property: {
      element: PropertyElement.Water,
      level: 2,
    },
    size: Size.Large,
  })
  const [bonusAtk, setBonusAtk] = useState<BonusAtk>({
    extraAtk: {
      pseudoBuff: 0,
      equip: 30,
      consumable: 0,
      ammunition: 25,
    },
    masteryAtk: 0,
    buffAtk: 25,
  });
  const [atkMultipliers, setAtkMultipliers] = useState<AtkMultipliers>({
    atk: 1,
    monster: 1,
    race: 1,
    size: 1,
    targetProperty: 1,
  });
  const [finalMultipliers, setFinalMultipliers] = useState<FinalMultipliers>({
    damage: 1,
    finalDamage: 1,
    ranged: 1.1,
    critical: 1,
  });
  const [finalReductions, setFinalReductions] = useState<FinalReductions>({
    finalDamage: 1,
    ranged: 1,
  });
  const [skillInput, setSkillInput] = useState<SkillInput>({
    canCrit: false,
    multiplier: 1.9,
    hits: 2,
  });
  const [useSkill, setUseSkill] = useState(false);

  const {
    max: maxDmg,
    min: minDmg,
  } = useMemo(() => getDamage({
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

  return (
    <div>
      <div css={css`
      display: flex;
      > * {
        margin-right: 32px;
      }
    `}>
        <StatsInput
          onChange={setStats}
          stats={stats}
        />
        <div>
          <WeaponInput
            onChange={setWeapon}
            weapon={weapon}
          />
          <NumberInput
            label="Skill Multiplier"
            value={skillInput.multiplier}
            onChange={newV => setSkillInput({ ...skillInput, multiplier: newV })}
          />
          <NumberInput
            label="Skill Hits"
            value={skillInput.hits}
            onChange={newV => setSkillInput({ ...skillInput, hits: newV })}
          />
          <CheckBox
            isChecked={useSkill}
            onChange={setUseSkill}
            label="Use Skill"
          />
        </div>
        <BonusAtkInput
          bonusAtk={bonusAtk}
          onChange={setBonusAtk}
        />
        <AtkMultipliersInput
          atkMultipliers={atkMultipliers}
          onChange={setAtkMultipliers}
        />
        <TargetInput
          target={target}
          onChange={setTarget}
        />
        <FinalMultipliersInput
          finalMultipliers={finalMultipliers}
          onChange={setFinalMultipliers}
        />
        <FinalReductionsInput
          finalReductions={finalReductions}
          onChange={setFinalReductions}
        />
      </div>
      <div>Min dmg: {minDmg.toFixed(2)}</div>
      <div>Max dmg: {maxDmg.toFixed(2)}</div>
      <div>Average dmg: {((minDmg + maxDmg) / 2).toFixed(2)}</div>
    </div>
  );
};