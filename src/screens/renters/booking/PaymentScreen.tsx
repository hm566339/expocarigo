"use client"

import { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button } from "../../../components/ui/Button"
import InputField from "../../../components/ui/InputField"
import type { NavigationProp, RoutePropType } from "../../../navigation/types"
import { useBookingStore } from "../../../services/storage/store/booking.store"

interface PaymentScreenProps {
  navigation: NavigationProp<"Main">
  route: RoutePropType<"Main">
}

export default function PaymentScreen({ navigation, route }: PaymentScreenProps) {
  const { bookingId, totalAmount } = route.params
  const { confirmPayment, isLoading } = useBookingStore()
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const handlePayment = async () => {
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      alert("Please fill in all card details")
      return
    }

    if (!agreeToTerms) {
      alert("Please agree to terms and conditions")
      return
    }

    try {
      // Simulate payment processing
      await confirmPayment(bookingId)
      navigation.navigate("ActiveTrip", { bookingId })
    } catch (error: any) {
      alert("Payment failed. Please try again.")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Payment Details</Text>
      </View>

      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Total Amount Due</Text>
        <Text style={styles.amountValue}>₹{totalAmount}</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Card Information</Text>

        <InputField label="Cardholder Name" placeholder="John Doe" value={cardName} onChangeText={setCardName} />

        <InputField
          label="Card Number"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="number-pad"
        />

        <View style={styles.rowSection}>
          <View style={styles.halfInput}>
            <InputField label="Expiry Date" placeholder="MM/YY" value={expiryDate} onChangeText={setExpiryDate} />
          </View>
          <View style={styles.halfInput}>
            <InputField label="CVV" placeholder="123" value={cvv} onChangeText={setCvv} keyboardType="number-pad" />
          </View>
        </View>

        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreeToTerms(!agreeToTerms)}>
          <View style={[styles.checkbox, agreeToTerms && styles.checkboxActive]}>
            {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>I agree to terms and conditions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionSection}>
        <Button title="Complete Payment" onPress={handlePayment} loading={isLoading} disabled={!agreeToTerms} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    marginLeft: 20,
    marginTop: 20,
    width: 60,
  },
  backButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  amountCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 8,
  },
  formCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 4,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})
