import { useEffect, useRef } from 'react';

export const usePrevious = <T>(prop: T): T => {
  const previous = useRef(prop);

  useEffect(() => {
    previous.current = prop;
  });

  return previous.current;
};

export const usePreviousWithoutInitial = <T>(prop: T): T | undefined => {
  const previous = useRef<T | undefined>(undefined);

  useEffect(() => {
    previous.current = prop;
  });

  return previous.current;
}