import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ExpenseType = "income" | "expense";

interface Expense {
  id: string;
  type: ExpenseType;
  amount: number;
  description: string;
  date: Date;
}

interface ExpenseStore {
  expenseData: Expense[];
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  updateExpense: (updatedExpense: Expense) => void;
  getStorageSize: () => Promise<string>; // function to get the current persisted storage size
  clearStorage: () => Promise<void>;
}
const STORAGE_KEY = "expense-storage";

const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenseData: [],
      addExpense: (expense: Expense) =>
        set((state) => ({ expenseData: [...state.expenseData, expense] })),
      removeExpense: (id: string) =>
        set((state) => ({
          expenseData: state.expenseData.filter((expense) => expense.id !== id),
        })),
      updateExpense: (updatedExpense: Expense) =>
        set((state) => ({
          expenseData: state.expenseData.map((expense) =>
            expense.id === updatedExpense.id ? updatedExpense : expense
          ),
        })),
      
       // function to get the current persisted storage size
       getStorageSize: async () => {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (!data) return "0 KB";

        const bytes = new Blob([data]).size;
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      },  
      clearStorage: async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        set({ expenseData: [] });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useExpenseStore;
