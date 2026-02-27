"use client"

import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { WalletActionModal } from "../../components/owner-profile"
import { useTheme } from "../../context/ThemeContext"
import { mockCarOwners } from "../../data/mockCarOwners"

export const OwnerWalletScreen = ({ route }: any) => {
  const { colors } = useTheme()
  const { ownerId } = route.params
  const [balance, setBalance] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [currentAction, setCurrentAction] = useState<"add" | "deduct" | "withdraw">("add")

  useEffect(() => {
    // Mock API call to get wallet balance
    const owner = mockCarOwners.find((o) => o.id === ownerId) || mockCarOwners[0]
    setBalance(owner.wallet.balance)
  }, [ownerId])

  const handleAction = (action: "add" | "deduct" | "withdraw") => {
    setCurrentAction(action)
    setModalVisible(true)
  }

  const handleConfirm = async (amount: number) => {
    // Mock API calls
    // POST /car-owners/{ownerId}/wallet/add?amount=
    // POST /car-owners/{ownerId}/wallet/deduct?amount=
    // POST /car-owners/{ownerId}/wallet/withdraw?amount=

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (currentAction === "add") {
          setBalance((prev) => prev + amount)
        } else {
          setBalance((prev) => Math.max(0, prev - amount))
        }
        resolve()
      }, 1000)
    })
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Wallet Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toLocaleString("en-IN")}</Text>
          <Text style={styles.balanceSubtext}>Available for withdrawals and bookings</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleAction("add")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.success + "20" }]}>
              <Text style={[styles.actionIconText, { color: colors.success }]}>+</Text>
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Add Money</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleAction("deduct")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.error + "20" }]}>
              <Text style={[styles.actionIconText, { color: colors.error }]}>-</Text>
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Deduct Money</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => handleAction("withdraw")}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primary + "20" }]}>
              <Text style={[styles.actionIconText, { color: colors.primary }]}>↑</Text>
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={[styles.infoSection, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>How Wallet Works</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            • Add money to your wallet for quick bookings{"\n"}• Withdraw earnings to your linked bank account{"\n"}•
            All transactions are secure and instant{"\n"}• Minimum withdrawal amount: ₹500
          </Text>
        </View>
      </ScrollView>

      <WalletActionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        action={currentAction}
        onConfirm={handleConfirm}
      />
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
  balanceCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 13,
    color: "#fff",
    opacity: 0.8,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionIconText: {
    fontSize: 24,
    fontWeight: "700",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoSection: {
    borderRadius: 16,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
})
