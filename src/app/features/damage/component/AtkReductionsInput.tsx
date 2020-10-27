import React from 'react';
import { AtkReductions } from '../types/atkReductions.type';

type Props = {
  readonly atkReductions: AtkReductions;
  readonly onChange: (atkReductions: AtkReductions) => void;
};

export const AtkReductionsInput: React.FC<Props> = ({ atkReductions, onChange }) => {
  return null;
};