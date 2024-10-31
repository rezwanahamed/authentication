import { create } from "zustand";

interface IRegisterForm {
  id?: string;
  [key: string]: string | number | undefined;
}

interface IRegisterFormStore {
  formDataList: IRegisterForm[];
  mergedData: IRegisterForm;
  appendFormData: (data: IRegisterForm) => void;
  clearFormData: () => void;
}

const useRegisterFormStore = create<IRegisterFormStore>((set) => ({
  formDataList: [],
  mergedData: {},
  appendFormData: (data) =>
    set((state) => {
      const newFormDataList = [...state.formDataList, data];
      const newMergedData = { ...state.mergedData, ...data };
      console.warn("Updated formDataList:", newFormDataList);
      console.warn("Updated mergedData:", newMergedData);
      return { 
        formDataList: newFormDataList,
        mergedData: newMergedData
      };
    }),
  clearFormData: () => set({ formDataList: [], mergedData: {} }),
}));

export default useRegisterFormStore;