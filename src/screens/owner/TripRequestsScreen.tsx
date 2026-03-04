"use client"

import React from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

export default function TripRequestsScreen({ navigation }: any) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Trip Requests</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.requestCard, { backgroundColor: colors.surface }]}>
          <View style={styles.requestHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.carName, { color: colors.text }]}>Hyundai i20 Sportz</Text>
              <Text style={[styles.dates, { color: colors.textSecondary }]}>18-20 Jan 2025</Text>
            </View>
            <View style={[styles.amountBadge, { backgroundColor: colors.success + "20" }]}>
              <Text style={[styles.amount, { color: colors.success }]}>₹5,400</Text>
            </View>
          </View>

          <View style={[styles.renterCard, { backgroundColor: colors.background }]}>
            <View style={[styles.renterAvatar, { backgroundColor: colors.primary }]}>
              <Text style={styles.renterInitial}>A</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.renterName, { color: colors.text }]}>Amit Kumar</Text>
              <View style={styles.renterStats}>
                <View style={styles.renterStat}>
                  <Icon name="star" size={12} color={colors.warning} />
                  <Text style={[styles.renterStatText, { color: colors.textSecondary }]}>4.8</Text>
                </View>
                <View style={styles.renterStat}>
                  <Icon name="car-multiple" size={12} color={colors.textSecondary} />
                  <Text style={[styles.renterStatText, { color: colors.textSecondary }]}>23 trips</Text>
                </View>
              </View>
            </View>
            <View style={[styles.trustBadge, { backgroundColor: colors.success + "20" }]}>
              <Icon name="shield-check" size={14} color={colors.success} />
              <Text style={[styles.trustScore, { color: colors.success }]}>92</Text>
            </View>
          </View>

          <View style={[styles.kycCard, { backgroundColor: colors.background }]}>
            <Icon name="check-circle" size={16} color={colors.success} />
            <Text style={[styles.kycText, { color: colors.success }]}>KYC Verified</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={[styles.rejectButton, { borderColor: colors.error }]}>
              <Text style={[styles.rejectText, { color: colors.error }]}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.acceptButton, { backgroundColor: colors.success }]}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  requestCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  carName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  dates: {
    fontSize: 14,
  },
  amountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
  renterCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  renterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  renterInitial: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  renterName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  renterStats: {
    flexDirection: "row",
    gap: 12,
  },
  renterStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  renterStatText: {
    fontSize: 12,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  trustScore: {
    fontSize: 14,
    fontWeight: "700",
  },
  kycCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  kycText: {
    fontSize: 14,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
  },
  rejectText: {
    fontSize: 16,
    fontWeight: "600",
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  acceptText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
