import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

export default function AccountsScreen() {
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];

  const accounts = useExpenseStore((state) => state.accounts);
  const addAccount = useExpenseStore((state) => state.addAccount);
  const removeAccount = useExpenseStore((state) => state.removeAccount);
  const updateAccount = useExpenseStore((state) => state.updateAccount);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<typeof accounts[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an account name');
      return;
    }

    if (editingAccount) {
      updateAccount({
        ...editingAccount,
        name: formData.name,
        description: formData.description,
      });
    } else {
      addAccount({
        user_id: null,
        name: formData.name,
        description: formData.description,
      });
    }

    setShowAddModal(false);
    setEditingAccount(null);
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (account: typeof accounts[0]) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      description: account.description || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeAccount(id) },
      ]
    );
  };

  const openAddModal = () => {
    setEditingAccount(null);
    setFormData({ name: '', description: '' });
    setShowAddModal(true);
  };

  return (
    <Container>
      <ThemedView style={{}}>
        <FlatList
          data={accounts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ThemedView style={styles.accountItem}>
              <ThemedView style={styles.accountIcon}>
                <Ionicons name="wallet" size={20} color="#3b82f6" />
              </ThemedView>
              <ThemedView style={styles.accountInfo}>
                <ThemedText style={styles.accountName}>{item.name}</ThemedText>
                {item.description && (
                  <ThemedText style={styles.accountDesc}>{item.description}</ThemedText>
                )}
              </ThemedView>
              <ThemedView style={styles.accountActions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                  <Ionicons name="pencil" size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                  <Ionicons name="trash" size={16} color="#ef4444" />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          )}
          ListEmptyComponent={
            <ThemedView style={styles.emptyState}>
              <Ionicons name="wallet" size={48} color={color.icon} />
              <ThemedText style={styles.emptyText}>No accounts yet</ThemedText>
              <TouchableOpacity onPress={openAddModal} style={styles.addFirstButton}>
                <ThemedText style={styles.addFirstText}>Add First Account</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          }
          contentContainerStyle={styles.listContent}
        />

        {/* Add/Edit Button */}
        {accounts.length > 0 && (
          <TouchableOpacity onPress={openAddModal} style={styles.addButton}>
            <Ionicons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
        )}

        {/* Add/Edit Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent>
          <ThemedView style={styles.modalOverlay}>
            <ThemedView style={styles.modalContent}>
              <ThemedView style={styles.modalHandle} />
              <ThemedText style={styles.modalTitle}>
                {editingAccount ? 'Edit Account' : 'Add Account'}
              </ThemedText>
              
              <TextInput
                style={styles.input}
                placeholder="Account Name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={styles.input}
                placeholder="Description (optional)"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
              />

              <ThemedView style={styles.modalActions}>
                <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.cancelButton}>
                  <ThemedText style={styles.cancelText}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                  <ThemedText style={styles.submitText}>
                    {editingAccount ? 'Update' : 'Add'}
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </Modal>
      </ThemedView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  accountIcon: {
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
  },
  accountDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  accountActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  addFirstButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1f2937',
    borderRadius: 12,
  },
  addFirstText: {
    color: '#ffffff',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#1f2937',
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
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#374151',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 12,
  },
  submitText: {
    fontSize: 16,
    color: '#ffffff',
  },
});
