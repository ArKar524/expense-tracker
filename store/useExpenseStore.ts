import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  user_id: number | null;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: number;
  user_id: number | null;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  user_id: number | null;
  category_id: number;
  account_id: number;
  type: TransactionType;
  amount: number;
  is_recursive: boolean;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  user_id: number | null;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ExpenseStore {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  notes: Note[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => void;
  removeTransaction: (id: number) => void;
  updateTransaction: (updatedTransaction: Transaction) => void;
  addCategory: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => void;
  removeCategory: (id: number) => void;
  updateCategory: (updatedCategory: Category) => void;
  addAccount: (account: Omit<Account, 'id' | 'created_at' | 'updated_at'>) => void;
  removeAccount: (id: number) => void;
  updateAccount: (updatedAccount: Account) => void;
  addNote: (note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => void;
  removeNote: (id: number) => void;
  updateNote: (updatedNote: Note) => void;
  getStorageSize: () => Promise<string>;
  clearStorage: () => Promise<void>;
}

const STORAGE_KEY = "finance-storage";

const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: [],
      accounts: [],
      notes: [],
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ transactions: [...state.transactions, newTransaction] }));
      },
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      updateTransaction: (updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === updatedTransaction.id ? { ...updatedTransaction, updated_at: new Date().toISOString() } : t
          ),
        })),
      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },
      removeCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        })),
      updateCategory: (updatedCategory) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === updatedCategory.id ? { ...updatedCategory, updated_at: new Date().toISOString() } : c
          ),
        })),
      addAccount: (account) => {
        const newAccount: Account = {
          ...account,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ accounts: [...state.accounts, newAccount] }));
      },
      removeAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),
      updateAccount: (updatedAccount) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === updatedAccount.id ? { ...updatedAccount, updated_at: new Date().toISOString() } : a
          ),
        })),
      addNote: (note) => {
        const newNote: Note = {
          ...note,
          id: Date.now(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
      },
      removeNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        })),
      updateNote: (updatedNote) =>
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === updatedNote.id ? { ...updatedNote, updated_at: new Date().toISOString() } : n
          ),
        })),
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
        set({ transactions: [], categories: [], accounts: [], notes: [] });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useExpenseStore;
