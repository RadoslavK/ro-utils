import React from 'react';
import { AtkMultipliers } from '../types/atkMultipliers.type';

type Props = {
  readonly atkMultipliers: AtkMultipliers;
  readonly onChange: (atkMultipliers: AtkMultipliers) => void;
};

export const AtkMultipliersInput: React.FC<Props> = ({ atkMultipliers, onChange }) => {
  return null;
};