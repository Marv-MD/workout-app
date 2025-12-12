import React, { createContext, useContext, useMemo } from 'react';
import { create } from 'zustand';
import type { ReactNode } from 'react';
import type { LoggingType, WeightUnit } from '../../shared/src/types';

export type SettingsState = {
  unit: WeightUnit;
  restByType: Record<LoggingType, number>;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  setUnit: (unit: WeightUnit) => void;
  setRest: (type: LoggingType, seconds: number) => void;
  toggleSound: () => void;
  toggleVibration: () => void;
};

const useSettingsStore = create<SettingsState>((set) => ({
  unit: 'kg',
  restByType: {
    REPS_WEIGHT: 180,
    DURATION_WEIGHT: 90,
    BW_REPS: 120
  },
  soundEnabled: true,
  vibrationEnabled: true,
  setUnit: (unit) => set({ unit }),
  setRest: (type, seconds) => set((state) => ({ restByType: { ...state.restByType, [type]: seconds } })),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  toggleVibration: () => set((s) => ({ vibrationEnabled: !s.vibrationEnabled }))
}));

const SettingsContext = createContext<typeof useSettingsStore | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const store = useMemo(() => useSettingsStore, []);
  return <SettingsContext.Provider value={store}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx();
};
