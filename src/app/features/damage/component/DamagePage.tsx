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
import { ReductionsInput } from './ReductionsInput';
import { PropertyElement } from '../types/propertyElement';
import { Reductions } from '../types/reductions.type';
import { FinalMultipliers } from '../types/finalMultipliers.type';
import { FinalReductions } from '../types/finalReductions.type';
import { FinalMultipliersInput } from './FinalMultipliersInput';
import { FinalReductionsInput } from './FinalReductionsInput';

export const DamagePage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    baseLevel: 99,
    dex: 82,
    luk: 107,
    str: 8,
    useCritical: true,
  });
  const [weapon, setWeapon] = useState<Weapon>({
    damageType: DamageType.PhysicalRanged,
    baseDamage: 65,
    level: 2,
    refineLevel: 6,
    element: PropertyElement.Neutral,
  });
  const [reductions, setReductions] = useState<Reductions>({
    def: {
      soft: 13,
      hard: 9,
    },
    atkMultiplier: {
      sizePenalty: 1,
      property: 1,
      race: 1,
      size: 1,
      targetProperty: 1,
    },
    property: {
      element: PropertyElement.Neutral,
      level: 1,
    },
  })
  const [bonusAtk, setBonusAtk] = useState<BonusAtk>({
    extraAtk: {
      pseudoBuff: 0,
      equip: 0,
      consumable: 0,
      ammunition: 25,
    },
    masteryAtk: 0,
    buffAtk: 0,
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
    ranged: 1,
    critical: 1.04,
  });
  const [finalReductions, setFinalReductions] = useState<FinalReductions>({
    finalDamage: 1,
    ranged: 1,
  });

  const {
    max: maxDmg,
    min: minDmg,
  } = useMemo(() => getDamage({
    atkMultipliers,
    bonusAtk,
    finalMultipliers,
    finalReductions,
    reductions,
    stats,
    weapon,
  }), [
    atkMultipliers,
    bonusAtk,
    finalMultipliers,
    finalReductions,
    reductions,
    stats,
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
        <WeaponInput
          onChange={setWeapon}
          weapon={weapon}
        />
        <BonusAtkInput
          bonusAtk={bonusAtk}
          onChange={setBonusAtk}
        />
        <AtkMultipliersInput
          atkMultipliers={atkMultipliers}
          onChange={setAtkMultipliers}
        />
        <FinalMultipliersInput
          finalMultipliers={finalMultipliers}
          onChange={setFinalMultipliers}
        />
        <ReductionsInput
          reductions={reductions}
          onChange={setReductions}
        />
        <FinalReductionsInput
          finalReductions={finalReductions}
          onChange={setFinalReductions}
        />

      </div>
      <div>Min dmg: {minDmg}</div>
      <div>Max dmg: {maxDmg}</div>
    </div>
  );
};