import React from 'react';
import { Damage } from '../types/damage.type';

type Props = {
  readonly damage: Damage;
};

export const DamageCalculationResult: React.FC<Props> = (props) => {
  const { damage } = props;

  return (
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
  );
};

DamageCalculationResult.displayName = 'DamageCalculationResult';