import { useMemo } from 'react';
import { getTransactions, getAccounts, getCategories } from '../lib/storage';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Transaction } from '../types';

export function Dashboard() {
  const transactions = getTransactions();
  const accounts = getAccounts();
  const categories = getCategories();

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;

    return { income, expense, balance };
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [transactions]);

  const getCategoryName = (id: number) => {
    return categories.find(c => c.id === id)?.name || 'Unknown';
  };

  const getAccountName = (id: number) => {
    return accounts.find(a => a.id === id)?.name || 'Unknown';
  };

  return (
    <div className="p-4 pb-20">
      {/* Balance Cards */}
      <div className="space-y-3 mb-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-6 text-white">
          <p className="text-sm text-gray-300 mb-1">Total Balance</p>
          <p className="text-3xl mb-4">${stats.balance.toLocaleString()}</p>
          <div className="flex gap-4">
            <div>
              <p className="text-xs text-gray-400">Income</p>
              <p className="text-green-400">${stats.income.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Expense</p>
              <p className="text-red-400">${stats.expense.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs text-green-700">Income</span>
            </div>
            <p className="text-xl text-green-900">${stats.income.toLocaleString()}</p>
          </div>

          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-xs text-red-700">Expense</span>
            </div>
            <p className="text-xl text-red-900">${stats.expense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Accounts Summary */}
      <div className="mb-6">
        <h2 className="mb-3">Accounts</h2>
        {accounts.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Wallet className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No accounts yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {accounts.map(account => (
              <div
                key={account.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm">{account.name}</p>
                    {account.description && (
                      <p className="text-xs text-gray-500">{account.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="mb-3">Recent Transactions</h2>
        {recentTransactions.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-sm text-gray-600">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTransactions.map(transaction => (
              <div
                key={transaction.id}
                className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{getCategoryName(transaction.category_id)}</p>
                    <p className="text-xs text-gray-500">{getAccountName(transaction.account_id)}</p>
                  </div>
                </div>
                <p className={`${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
