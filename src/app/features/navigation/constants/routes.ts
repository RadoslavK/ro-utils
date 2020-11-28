import React from 'react';
import { RefinePage } from '../../refine/v1/components/RefinePage';
import { AspdPage } from '../../aspd/components/AspdPage';
import { DamagePage } from '../../damage/component/DamagePage';

type Route = {
  readonly path: string;
  readonly component: React.ComponentType;
  readonly label: string;
};

export const routes: readonly Route[] = [
  { path: 'refine', component: RefinePage, label: 'Refining' },
  { path: 'aspd', component: AspdPage, label: 'ASPD' },
  { path: 'dmg', component: DamagePage, label: 'Damage' },
];