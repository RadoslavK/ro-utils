import React from 'react';
import { RefinePage } from '../../refine/components/RefinePage';

type Route = {
  readonly path: string;
  readonly component: React.ComponentType;
  readonly label: string;
};

export const routes: readonly Route[] = [
  { path: 'refine', component: RefinePage, label: 'Refining' },
];