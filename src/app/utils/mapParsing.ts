export const serializeMap = <TKey, TValue>(map: Map<TKey, TValue>): string => {
  return JSON.stringify(Array.from(map.entries()));
};

export const deserializeMap = <TKey, TValue>(rawMap: string): Map<TKey, TValue> => {
  return new Map<TKey, TValue>(JSON.parse(rawMap));
};