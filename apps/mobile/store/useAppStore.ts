import { create } from 'zustand';

interface AppState {
  selectedCantonCode: string | null;
  setSelectedCanton: (code: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCantonCode: null,
  setSelectedCanton: (code) => set({ selectedCantonCode: code }),
}));
