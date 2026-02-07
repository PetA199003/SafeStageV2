import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DISCLAIMER_KEY = 'safestage_disclaimer_accepted';

interface DisclaimerState {
  accepted: boolean;
  loaded: boolean;
  accept: () => Promise<void>;
  loadStatus: () => Promise<void>;
}

export const useDisclaimerStore = create<DisclaimerState>((set) => ({
  accepted: false,
  loaded: false,

  accept: async () => {
    await AsyncStorage.setItem(DISCLAIMER_KEY, 'true');
    set({ accepted: true });
  },

  loadStatus: async () => {
    const value = await AsyncStorage.getItem(DISCLAIMER_KEY);
    set({ accepted: value === 'true', loaded: true });
  },
}));
