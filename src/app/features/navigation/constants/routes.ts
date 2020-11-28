import React from 'react';
import { AspdPage } from '../../aspd/components/AspdPage';
import { DamagePage } from '../../damage/component/DamagePage';
import { RefinePage } from '../../refine/components/RefinePage';

type Route = {
  readonly path: string;
  readonly component: React.ComponentType;
  readonly label: string;
};

export const routes: readonly Route[] = [
  { path: 'refine', component: RefinePage, label: 'Refine' },
  { path: 'aspd', component: AspdPage, label: 'ASPD' },
  { path: 'dmg', component: DamagePage, label: 'Damage' },
];