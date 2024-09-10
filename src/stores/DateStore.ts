import { create } from "zustand";

interface IDateStore {
  date: Date;
  changeDate: (newDate: Date) => void;
  reload: boolean;
}

const useDateStore = create<IDateStore>((set, get) => ({
  date: new Date(),
  isChange: false,
  changeDate: (newDate) => {
    set((state) => ({ date: newDate, reload: !state.reload }));
  },
  reload: false,
}));

export default useDateStore;
