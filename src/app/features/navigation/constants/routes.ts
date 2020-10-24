import React from 'react';
import { RefinePage } from '../../refine/components/RefinePage';
import { AspdPage } from '../../aspd/components/AspdPage';

type Route = {
  readonly path: string;
  readonly component: React.ComponentType;
  readonly label: string;
};

export const routes: readonly Route[] = [
  { path: 'refine', component: RefinePage, label: 'Refining' },
  { path: 'aspd', component: AspdPage, label: 'ASPD' },
];