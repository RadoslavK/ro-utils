import { useEffect, useRef } from 'react';

export const usePrevious = <T>(prop: T): T => {
  const previous = useRef(prop);

  useEffect(() => {
    previous.current = prop;
  });

  return previous.current;
};