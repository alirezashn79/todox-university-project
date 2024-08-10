import { create } from "zustand";

interface IDateStore {
  date: Date;
  changeDate: (newDate: Date) => void;
}

const useDateStore = create<IDateStore>((set) => ({
  date: new Date(new Date().toLocaleDateString()),
  changeDate: (newDate) => {
    set({ date: newDate });
  },
}));

export default useDateStore;
