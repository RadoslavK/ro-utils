import React from 'react';
import { AtkReductionMultiplier } from '../types/atkReductions.type';

type Props = {
  readonly atkReductions: AtkReductionMultiplier;
  readonly onChange: (atkReductions: AtkReductionMultiplier) => void;
};

export const AtkReductionMultipliersInput: React.FC<Props> = ({ atkReductions, onChange }) => {
  return null;
};