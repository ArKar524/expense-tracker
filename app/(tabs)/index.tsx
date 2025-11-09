import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];
  const router = useRouter();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [text, setText] = useState<string>('');

  const expenseStore = useExpenseStore((state) => state.expenseData);
  const addExpense = useExpenseStore((state) => state.addExpense);

  const handleTypeChange = (newType: 'income' | 'expense') => setType(newType);

  const handleAddExpense = () => {
    if (!text.trim()) return;

    const parts = text.trim().split(' ');
    const amount = parseFloat(parts[0]);
    if (isNaN(amount)) {
      alert('Invalid amount!');
      return;
    }
    const description = parts.slice(1).join(' ') || '';

    const newExpense = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      amount,
      description,
      date: new Date(),
    };

    addExpense(newExpense);
    setText('');
  };

  // Compute totals dynamically using useMemo
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = expenseStore
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    const expense = expenseStore
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [expenseStore]);

  const placeholder =
    type === 'expense' ? 'Quick add expense ...' : 'Quick add income ...';

  const renderItem = ({ item }: { item: typeof expenseStore[0] }) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <TouchableOpacity style={styles.row}   activeOpacity={0.5}>
        <ThemedView>
          <ThemedText ellipsizeMode="tail" numberOfLines={1}>{item.description || 'No description'}</ThemedText>
          <ThemedText style={{ fontSize: 13, fontWeight: "600" , color: '#888' }}>
            {formattedDate}
          </ThemedText>
        </ThemedView>
        <ThemedText
          style={{ color: item.type === 'expense' ? 'red' : 'green' }}
        >
          ${item.amount.toFixed(2)}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <Container style={{ gap: 16, padding: 16 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <ThemedText type="title" style={{ fontSize: 26, lineHeight: 28 }} numberOfLines={1}>Dot Balance</ThemedText>
      <TouchableOpacity onPress={() => router.push('/setting')}>
        <Ionicons name="settings-outline" size={26} color={color.text} />
      </TouchableOpacity>
    </View>

      {/* Dynamic Balance Card */}
      <ThemedView style={styles.card}>
        <ThemedText>CURRENT BALANCE</ThemedText>
        <ThemedText type="subtitle" style={{ paddingVertical: 5 }}>
          ${balance.toFixed(2)}
        </ThemedText>

        <ThemedView style={styles.row}>
          <View>
            <ThemedText>Income</ThemedText>
            <ThemedText style={{ color: 'green' }}>
              ${totalIncome.toFixed(2)}
            </ThemedText>
          </View>
          <View>
            <ThemedText>Expenses</ThemedText>
            <ThemedText style={{ color: 'red' }}>
              ${totalExpense.toFixed(2)}
            </ThemedText>
          </View>
        </ThemedView>
      </ThemedView>

      {/* Input Section */}
      <ThemedView
        style={[
          styles.inputContainer,
          { backgroundColor: color.background, overflow: 'hidden', borderRadius: 100 },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            handleTypeChange(type === 'expense' ? 'income' : 'expense')
          }
          style={styles.toggleButton}
        >
          <IconSymbol
            name={type === 'expense' ? 'chevron.up' : 'chevron.down'}
            color={type === 'expense' ? 'red' : 'green'}
          />
        </TouchableOpacity>

        <TextInput
          value={text}
          onChangeText={setText}
          style={[styles.textInput, { color: color.text }]}
          placeholder={placeholder}
          placeholderTextColor={color.text}
        />

        <TouchableOpacity style={styles.sendButton} onPress={handleAddExpense}>
          <IconSymbol name="paperplane.fill" color={color.text} size={18} />
        </TouchableOpacity>
      </ThemedView>

      {/* Transaction List */}
      <ThemedView style={{ backgroundColor: 'transparent', flex: 1 }}>

        <FlatList
          ListHeaderComponent={() => (
            <ThemedView
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 5,
              }}
            >
              <ThemedText type="subtitle">Recent Transactions</ThemedText>
              <ThemedText type="default">View all</ThemedText>
            </ThemedView>
          )}
          data={expenseStore.slice().reverse().slice(0, 10)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <ThemedText style={{ paddingVertical: 10 }}>
              No transactions yet
            </ThemedText>
          }
          ItemSeparatorComponent={() => (
            <ThemedView
              style={{
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: color.text,
              }}
            />
          )}
           contentContainerStyle={[styles.card,{backgroundColor: color.background}]}
        />
      </ThemedView>
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
    paddingVertical: 5,
  },
  inputContainer: {
    borderRadius: 50,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    padding: 10,
  },
  textInput: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  sendButton: {
    padding: 10,
  },
});
