import { useState } from 'react';
import { useCacheStore } from '../store/useCacheStore';

export function useCacheState<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const cachedValue = useCacheStore((state) => state.cache[key]);
  const setCache = useCacheStore((state) => state.setCache);
  
  const [value, setValue] = useState<T>(cachedValue !== undefined ? cachedValue : initialValue);

  const setValueAndCache = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const updated = typeof newValue === 'function' ? (newValue as Function)(prev) : newValue;
      setCache(key, updated);
      return updated;
    });
  };

  return [value, setValueAndCache];
}
