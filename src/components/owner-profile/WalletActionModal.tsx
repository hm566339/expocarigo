"use client"

import React, { useState } from "react"
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface WalletActionModalProps {
  visible: boolean
  onClose: () => void
  action: "add" | "deduct" | "withdraw"
  onConfirm: (amount: number) => Promise<void>
}

export const WalletActionModal: React.FC<WalletActionModalProps> = ({ visible, onClose, action, onConfirm }) => {
  const { colors } = useTheme()
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const getTitle = () => {
    switch (action) {
      case "add":
        return "Add Money"
      case "deduct":
        return "Deduct Money"
      case "withdraw":
        return "Withdraw Money"
    }
  }

  const handleConfirm = async () => {
    const numAmount = Number.parseFloat(amount)
    if (!amount || numAmount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)
    setError("")
    try {
      await onConfirm(numAmount)
      setAmount("")
      onClose()
    } catch (err) {
      setError("Transaction failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setAmount("")
    setError("")
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>{getTitle()}</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Amount (₹)</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, borderColor: colors.border, color: colors.text },
              ]}
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
            />
            {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, { backgroundColor: colors.primary }]}
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={[styles.buttonText, { color: "#fff" }]}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    borderWidth: 1.5,
  },
  confirmButton: {},
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
})
