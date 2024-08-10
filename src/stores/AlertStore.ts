import { create } from "zustand";

interface IAlert {
  isOpen: boolean;
  toggleAlert: (flag: boolean) => void;
  toastOpen: boolean;
  toggleToastOpen: () => void;
}

const useAlertStore = create<IAlert>((set) => ({
  isOpen: false,
  toastOpen: false,
  toggleAlert: (flag) => {
    set({ isOpen: flag });
  },
  toggleToastOpen: () => {
    set({ toastOpen: true });
    setTimeout(() => {
      set({ toastOpen: false });
    }, 3000);
  },
}));

export default useAlertStore;
