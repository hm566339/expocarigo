"use client"

import React from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

export default function EarningsScreen() {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Earnings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.balanceCard, { backgroundColor: colors.success }]}>
          <Text style={styles.balanceLabel}>Total Earnings</Text>
          <Text style={styles.balance}>₹24,500</Text>
          <TouchableOpacity style={[styles.withdrawButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Icon name="bank-transfer" size={20} color="#FFFFFF" />
            <Text style={styles.withdrawText}>Withdraw to Bank</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Icon name="currency-inr" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>₹8,200</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>This Month</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Icon name="car-multiple" size={24} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.text }]}>45</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Trips</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trip-wise Earnings</Text>

          <View style={[styles.earningCard, { backgroundColor: colors.surface }]}>
            <View style={styles.earningHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.carName, { color: colors.text }]}>Maruti Swift VXI</Text>
                <Text style={[styles.dates, { color: colors.textSecondary }]}>15-17 Jan 2025</Text>
              </View>
              <Text style={[styles.amount, { color: colors.success }]}>+₹4,832</Text>
            </View>
            <View style={styles.breakdown}>
              <Text style={[styles.breakdownText, { color: colors.textSecondary }]}>Rental: ₹2,400</Text>
              <Text style={[styles.breakdownText, { color: colors.textSecondary }]}>Platform fee: -₹240</Text>
            </View>
          </View>

          <View style={[styles.earningCard, { backgroundColor: colors.surface }]}>
            <View style={styles.earningHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.carName, { color: colors.text }]}>Hyundai i20 Sportz</Text>
                <Text style={[styles.dates, { color: colors.textSecondary }]}>10-12 Jan 2025</Text>
              </View>
              <Text style={[styles.amount, { color: colors.success }]}>+₹5,400</Text>
            </View>
            <View style={styles.breakdown}>
              <Text style={[styles.breakdownText, { color: colors.textSecondary }]}>Rental: ₹3,600</Text>
              <Text style={[styles.breakdownText, { color: colors.textSecondary }]}>Platform fee: -₹360</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  balanceCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 8,
  },
  balance: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "700",
    marginBottom: 20,
  },
  withdrawButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  withdrawText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  earningCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  earningHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  carName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dates: {
    fontSize: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
  },
  breakdown: {
    gap: 4,
  },
  breakdownText: {
    fontSize: 12,
  },
})
