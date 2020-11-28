import React from 'react';
import { AspdPage } from '../../aspd/components/AspdPage';
import { DamagePage } from '../../damage/component/DamagePage';
import { MainRefinePage } from '../../refine/MainRefinePage';

type Route = {
  readonly path: string;
  readonly component: React.ComponentType;
  readonly label: string;
};

export const routes: readonly Route[] = [
  { path: 'refine', component: MainRefinePage, label: 'Refine' },
  { path: 'aspd', component: AspdPage, label: 'ASPD' },
  { path: 'dmg', component: DamagePage, label: 'Damage' },
];