import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TransactionScreen() {
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];

  const expenseStore = useExpenseStore((s) => s.expenseData);

  // Group by calendar day and sort groups descending
  const sections = useMemo(() => {
    const sorted = expenseStore.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const groups = new Map<string, typeof expenseStore>();

    for (const item of sorted) {
      const d = new Date(item.date);
      const key = d.toDateString();
      if (!groups.has(key)) groups.set(key, [] as typeof expenseStore);
      groups.get(key)!.push(item);
    }

    return Array.from(groups.entries()).map(([key, data]) => ({
      title: new Date(data[0].date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      data,
    }));
  }, [expenseStore]);

  const renderItem = ({ item }: { item: typeof expenseStore[0] }) => {
    const date = new Date(item.date);
    const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    return (
      <TouchableOpacity style={styles.row} activeOpacity={0.6}>
        <ThemedView>
          <ThemedText ellipsizeMode="tail" numberOfLines={1}>{item.description || 'No description'}</ThemedText>
          <ThemedText style={{ fontSize: 13, fontWeight: '600', color: '#888' }}>{time}</ThemedText>
        </ThemedView>
        <ThemedText style={{ color: item.type === 'expense' ? 'red' : 'green' }}>${item.amount.toFixed(2)}</ThemedText>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <ThemedView style={styles.sectionHeader}>
      <ThemedText style={{ fontWeight: '700' }}>{section.title}</ThemedText>
    </ThemedView>
  );

  return (
      <Container>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <ThemedText type="title" style={{ fontSize: 26, lineHeight: 28 }}>
          All Transactions
        </ThemedText>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="home-outline" size={26} color={color.text} />
        </TouchableOpacity>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader} 
        ListEmptyComponent={<ThemedText style={{ paddingVertical: 10 }}>No transactions yet</ThemedText>}
        ItemSeparatorComponent={() => (
          <ThemedView
            style={{
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: color.text,
            }}
          />
        )}
        contentContainerStyle={[styles.card, { backgroundColor: color.background }]}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  sectionHeader: {
    paddingVertical: 8,
  },
});
