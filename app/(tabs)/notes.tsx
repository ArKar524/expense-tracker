import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, TextInput, TouchableOpacity, useColorScheme } from 'react-native';

export default function NotesScreen() {
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];

  const notes = useExpenseStore((state) => state.notes);
  const addNote = useExpenseStore((state) => state.addNote);
  const removeNote = useExpenseStore((state) => state.removeNote);
  const updateNote = useExpenseStore((state) => state.updateNote);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<typeof notes[0] | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a note title');
      return;
    }

    if (editingNote) {
      updateNote({
        ...editingNote,
        title: formData.title,
        content: formData.content,
      });
    } else {
      addNote({
        user_id: null,
        title: formData.title,
        content: formData.content,
      });
    }

    setShowAddModal(false);
    setEditingNote(null);
    setFormData({ title: '', content: '' });
  };

  const handleEdit = (note: typeof notes[0]) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeNote(id) },
      ]
    );
  };

  const openAddModal = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '' });
    setShowAddModal(true);
  };

  return (
    <Container>
      <ThemedView style={{}}>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ThemedView style={styles.noteItem}>
              <ThemedView style={styles.noteHeader}>
                <ThemedView style={styles.noteIcon}>
                  <Ionicons name="document-text" size={20} color="#6b7280" />
                </ThemedView>
                <ThemedView style={styles.noteInfo}>
                  <ThemedText style={styles.noteTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.noteDate}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.noteActions}>
                  <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
                    <Ionicons name="pencil" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
              {item.content && (
                <ThemedText style={styles.noteContent} numberOfLines={3}>
                  {item.content}
                </ThemedText>
              )}
            </ThemedView>
          )}
          ListEmptyComponent={
            <ThemedView style={styles.emptyState}>
              <Ionicons name="document-text" size={48} color={color.icon} />
              <ThemedText style={styles.emptyText}>No notes yet</ThemedText>
              <TouchableOpacity onPress={openAddModal} style={styles.addFirstButton}>
                <ThemedText style={styles.addFirstText}>Add First Note</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          }
          contentContainerStyle={styles.listContent}
        />

        {/* Add/Edit Button */}
        {notes.length > 0 && (
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
                {editingNote ? 'Edit Note' : 'Add Note'}
              </ThemedText>
              
              <TextInput
                style={styles.input}
                placeholder="Note Title"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholderTextColor="#9ca3af"
              />

              <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="Note Content"
                value={formData.content}
                onChangeText={(text) => setFormData({ ...formData, content: text })}
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />

              <ThemedView style={styles.modalActions}>
                <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.cancelButton}>
                  <ThemedText style={styles.cancelText}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                  <ThemedText style={styles.submitText}>
                    {editingNote ? 'Update' : 'Add'}
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
  noteItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteIcon: {
    marginRight: 12,
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  noteDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  noteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  noteContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
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
  contentInput: {
    height: 120,
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
