import Container from '@/components/container';
import CustomHeader from '@/components/CustomHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function TransactionsScreen() {
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];

  const transactions = useExpenseStore((state) => state.transactions);
  const categories = useExpenseStore((state) => state.categories);
  const accounts = useExpenseStore((state) => state.accounts);
  const addTransaction = useExpenseStore((state) => state.addTransaction);
  const removeTransaction = useExpenseStore((state) => state.removeTransaction);
  const updateTransaction = useExpenseStore((state) => state.updateTransaction);

  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<typeof transactions[0] | null>(null);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
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

  const handleSubmit = () => {
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || !formData.category_id || !formData.account_id) {
      Alert.alert('Error', 'Please fill all fields with valid data');
      return;
    }

    if (editingTransaction) {
      updateTransaction({
        ...editingTransaction,
        type: formData.type,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
        account_id: parseInt(formData.account_id),
        is_recursive: formData.is_recursive,
      });
    } else {
      addTransaction({
        user_id: null,
        type: formData.type,
        amount: parseFloat(formData.amount),
        category_id: parseInt(formData.category_id),
        account_id: parseInt(formData.account_id),
        is_recursive: formData.is_recursive,
      });
    }

    setShowAddModal(false);
    setEditingTransaction(null);
    setFormData({
      type: 'expense',
      amount: '',
      category_id: '',
      account_id: '',
      is_recursive: false,
    });
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeTransaction(id) },
      ]
    );
  };

  const handleEdit = (transaction: typeof transactions[0]) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category_id: transaction.category_id.toString(),
      account_id: transaction.account_id.toString(),
      is_recursive: transaction.is_recursive,
    });
    setShowAddModal(true);
  };

  return (
    <Container>
      <CustomHeader title="Transactions" />
      <View>
        {/* Filter Tabs */}
        <ThemedView style={styles.filterTabs}>
          {(['all', 'income', 'expense'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.tab, filter === f && [styles.activeTab, { backgroundColor: color.card.background }]]}
            >
              <ThemedText style={[styles.tabText, filter === f && styles.activeTabText]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Transactions List */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ThemedView style={styles.transactionItem}>
              <ThemedView style={[styles.transactionIcon, item.type === 'income' ? styles.incomeBg : styles.expenseBg]}>
                {item.type === 'income' ? (
                  <Ionicons name="trending-up" size={20} color="#10b981" />
                ) : (
                  <Ionicons name="trending-down" size={20} color="#ef4444" />
                )}
              </ThemedView>
              <ThemedView style={styles.transactionInfo}>
                <ThemedText style={styles.transactionCategory}>{getCategoryName(item.category_id)}</ThemedText>
                <ThemedText style={styles.transactionAccount}>{getAccountName(item.account_id)}</ThemedText>
                <ThemedText style={styles.transactionDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.transactionActions}>
                <ThemedText style={[styles.transactionAmount, item.type === 'income' ? styles.incomeText : styles.expenseText]}>
                  {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                </ThemedText>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                  <Ionicons name="pencil" size={16} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Ionicons name="trash" size={16} color="#ef4444" />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="list" size={48} color={color.icon} />
              <ThemedText style={styles.emptyText}>No transactions found</ThemedText>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />

        {/* Add Button */}
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={[styles.addButton, { backgroundColor: color.button.backgroundColor }]}>
          <Ionicons name="add" size={24} color={color.button.textColor} />
        </TouchableOpacity>

        {/* Add Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowAddModal(false)} activeOpacity={1}>
            <ThemedView style={styles.modalContent}>
              <TouchableOpacity onPress={() => {}} activeOpacity={1} style={{flex:1}}>
                <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
                  <ThemedView style={styles.modalHandle} />
                  <ThemedText style={styles.modalTitle}>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</ThemedText>
                  
                  <ThemedView style={styles.typeToggle}>
                    <TouchableOpacity
                      onPress={() => setFormData({ ...formData, type: 'expense' })}
                      style={[styles.typeButton, formData.type === 'expense' && [styles.activeType, { backgroundColor: color.card.background }]]}
                    >
                      <ThemedText style={[styles.typeText, formData.type === 'expense' && styles.activeTypeText]}>Expense</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setFormData({ ...formData, type: 'income' })}
                      style={[styles.typeButton, formData.type === 'income' && [styles.activeType, { backgroundColor: color.card.background }]]}
                    >
                      <ThemedText style={[styles.typeText, formData.type === 'income' && styles.activeTypeText]}>Income</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>

                  <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    value={formData.amount}
                    onChangeText={(text) => setFormData({ ...formData, amount: text })}
                    keyboardType="numeric"
                    placeholderTextColor="#9ca3af"
                  />

                  <Picker
                    selectedValue={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    style={[styles.picker, { backgroundColor: color.card.background }]}
                  >
                    <Picker.Item label="Select Category" value="" />
                    {categories.map((cat) => (
                      <Picker.Item key={cat.id} label={cat.name} value={cat.id.toString()} />
                    ))}
                  </Picker>

                  <Picker
                    selectedValue={formData.account_id}
                    onValueChange={(value) => setFormData({ ...formData, account_id: value })}
                    style={[styles.picker, { backgroundColor: color.card.background }]}
                  >
                    <Picker.Item label="Select Account" value="" />
                    {accounts.map((acc) => (
                      <Picker.Item key={acc.id} label={acc.name} value={acc.id.toString()} />
                    ))}
                  </Picker>
                </ScrollView>

                {editingTransaction ? (
                  <ThemedView style={styles.modalActions}>
                    <TouchableOpacity onPress={() => handleDelete(editingTransaction.id)} style={styles.deleteModalButton}>
                      <ThemedText style={styles.deleteModalText}>Delete</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.cancelButton}>
                      <ThemedText style={styles.cancelText}>Cancel</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit} style={[styles.submitButton, { backgroundColor: color.button.backgroundColor }]}>
                      <ThemedText style={[styles.submitText]}>Update</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                ) : (
                  <ThemedView style={styles.modalActions}>
                    <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.cancelButton}>
                      <ThemedText style={styles.cancelText}>Cancel</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit} style={[styles.submitButton, { backgroundColor: color.button.backgroundColor }]}>
                      <ThemedText style={[styles.submitText]}>Add</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                )}
              </TouchableOpacity>
            </ThemedView>
          </TouchableOpacity>
        </Modal>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 4,
    margin: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionIcon: {
    marginRight: 12,
    borderRadius: 8,
    padding: 8,
  },
  incomeBg: {
    backgroundColor: '#f0fdf4',
  },
  expenseBg: {
    backgroundColor: '#fef2f2',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionAccount: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  transactionActions: {
    alignItems: 'center',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  incomeText: {
    color: '#10b981',
  },
  expenseText: {
    color: '#ef4444',
  },
  deleteButton: {
    padding: 4,
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
    maxHeight: '90%',
    minHeight: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeType: {
  },
  typeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTypeText: {
    color: '#000000',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#0f172a',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  submitText: {
    fontSize: 16,
  },
  deleteModalButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 12,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
});
