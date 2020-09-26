import React from 'react';
import { Prices } from './Prices';
import { RefineCalculatorInput } from './RefineCalculatorInput';

export const RefinePage: React.FC = () => {
  return (
    <div>
      <Prices />
      <RefineCalculatorInput />
    </div>
  );
};