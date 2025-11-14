import Container from '@/components/container';
import CustomHeader from '@/components/CustomHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export default function DashboardScreen() {
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];

  const transactions = useExpenseStore((state) => state.transactions);
  const categories = useExpenseStore((state) => state.categories);
  const accounts = useExpenseStore((state) => state.accounts);

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  }, [transactions]);

  const getCategoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name || 'Unknown';
  const getAccountName = (id: number) =>
    accounts.find((a) => a.id === id)?.name || 'Unknown';

  const navItems = [
    { label: 'Accounts', icon: 'wallet', route: '/accounts' },
    { label: 'Categories', icon: 'list', route: '/categories' },
    { label: 'Notes', icon: 'document-text', route: '/notes' },
    { label: 'Settings', icon: 'settings', route: '/setting' },
    { label: 'Add Transaction', icon: 'add-circle', route: '/transaction' },
  ];

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  const handlePress = (route: string, animValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      router.push(route);
    });
  };

  return (
    <Container>
      <CustomHeader title="Dashboard" showBack={false} />
      <View style={styles.container}>

        {/* Balance Card */}
        <ThemedView style={[styles.balanceCard, { backgroundColor: color.tint }]}>
          <ThemedText style={styles.balanceLabel}>Total Balance</ThemedText>
          <ThemedText style={styles.balanceAmount}>
            ${stats.balance.toLocaleString()}
          </ThemedText>
          <View style={styles.balanceDetails}>
            <View>
              <ThemedText style={styles.detailLabel}>Income</ThemedText>
              <ThemedText style={styles.incomeText}>${stats.income.toLocaleString()}</ThemedText>
            </View>
            <View>
              <ThemedText style={styles.detailLabel}>Expense</ThemedText>
              <ThemedText style={styles.expenseText}>${stats.expense.toLocaleString()}</ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Quick Navigation */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Navigation</ThemedText>
          <View style={styles.navContainer}>
            {navItems.map((item) => {
              const scale = new Animated.Value(1);
              return (
                <AnimatedTouchable
                  key={item.label}
                  style={[
                    styles.navButton,
                    { backgroundColor: color.tint, transform: [{ scale }] },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handlePress(item.route, scale)}
                >
                  <Ionicons name={item.icon} size={22} color={"#fff"} />
                  <ThemedText style={styles.navText}>{item.label}</ThemedText>
                </AnimatedTouchable>
              );
            })}
          </View>
        </ThemedView>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText>
          <FlatList
            data={recentTransactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[styles.transactionItem, { backgroundColor: color.card.background }]}>
                <View
                  style={[
                    styles.transactionIcon,
                    item.type === 'income' ? styles.incomeBg : styles.expenseBg,
                  ]}
                >
                  <Ionicons
                    name={item.type === 'income' ? 'trending-up' : 'trending-down'}
                    size={20}
                    color={item.type === 'income' ? '#10b981' : '#ef4444'}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <ThemedText style={styles.transactionCategory}>
                    {getCategoryName(item.category_id)}
                  </ThemedText>
                  <ThemedText style={styles.transactionAccount}>
                    {getAccountName(item.account_id)}
                  </ThemedText>
                </View>
                <ThemedText
                  style={[
                    styles.transactionAmount,
                    item.type === 'income' ? styles.incomeText : styles.expenseText,
                  ]}
                >
                  {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                </ThemedText>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>No transactions yet</ThemedText>
              </View>
            )}
          />
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {},

  balanceCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceLabel: { color: '#fff', fontSize: 14, marginBottom: 8 },
  balanceAmount: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  balanceDetails: { flexDirection: 'row', justifyContent: 'space-between' },

  detailLabel: { color: '#e2e8f0', fontSize: 12 },
  incomeText: { color: '#10b981' },
  expenseText: { color: '#ef4444' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },

  navContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButton: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
  },
  navText: { fontSize: 11, marginTop: 6,color:"#fff", textAlign: 'center' },

  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionIcon: { marginRight: 12, borderRadius: 8, padding: 8 },
  incomeBg: { backgroundColor: '#f0fdf4' },
  expenseBg: { backgroundColor: '#fef2f2' },
  transactionInfo: { flex: 1 },
  transactionCategory: { fontSize: 14, fontWeight: '500' },
  transactionAccount: { fontSize: 12, color: '#6b7280' },
  transactionAmount: { fontSize: 16, fontWeight: '600' },

  emptyState: { alignItems: 'center', padding: 48 },
  emptyText: { marginTop: 8, color: '#6b7280' },
});
