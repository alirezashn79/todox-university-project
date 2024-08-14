import { create } from "zustand";

interface IDateStore {
  date: Date;
  changeDate: (newDate: Date) => void;
  reload: boolean;
  setReload: () => void;
}

const useDateStore = create<IDateStore>((set) => ({
  date: new Date(),
  isChange: false,
  changeDate: (newDate) => {
    set({ date: newDate });
  },
  reload: false,
  setReload: () => {
    set((state) => ({ reload: !state.reload }));
  },
}));

export default useDateStore;
