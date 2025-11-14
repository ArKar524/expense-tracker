export interface User {
  id: number;
  name: string;
  email: string | null;
  password: string;
  created_at: string;
  updated_at: string;
}

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

export type TransactionType = 'income' | 'expense';

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

export interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  user_id: number | null;
  content: any;
  tag_id: number[] | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
