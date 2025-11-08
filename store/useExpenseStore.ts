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
}

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
    }),
    {
      name: "expense-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useExpenseStore;
