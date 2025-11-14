import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

export default function CategoriesScreen() {
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];

  const categories = useExpenseStore((state) => state.categories);
  const addCategory = useExpenseStore((state) => state.addCategory);
  const removeCategory = useExpenseStore((state) => state.removeCategory);
  const updateCategory = useExpenseStore((state) => state.updateCategory);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof categories[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: formData.name,
        description: formData.description,
      });
    } else {
      addCategory({
        user_id: null,
        name: formData.name,
        description: formData.description,
      });
    }

    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (category: typeof categories[0]) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeCategory(id) },
      ]
    );
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowAddModal(true);
  };

  return (
    <Container>
      <ThemedView>
        <FlatList
          data={categories}
          keyExtractor={(item,index) => index.toString()}
          renderItem={({ item }) => (
            <ThemedView style={styles.categoryItem}>
              <ThemedView style={styles.categoryIcon}>
                <Ionicons name="pricetag" size={20} color="#8b5cf6" />
              </ThemedView>
              <ThemedView style={styles.categoryInfo}>
                <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                {item.description && (
                  <ThemedText style={styles.categoryDesc}>{item.description}</ThemedText>
                )}
              </ThemedView>
              <ThemedView style={styles.categoryActions}>
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
              <Ionicons name="pricetag" size={48} color={color.icon} />
              <ThemedText style={styles.emptyText}>No categories yet</ThemedText>
              <TouchableOpacity onPress={openAddModal} style={styles.addFirstButton}>
                <ThemedText style={styles.addFirstText}>Add First Category</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          }
          contentContainerStyle={styles.listContent}
        />

        {/* Add/Edit Button */}
        {categories.length > 0 && (
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
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </ThemedText>
              
              <TextInput
                style={styles.input}
                placeholder="Category Name"
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
                    {editingCategory ? 'Update' : 'Add'}
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
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryIcon: {
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryDesc: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  categoryActions: {
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
