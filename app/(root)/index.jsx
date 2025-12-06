import { useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { useTransactions } from '../../hooks/useTransactions';
import PageLoader from '../../components/PageLoader';
import { formatDate } from '../../lib/utils';
import { Link } from 'expo-router';

export default function Page() {
  const { user} = useUser();
  const {signOut} =useAuth()
  const { transactions, summary, loading, loadData, deleteTransactions } = useTransactions(user?.id);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return <PageLoader />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome Card */}
      <View style={styles.welcomeCardContainer}>
        <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.userNameText}>
            {user?.emailAddresses[0]?.emailAddress.split('@')[0]}
          </Text>
        </View>
        <Link href="/create" style={styles.addButton}>
          <Ionicons name="add-outline" size={24} color="white" />
          <Text style={styles.addButtonText}>Add</Text>
        </Link>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={34} color="black" />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.balanceText} >Total Balance</Text>
          <Text style={{ fontWeight: '700', fontSize: 18 }}>${summary.balance}</Text>
        </View>
        <View style={styles.incomeExpenseContainer}>
          <View style={styles.innerIncomeExpenseContainer}>
            <Text style={styles.text}>Income</Text>
            <Text style={styles.incomeText}>${summary.income}</Text>
          </View>
          <View style={styles.innerIncomeExpenseContainer}>
            <Text style={styles.text}>Expense</Text>
            <Text style={styles.expenseText}>${summary.expenses}</Text>
          </View>
        </View>
      </View>

      {/* Transactions List */}
      <View style={styles.transactionsContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.transactionCard}>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
              </View>
              <View style={styles.transactionAmountContainer}>
                <Text
                  style={[
                    styles.transactionAmount,
                    item.amount >= 0 ? styles.incomeText : styles.expenseText,
                  ]}
                >
                  ${item.amount}
                </Text>
                <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
                <TouchableOpacity onPress={() => deleteTransactions(item.id)}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    gap: 20,
    backgroundColor: COLORS.background,
  },
  welcomeCardContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTextContainer: {
    flexDirection: 'column',
    gap: 5,
  },
  welcomeText: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.textLight,
  },
  userNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  logo: {
    width: 60,
    height: 60,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  summaryCard: {
    gap: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  incomeExpenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  innerIncomeExpenseContainer:{
    gap:4

  },
  text:{
    fontSize:16,
    fontWeight:'500'
  },
  balanceText:{
    fontSize:18,
    fontWeight:'600',
    paddingBottom:5 
  },
 
  incomeText: {
    color: COLORS.income,
    fontWeight: '700',
  },
  expenseText: {
    color: COLORS.expense,
    fontWeight: '700',
  },
  transactionsContainer: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  transactionInfo: {
    flexDirection: 'column',
    gap: 4,
  },
  transactionTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.text,
  },
  transactionCategory: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  transactionAmountContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionAmount: {
    fontWeight: '700',
    fontSize: 16,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.textLight,
  },
});
