import { useCallback, useState } from "react";
import { Alert } from "react-native";
import api from "../lib/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Fetch All Transactions
  // --------------------------------------------------
  const fetchTransactions = useCallback(async () => {
    try {
      const { data } = await api.get(`/transactions/${userId}`);

      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.log("Fetch transactions error:", error.message);
    }
  }, [userId]);

  // --------------------------------------------------
  // Fetch Summary (Balance, Income, Expense)
  // --------------------------------------------------
  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await api.get(`/transactions/summary/${userId}`);

      if (data.success) {
        setSummary({
          balance: data.balance,
          income: data.income,
          expenses: data.expense, 
        });
      }
    } catch (error) {
      console.log("Fetch summary error:", error.message);
    }
  }, [userId]);

  // --------------------------------------------------
  // Load Both in Parallel
  // --------------------------------------------------
  const loadData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.log("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  // --------------------------------------------------
  // Create Transaction (NEW)
  // --------------------------------------------------
  const createTransaction = useCallback(
    async (transactionData) => {
      setLoading(true);
      try {
        const { data } = await api.post(`/transactions`, {
          ...transactionData,

        });

        if (data.success) {
          // Add new transaction to local list instantly (smooth UI)
          setTransactions((prev) => [data.transaction, ...prev]);

          // Update summary after adding
          await fetchSummary();

          Alert.alert("Success", "Transaction created successfully");
         
          return data.transaction;
     
        }
      } catch (error) {
        console.log("Create transaction error:", error.message);
        Alert.alert("Error", "Failed to create transaction");
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchSummary]
  );

  // --------------------------------------------------
  // Delete Transaction
  // --------------------------------------------------
  const deleteTransactions = useCallback(
    async (transactionId) => {
      setLoading(true);
      try {
        const { data } = await api.delete(`/transactions/${transactionId}`);

        if (data.success) {
          // Remove from state
          setTransactions((prev) =>
            prev.filter((tx) => tx.id !== transactionId)
          );

          // Update summary
          await fetchSummary();

          Alert.alert("Success", "Transaction deleted successfully");
        }
      } catch (error) {
        console.log("Delete transaction error:", error.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchSummary]
  );

  // --------------------------------------------------
  return {
    transactions,
    summary,
    loading,
    loadData,
    createTransaction,  
    deleteTransactions,
  };
};
