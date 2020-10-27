import React, { useMemo, useState } from 'react';
import { StatsInput } from './StatsInput';
import { Stats } from '../types/stats.type';
import { getDamage } from '../utils/getDamage';
import { Def } from '../types/def.type';
import { DefInput } from './DefInput';
import { NumberInput } from '../../../components/NumberInput';
import { DropDown } from '../../../components/DropDown';
import { DamageType } from '../types/damageType';
import { BonusAtk } from '../types/bonusAtk.type';
import { BonusAtkInput } from './BonusAtkInput';
import { AtkMultipliers } from '../types/atkMultipliers.type';
import { AtkReductions } from '../types/atkReductions.type';
import { AtkMultipliersInput } from './AtkMultipliersInput';
import { AtkReductionsInput } from './AtkReductionsInput';
import { CheckBox } from '../../../components/CheckBox';
import { css } from '@emotion/core';

export const DamagePage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    baseLevel: 99,
    dex: 82,
    luk: 107,
    str: 8,
  });
  const [def, setDef] = useState<Def>({
    soft: 13,
    hard: 9,
  });
  const [baseWeaponDamage, setBaseWeaponDamage] = useState(65);
  const [weaponLevel, setWeaponLevel] = useState(2);
  const [refineLevel, setRefineLevel] = useState(6);
  const [damageType, setDamageType] = useState<DamageType>(DamageType.PhysicalRanged);
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
    property: 1,
    race: 1,
    size: 1,
    targetProperty: 1,
  });
  const [atkReductions, setAtkReductions] = useState<AtkReductions>({
    sizePenalty: 1,
    property: 1,
    race: 1,
    size: 1,
    targetProperty: 1,
  });
  const [damageMultiplier, setDamageMultiplier] = useState(1);
  const [finalDamageMultiplier, setFinalDamageMultiplier] = useState(1);
  const [finalDamageReduction, setFinalDamageReduction] = useState(1);
  const [rangedMultiplier, setRangedMultiplier] = useState(1);
  const [rangedReduction, setRangedReduction] = useState(1);
  const [criticalMultiplier, setCriticalMultiplier] = useState(1.04);
  const [useCritical, setUseCritical] = useState(true);

  const {
    max: maxDmg,
    min: minDmg,
  } = useMemo(() => getDamage({
    atkMultipliers,
    atkReductions,
    baseWeaponDamage,
    bonusAtk,
    criticalMultiplier,
    damageMultiplier,
    damageType,
    def,
    finalDamageMultiplier,
    finalDamageReduction,
    rangedMultiplier,
    rangedReduction,
    refineLevel,
    stats,
    useCritical,
    weaponLevel,
  }), [
    atkMultipliers,
    atkReductions,
    baseWeaponDamage,
    bonusAtk,
    criticalMultiplier,
    damageMultiplier,
    damageType,
    def,
    finalDamageMultiplier,
    finalDamageReduction,
    rangedMultiplier,
    rangedReduction,
    refineLevel,
    stats,
    useCritical,
    weaponLevel,
  ]);

  return (
    <div css={css`
      max-height: 100vh;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-content: flex-start;
      
      > * {
        margin-right: 64px;
      }
    `}>
      <StatsInput
        onChange={setStats}
        stats={stats}
      />
      <DefInput
        def={def}
        onChange={setDef}
      />
      <NumberInput
        label="Refine level"
        value={refineLevel}
        onChange={setRefineLevel}
        minValue={0}
        maxValue={10}
      />
      <NumberInput
        label="Weapon level"
        value={weaponLevel}
        onChange={setWeaponLevel}
        minValue={1}
        maxValue={4}
      />
      <NumberInput
        label="Weapon Damage"
        value={baseWeaponDamage}
        onChange={setBaseWeaponDamage}
        minValue={0}
      />
      <DropDown<DamageType>
        selectedValue={damageType}
        values={Object.values(DamageType)}
        onChange={setDamageType}
        getId={type => type}
        getName={type => type}
        label="Damage Type"
      />
      <BonusAtkInput
        bonusAtk={bonusAtk}
        onChange={setBonusAtk}
      />
      <AtkMultipliersInput
        atkMultipliers={atkMultipliers}
        onChange={setAtkMultipliers}
      />
      <AtkReductionsInput
        atkReductions={atkReductions}
        onChange={setAtkReductions}
      />
      <NumberInput
        label="Damage Multiplier"
        value={damageMultiplier}
        onChange={setDamageMultiplier}
        minValue={0}
      />
      <NumberInput
        label="Final Damage multiplier"
        value={finalDamageMultiplier}
        onChange={setFinalDamageMultiplier}
        minValue={0}
      />
      <NumberInput
        label="Final Damage Reduction"
        value={finalDamageReduction}
        onChange={setFinalDamageReduction}
        minValue={0}
      />
      <NumberInput
        label="Ranged Multiplier"
        value={rangedMultiplier}
        onChange={setRangedMultiplier}
        minValue={0}
      />
      <NumberInput
        label="Ranged Reduction"
        value={rangedReduction}
        onChange={setRangedReduction}
        minValue={0}
      />
      <NumberInput
        label="Critical Multiplier"
        value={criticalMultiplier}
        onChange={setCriticalMultiplier}
        minValue={0}
      />
      <CheckBox
        label="Use Critical"
        isChecked={useCritical}
        onChange={setUseCritical}
      />

      <div>Min dmg: {minDmg}</div>
      <div>Max dmg: {maxDmg}</div>
    </div>
  );
};