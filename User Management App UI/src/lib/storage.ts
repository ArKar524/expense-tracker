import { User, Category, Account, Transaction, Note, Tag } from '../types';

const STORAGE_KEYS = {
  USER: 'finance_user',
  CATEGORIES: 'finance_categories',
  ACCOUNTS: 'finance_accounts',
  TRANSACTIONS: 'finance_transactions',
  NOTES: 'finance_notes',
  TAGS: 'finance_tags',
  IS_GUEST: 'finance_is_guest',
};

// User management
export const getUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const setUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const isGuestMode = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.IS_GUEST) === 'true';
};

export const setGuestMode = (isGuest: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.IS_GUEST, String(isGuest));
};

// Categories
export const getCategories = (): Category[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : [];
};

export const setCategories = (categories: Category[]): void => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const addCategory = (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Category => {
  const categories = getCategories();
  const newCategory: Category = {
    ...category,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  setCategories([...categories, newCategory]);
  return newCategory;
};

export const deleteCategory = (id: number): void => {
  const categories = getCategories().filter(c => c.id !== id);
  setCategories(categories);
};

// Accounts
export const getAccounts = (): Account[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  return data ? JSON.parse(data) : [];
};

export const setAccounts = (accounts: Account[]): void => {
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
};

export const addAccount = (account: Omit<Account, 'id' | 'created_at' | 'updated_at'>): Account => {
  const accounts = getAccounts();
  const newAccount: Account = {
    ...account,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  setAccounts([...accounts, newAccount]);
  return newAccount;
};

export const deleteAccount = (id: number): void => {
  const accounts = getAccounts().filter(a => a.id !== id);
  setAccounts(accounts);
};

// Transactions
export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const setTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const addTransaction = (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Transaction => {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  setTransactions([...transactions, newTransaction]);
  return newTransaction;
};

export const deleteTransaction = (id: number): void => {
  const transactions = getTransactions().filter(t => t.id !== id);
  setTransactions(transactions);
};

// Notes
export const getNotes = (): Note[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTES);
  const notes = data ? JSON.parse(data) : [];
  return notes.filter((n: Note) => !n.deleted_at);
};

export const setNotes = (notes: Note[]): void => {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
};

export const addNote = (note: Omit<Note, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Note => {
  const notes = getNotes();
  const newNote: Note = {
    ...note,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };
  setNotes([...notes, newNote]);
  return newNote;
};

// Tags
export const getTags = (): Tag[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TAGS);
  return data ? JSON.parse(data) : [];
};

export const setTags = (tags: Tag[]): void => {
  localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
};

// Initialize with sample data
export const initializeSampleData = (): void => {
  if (getCategories().length === 0) {
    setCategories([
      {
        id: 1,
        user_id: null,
        name: 'Food & Dining',
        description: 'Meals, groceries, restaurants',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        user_id: null,
        name: 'Transportation',
        description: 'Gas, public transit, parking',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        user_id: null,
        name: 'Salary',
        description: 'Monthly income',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  }

  if (getAccounts().length === 0) {
    setAccounts([
      {
        id: 1,
        user_id: null,
        name: 'Cash',
        description: 'Physical cash',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        user_id: null,
        name: 'Bank Account',
        description: 'Main checking account',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  }
};
