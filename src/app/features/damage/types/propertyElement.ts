export enum PropertyElement {
  Neutral = 'Neutral',
  Water = 'Water',
  Earth = 'Earth',
  Fire = 'Fire',
  Wind = 'Wind',
  Poison = 'Poison',
  Holy = 'Holy',
  Shadow = 'Shadow',
  Ghost = 'Ghost',
  Undead = 'Undead',
}

export type ElementLevelTable = Record<PropertyElement, Record<PropertyElement, number>>;