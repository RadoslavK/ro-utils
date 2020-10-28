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
    luk: 112,
    str: 6,
    crit: 53,
  });
  const [weapon, setWeapon] = useState<Weapon>({
    baseDamage: 120,
    damageType: DamageType.PhysicalRanged,
    element: PropertyElement.Holy,
    level: 3,
    refineLevel: 9,
    type: WeaponType.Bow,
  });
  const [target, setTarget] = useState<Target>({
    def: {
      hard: 279,
      soft: 114,
    },
    critShield: 14.2,
    atkReductionMultiplier: {
      property: 1,
      race: 1,
      size: 1,
      targetProperty: 1,
    },
    property: {
      element: PropertyElement.Undead,
      level: 1,
    },
    size: Size.Medium,
  })
  const [bonusAtk, setBonusAtk] = useState<BonusAtk>({
    extraAtk: {
      pseudoBuff: 0,
      equip: 85,
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
    ranged: 1.3,
    critical: 1.1,
  });
  const [finalReductions, setFinalReductions] = useState<FinalReductions>({
    finalDamage: 1,
    ranged: 1,
  });
  const [skillInput, setSkillInput] = useState<SkillInput>({
    canCrit: true,
    multiplier: 3,
    hits: 1,
  });
  const [useSkill, setUseSkill] = useState(false);

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
          <CheckBox
            isChecked={skillInput.canCrit}
            onChange={newV => setSkillInput({ ...skillInput, canCrit: newV })}
            label="Can Skill Crit"
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