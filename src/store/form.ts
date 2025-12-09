import { create } from "zustand";

interface FormStore {
  isFormOpen: boolean;
  openForm: () => void;
  closeForm: () => void;
}

const useFormStore = create<FormStore>((set) => ({
  isFormOpen: false,
  openForm: () => set({ isFormOpen: true }),
  closeForm: () => set({ isFormOpen: false })
}));

export default useFormStore;
