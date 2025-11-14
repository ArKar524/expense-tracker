import Container from '@/components/container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import useExpenseStore from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { FlatList, StyleSheet, useColorScheme, View } from 'react-native';

export default function DashboardScreen() {
  const theme = useColorScheme() ?? 'light';
  const color = Colors[theme];

  const transactions = useExpenseStore((state) => state.transactions);
  const categories = useExpenseStore((state) => state.categories);
  const accounts = useExpenseStore((state) => state.accounts);

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
    <Container>
      <View style={styles.container}>
        {/* Balance Cards */}
        <ThemedView style={styles.balanceCard}>
          <ThemedText style={styles.balanceLabel}>Total Balance</ThemedText>
          <ThemedText style={{}}>${stats.balance.toLocaleString()}</ThemedText>
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
        {/* Accounts Summary */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Accounts</ThemedText> 
            <FlatList
              data={accounts}
              keyExtractor={(item,index) => index.toString() }
              renderItem={({ item }) => (
                <View style={styles.accountItem}>
                  <View style={styles.accountIcon}>
                    <Ionicons name="wallet" size={20} color="#3b82f6" />
                  </View>
                  <View style={styles.accountInfo}>
                    <ThemedText style={styles.accountName}>{item.name}</ThemedText>
                    {item.description && (
                      <ThemedText style={styles.accountDesc}>{item.description}</ThemedText>
                    )}
                  </View>
                </View>
              )}
              horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
              <Ionicons name="wallet" size={32} color={color.icon} />
              <ThemedText style={styles.emptyText}>No accounts yet</ThemedText>
            </View>
            )}
            /> 
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recent Transactions</ThemedText> 
            <FlatList
              data={recentTransactions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                  <View style={[styles.transactionIcon, item.type === 'income' ? styles.incomeBg : styles.expenseBg]}>
                    {item.type === 'income' ? (
                      <Ionicons name="trending-up" size={20} color="#10b981" />
                    ) : (
                      <Ionicons name="trending-down" size={20} color="#ef4444" />
                    )}
                  </View>
                  <View style={styles.transactionInfo}>
                    <ThemedText style={styles.transactionCategory}>{getCategoryName(item.category_id)}</ThemedText>
                    <ThemedText style={styles.transactionAccount}>{getAccountName(item.account_id)}</ThemedText>
                  </View>
                  <ThemedText style={[styles.transactionAmount, item.type === 'income' ? styles.incomeText : styles.expenseText]}>
                    {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                  </ThemedText>
                </View>
              )}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>No transactions yet</ThemedText>
            </View>)}
            /> 
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 16,
  },
  balanceCard: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  balanceLabel: {
    // color: '#9ca3af',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    // color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  incomeText: {
    color: '#10b981',
  },
  expenseText: {
    color: '#ef4444',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  incomeCard: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  expenseCard: {
    flex: 1,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    marginTop: 8,
    color: '#6b7280',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minWidth: 200,
  },
  accountIcon: {
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '500',
  },
  accountDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
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
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
