import { useState, useMemo } from 'react';
import { getTransactions, getAccounts, getCategories, addTransaction, deleteTransaction } from '../lib/storage';
import { Plus, TrendingUp, TrendingDown, Trash2, Filter } from 'lucide-react';
import { TransactionType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export function Transactions() {
  const [transactions, setTransactions] = useState(getTransactions());
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const accounts = getAccounts();
  const categories = getCategories();

  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category_id: '',
    account_id: '',
    is_recursive: false,
  });

  const filteredTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    if (filter === 'all') return sorted;
    return sorted.filter(t => t.type === filter);
  }, [transactions, filter]);

  const getCategoryName = (id: number) => {
    return categories.find(c => c.id === id)?.name || 'Unknown';
  };

  const getAccountName = (id: number) => {
    return accounts.find(a => a.id === id)?.name || 'Unknown';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category_id || !formData.account_id) {
      alert('Please fill all fields');
      return;
    }

    addTransaction({
      user_id: null,
      type: formData.type,
      amount: parseFloat(formData.amount),
      category_id: parseInt(formData.category_id),
      account_id: parseInt(formData.account_id),
      is_recursive: formData.is_recursive,
    });

    setTransactions(getTransactions());
    setShowAddModal(false);
    setFormData({
      type: 'expense',
      amount: '',
      category_id: '',
      account_id: '',
      is_recursive: false,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this transaction?')) {
      deleteTransaction(id);
      setTransactions(getTransactions());
    }
  };

  return (
    <div className="p-4 pb-20">
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 bg-gray-100 rounded-xl p-1">
        {(['all', 'income', 'expense'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-lg text-sm transition-all ${
              filter === f
                ? 'bg-white shadow-sm'
                : 'text-gray-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-2 mb-20">
        {filteredTransactions.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <Filter className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No transactions found</p>
          </div>
        ) : (
          filteredTransactions.map(transaction => (
            <div
              key={transaction.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{getCategoryName(transaction.category_id)}</p>
                  <p className="text-xs text-gray-500">{getAccountName(transaction.account_id)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                </p>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
              <h2 className="mb-6">Add Transaction</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Toggle */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Type</label>
                  <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'expense' })}
                      className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                        formData.type === 'expense'
                          ? 'bg-white shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'income' })}
                      className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                        formData.type === 'income'
                          ? 'bg-white shadow-sm'
                          : 'text-gray-600'
                      }`}
                    >
                      Income
                    </button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Account */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Account</label>
                  <select
                    value={formData.account_id}
                    onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">Select account</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                </div>

                {/* Recursive */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_recursive}
                    onChange={(e) => setFormData({ ...formData, is_recursive: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="text-sm">Recurring transaction</span>
                </label>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
