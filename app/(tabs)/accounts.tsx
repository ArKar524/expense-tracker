import Container from '@/components/container';
import CustomHeader from '@/components/CustomHeader';
import ItemSeparator from '@/components/ItemSeparator';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

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
        { text: 'Delete', style: 'destructive', onPress: () => { removeAccount(id); setShowAddModal(false); } },
      ]
    );
  };

  const openAddModal = () => {
    setEditingAccount(null);
    setFormData({ name: '', description: '' });
    setShowAddModal(true);
  };

  const accountItemStyle = {
    ...styles.accountItem,
  };

  return (
    <Container>
      <CustomHeader title="Accounts" onAdd={openAddModal} />
      <ThemedView style={{position:"relative",height:"95%",}}>
        <FlatList
          scrollEnabled={true}
          data={accounts}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEdit(item)} style={accountItemStyle}>
              <ThemedView style={styles.accountIcon}>
                <Ionicons name="wallet" size={20} color={color.icon} />
              </ThemedView>
              <ThemedView style={styles.accountInfo}>
                <ThemedText style={styles.accountName}>{item.name}</ThemedText>
                {item.description && (
                  <ThemedText style={[styles.accountDesc, {color: color.icon}]}>{item.description}</ThemedText>
                )}
              </ThemedView>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <ThemedView style={styles.emptyState}>
              <Ionicons name="wallet" size={48} color={color.icon} />
              <ThemedText style={styles.emptyText}>No accounts yet</ThemedText>
              <TouchableOpacity onPress={openAddModal} style={[styles.addFirstButton, { backgroundColor: color.button.backgroundColor }]}>
                <ThemedText style={[styles.addFirstText, { color: color.button.textColor }]}>Add First Account</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={ItemSeparator}
        />

        {/* Add/Edit Button */}
        <TouchableOpacity onPress={openAddModal} style={[styles.addButton, { backgroundColor: color.button.backgroundColor }]}>
          <Ionicons name="add" size={24} color={color.button.textColor} />
        </TouchableOpacity>

        {/* Add/Edit Modal */}
        <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)} style={{height: "90%"}}>
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowAddModal(false)} activeOpacity={1}>
            <ThemedView style={styles.modalContent}>
              <TouchableOpacity onPress={() => {}} activeOpacity={1} style={{flex:1}}>
                <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false}>
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
                </ScrollView>

                {editingAccount ? (
                  <ThemedView style={styles.modalActions}>
                    <TouchableOpacity onPress={() => handleDelete(editingAccount.id)} style={styles.deleteModalButton}>
                      <ThemedText style={styles.deleteModalText}>Delete</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.cancelButton}>
                      <ThemedText style={styles.cancelText}>Cancel</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit} style={[styles.submitButton, { backgroundColor: color.button.backgroundColor }]}>
                      <ThemedText style={[styles.submitText, { color: color.button.textColor }]}>
                        Update
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                ) : (
                  <ThemedView style={styles.modalActions}>
                    <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.cancelButton}>
                      <ThemedText style={styles.cancelText}>Cancel</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit} style={[styles.submitButton, { backgroundColor: color.button.backgroundColor }]}>
                      <ThemedText style={[styles.submitText, { color: color.button.textColor }]}>
                        Add
                      </ThemedText>
                    </TouchableOpacity>
                  </ThemedView>
                )}
              </TouchableOpacity>
            </ThemedView>
          </TouchableOpacity>
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
    paddingVertical: 16,
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
    borderRadius: 12,
  },
  addFirstText: {
    fontSize: 16,
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
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
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
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
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
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  submitText: {
    fontSize: 16,
  },
});
