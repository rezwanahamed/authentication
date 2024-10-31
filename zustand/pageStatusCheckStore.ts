import { create } from 'zustand';

interface ObjectStore {
  data: Record<string, any>;
  setValue: (key: string, value: any) => void;
  getValue: (key: string) => any;
  appendData: (newData: Record<string, any>) => void;
  clearData: () => void;
}

const useObjectStore = create<ObjectStore>((set, get) => ({
  data: {},

  // Set value based on key
  setValue: (key: string, value: any) => {
    set((state) => ({
      data: { ...state.data, [key]: value },
    }));
  },

  // Get value based on key
  getValue: (key: string) => {
    return get().data[key];
  },

  // Append new data to the existing object
  appendData: (newData: Record<string, any>) => {
    set((state) => ({
      data: { ...state.data, ...newData },
    }));
  },

  // Clear the whole object
  clearData: () => {
    set({ data: {} });
  },
}));

export default useObjectStore;
