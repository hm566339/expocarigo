"use client"

import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ConfirmationDialog, ProfileInfoCard, StatusBadge } from "../../components/owner-profile"
import { useTheme } from "../../context/ThemeContext"
import { mockCarOwners } from "../../data/mockCarOwners"
import type { CarOwner } from "../../types/carOwner"

export const OwnerDetailScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme()
  const { ownerId } = route.params
  const [owner, setOwner] = useState<CarOwner | null>(null)
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

  useEffect(() => {
    // Mock API call: GET /car-owners/{id}
    const foundOwner = mockCarOwners.find((o) => o.id === ownerId) || mockCarOwners[0]
    setOwner(foundOwner)
  }, [ownerId])

  const handleDelete = async () => {
    // Mock API call: DELETE /car-owners/{id}
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
        navigation.goBack()
      }, 1000)
    })
  }

  if (!owner) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[styles.headerCard, { backgroundColor: colors.surface }]}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{owner.name.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{owner.name}</Text>
          <Text style={[styles.id, { color: colors.textSecondary }]}>ID: {owner.id}</Text>

          <View style={styles.statusRow}>
            <StatusBadge status={owner.kycStatus.overall === "approved" ? "verified" : "pending"} label="KYC" />
            <View style={[styles.ratingBadge, { backgroundColor: colors.success + "20" }]}>
              <Text style={[styles.ratingText, { color: colors.success }]}>★ {owner.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        {/* Contact Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
          <ProfileInfoCard label="Email" value={owner.email} />
          <ProfileInfoCard label="Phone" value={owner.phone || "Not provided"} />
          <ProfileInfoCard label="Address" value={owner.address || "Not provided"} />
        </View>

        {/* KYC & Personal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal & KYC</Text>
          <ProfileInfoCard label="Date of Birth" value={owner.dob || "Not provided"} />
          <ProfileInfoCard label="Blood Group" value={owner.bloodGroup || "Not provided"} />
          <ProfileInfoCard label="Aadhaar Number" value={owner.aadhaarNumber || "Not provided"} />
          <ProfileInfoCard label="Driving License" value={owner.drivingLicenseNumber || "Not provided"} />
        </View>

        {/* Financial Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Financial Details</Text>
          <View style={[styles.walletCard, { backgroundColor: colors.primary }]}>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletBalance}>₹{owner.wallet.balance.toLocaleString("en-IN")}</Text>
          </View>

          {owner.bankDetails && (
            <View style={[styles.bankCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.bankTitle, { color: colors.text }]}>Bank Account</Text>
              <Text style={[styles.bankDetail, { color: colors.textSecondary }]}>
                {owner.bankDetails.accountHolderName}
              </Text>
              <Text style={[styles.bankDetail, { color: colors.textSecondary }]}>
                Account: ••••{owner.bankDetails.accountNumber.slice(-4)}
              </Text>
              <Text style={[styles.bankDetail, { color: colors.textSecondary }]}>
                IFSC: {owner.bankDetails.ifscCode}
              </Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Statistics</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{owner.tripsCompleted}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trips</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{owner.rating.toFixed(1)}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rating</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.dangerTitle, { color: colors.error }]}>Danger Zone</Text>
          <TouchableOpacity
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={() => setDeleteDialogVisible(true)}
          >
            <Text style={styles.deleteButtonText}>Delete Owner Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmationDialog
        visible={deleteDialogVisible}
        onClose={() => setDeleteDialogVisible(false)}
        title="Delete Owner Account"
        message="Are you sure you want to delete this car owner account? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        danger
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
  headerCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  id: {
    fontSize: 13,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: "row",
    gap: 12,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  walletCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 12,
  },
  walletLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 8,
  },
  walletBalance: {
    fontSize: 36,
    fontWeight: "700",
    color: "#fff",
  },
  bankCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  bankTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  bankDetail: {
    fontSize: 13,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  deleteButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
})
