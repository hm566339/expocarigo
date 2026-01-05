"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { InputField } from "../../components/owner-profile"
import { mockCarOwners } from "../../data/mockCarOwners"

export const BankDetailsScreen = ({ route }: any) => {
  const { colors } = useTheme()
  const { ownerId } = route.params
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
  })

  useEffect(() => {
    // Mock API call to get existing bank details
    const owner = mockCarOwners.find((o) => o.id === ownerId) || mockCarOwners[0]
    if (owner.bankDetails) {
      setFormData(owner.bankDetails)
    }
  }, [ownerId])

  const handleSave = async () => {
    setLoading(true)

    // Mock API call: POST /car-owners/{ownerId}/bank
    setTimeout(() => {
      setLoading(false)
      // Show success message
    }, 1500)
  }

  const isFormValid = formData.accountHolderName.trim() && formData.accountNumber.trim() && formData.ifscCode.trim()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Bank Account Details</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Add your bank details for withdrawals</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Your bank account will be used for wallet withdrawals. Ensure all details are accurate.
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Account Holder Name"
            value={formData.accountHolderName}
            onChangeText={(text) => setFormData({ ...formData, accountHolderName: text })}
            placeholder="Enter account holder name"
            required
          />

          <InputField
            label="Account Number"
            value={formData.accountNumber}
            onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
            placeholder="Enter account number"
            keyboardType="numeric"
            required
          />

          <InputField
            label="IFSC Code"
            value={formData.ifscCode}
            onChangeText={(text) => setFormData({ ...formData, ifscCode: text.toUpperCase() })}
            placeholder="Enter IFSC code"
            required
          />
        </View>

        <View style={[styles.securityNote, { backgroundColor: colors.success + "10" }]}>
          <Text style={[styles.securityText, { color: colors.success }]}>
            Your bank details are encrypted and secure. We never share your information.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary, opacity: isFormValid ? 1 : 0.5 }]}
          onPress={handleSave}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>{formData.accountNumber ? "Update" : "Save"} Bank Details</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    marginBottom: 20,
  },
  securityNote: {
    padding: 16,
    borderRadius: 12,
  },
  securityText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
})
