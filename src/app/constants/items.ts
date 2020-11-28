import { Item } from '../features/refine/common/types/item.type';
import { refineItemIds } from '../features/refine/common/constants/refineItemIds';

export const items: Map<number, Item> = new Map<number, Item>([
  [refineItemIds.Oridecon, {
    id: refineItemIds.Oridecon,
    name: 'Oridecon',
  }],
  [refineItemIds.Elunium, {
    id: refineItemIds.Elunium,
    name: 'Elunium',
  }],
  [refineItemIds.Phracon, {
    id: refineItemIds.Phracon,
    name: 'Phracon',
  }],
  [refineItemIds.Emveretarcon, {
    id: refineItemIds.Emveretarcon,
    name: 'Emveretarcon',
  }],
  [refineItemIds.HDOridecon, {
    id: refineItemIds.HDOridecon,
    name: 'HD Oridecon',
  }],
  [refineItemIds.HDElunium, {
    id: refineItemIds.HDElunium,
    name: 'HD Elunium',
  }],
  [refineItemIds.EnrichedElunium, {
    id: refineItemIds.EnrichedElunium,
    name: 'Enriched Elunium',
  }],
  [refineItemIds.EnrichedOridecon, {
    id: refineItemIds.EnrichedOridecon,
    name: 'Enriched Oridecon',
  }],
  [refineItemIds.BlacksmithBlessing, {
    id: refineItemIds.BlacksmithBlessing,
    name: 'Blacksmith Blessing',
  }],
  [refineItemIds.RandomRefineBox, {
    id: refineItemIds.RandomRefineBox,
    name: 'Random Refine Box',
  }],
]);