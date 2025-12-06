import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { COLORS } from '../../constants/colors'
import { useUser } from '@clerk/clerk-expo'
import { useTransactions } from '../../hooks/useTransactions'

export default function Create() {
  const router = useRouter()
  const { user } = useUser()

  const userId = user?.id
  const { createTransaction, loading } = useTransactions(userId)

  const [type, setType] = useState("expense")
  const [amount, setAmount] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")

  const categories = [
    "Food & Drink",
    "Transportation",
    "Income",
    "Entertainment",
    "Bills",
    "Others"
  ]

  // ---------------------------------------------------------
  // HANDLE CREATE
  // ---------------------------------------------------------
  const handleCreate = async () => {
    if (!amount || !title || !category) {
      Alert.alert("Missing fields", "Please fill all fields.")
      return
    }

    const payload = {
      title,
      category,
      user_id: userId,
      amount: type === "expense" ? -Math.abs(Number(amount)) : Math.abs(Number(amount))
    }

    const result = await createTransaction(payload)

    if (result) {
      router.back()
    }
  }

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={26} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Transaction</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* TYPE SELECT */}
      <View style={styles.typeContainer}>
        <TouchableOpacity 
          style={[styles.typeButton, type === "expense" && styles.typeButtonActive]}
          onPress={() => setType("expense")}
        >
          <Ionicons name="arrow-down-outline" size={22} color={type === "expense" ? "white" : "black"} />
          <Text style={[styles.typeText, type === "expense" && { color: "white" }]}>Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeButton, type === "income" && styles.typeButtonActive]}
          onPress={() => setType("income")}
        >
          <Ionicons name="arrow-up-outline" size={22} color={type === "income" ? "white" : "black"} />
          <Text style={[styles.typeText, type === "income" && { color: "white" }]}>Income</Text>
        </TouchableOpacity>
      </View>

      {/* FORM */}
      <View style={styles.form}>
  
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Select Category</Text>

        {/* CATEGORY BUTTONS */}
        <View style={styles.categoryContainer}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCategory(cat)}
              style={[
                styles.categoryButton,
                category === cat && styles.categorySelected
              ]}
            >
              <Text style={[
                styles.categoryText,
                category === cat && { color: "white" }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </View>

      {/* CREATE BTN */}
      <TouchableOpacity 
        style={[styles.createBtn, loading && { opacity: 0.6 }]}
        onPress={handleCreate}
        disabled={loading}
      >
        <Text style={styles.createText}>
          {loading ? "Creating..." : "Create"}
        </Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: COLORS.background
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text
  },

  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25
  },
  typeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary
  },
  typeText: {
    fontSize: 16,
    fontWeight: "600"
  },

  form: {
    gap: 20
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    fontSize: 16
  },

  label: {
    fontWeight: "700",
    fontSize: 16,
    marginTop: 10
  },

  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  categorySelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500"
  },

  createBtn: {
    marginTop: 30,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  createText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700"
  }
})
