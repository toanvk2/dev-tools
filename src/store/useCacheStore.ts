import { create } from 'zustand';

interface CacheState {
  cache: Record<string, any>;
  setCache: (key: string, value: any) => void;
}

export const useCacheStore = create<CacheState>()((set) => ({
  cache: {},
  setCache: (key, value) => set((state) => ({
    cache: { ...state.cache, [key]: value }
  }))
}));
