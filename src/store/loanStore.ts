import { create } from "zustand";

interface LoanStoreState {
  totals: Record<string, number>;
  setTotal: (key: string, value: number) => void;
  getTotal: (key: string) => number;
}

export const useLoanStore = create<LoanStoreState>((set, get) => ({
  totals: {},
  setTotal: (key, value) =>
    set((state) => ({
      totals: {
        ...state.totals,
        [key]: value,
      },
    })),
  getTotal: (key) => get().totals[key] || 0,
}));
