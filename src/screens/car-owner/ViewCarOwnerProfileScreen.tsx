import React, { useEffect, useState } from "react"
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { ProfileInfoCard, StatusBadge } from "../../components/owner-profile"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import CarOwnerService from "../../services/api/car-owner.service"
import type { CarOwner } from "../../types/owner.types"

export const ViewCarOwnerProfileScreen = ({ navigation }: any) => {
  const { colors } = useTheme()
  const { user } = useAuth()

  const [owner, setOwner] = useState<CarOwner | null>(null)
  const ownerId = user?.id

  useEffect(() => {
    if (!ownerId) return

    CarOwnerService
      .getOwner(ownerId.toString())
      .then(setOwner)
      .catch(err => {
        console.log("Failed to fetch owner:", err)
      })
  }, [ownerId])

  if (!owner) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    )
  }

  const isKycVerified = owner.kycStatus === "VERIFIED"

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* ================= HEADER ================= */}
        <View style={[styles.headerCard, { backgroundColor: colors.surface }]}>

          <View style={styles.avatarPlaceholder}>
            {owner.selfieUrl ? (
              <Image
                source={{ uri: owner.selfieUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {owner.name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>

          <Text style={[styles.name, { color: colors.text }]}>
            {owner.name}
          </Text>

          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {owner.email}
          </Text>

          <View style={styles.statusRow}>
            <StatusBadge
              status={isKycVerified ? "verified" : "pending"}
              label="KYC"
            />

            <View
              style={[
                styles.ratingBadge,
                { backgroundColor: colors.success + "20" },
              ]}
            >
              <Text
                style={[styles.ratingText, { color: colors.success }]}
              >
                ★ {owner.rating.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* ================= PERSONAL DETAILS ================= */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Personal Details
          </Text>

          <ProfileInfoCard
            label="Date of Birth"
            value={owner.dob || "Not provided"}
          />
          <ProfileInfoCard
            label="Phone"
            value={owner.phone || "Not provided"}
          />
          <ProfileInfoCard
            label="Blood Group"
            value={owner.bloodGroup || "Not provided"}
          />
          <ProfileInfoCard
            label="Address"
            value={owner.address || "Not provided"}
          />
        </View>

        {/* ================= WALLET ================= */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Wallet
          </Text>

          <View
            style={[
              styles.walletCard,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.walletLabel}>Current Balance</Text>
            <Text style={styles.walletBalance}>
              ₹{owner.walletBalance.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* ================= ACTIONS ================= */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => navigation.navigate("UpdateCarOwnerProfile")}
          >
            <Text
              style={[
                styles.actionButtonText,
                { color: colors.primary },
              ]}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => navigation.navigate("KYCUpload")}
          >
            <Text
              style={[
                styles.actionButtonText,
                { color: colors.primary },
              ]}
            >
              KYC Upload
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  )
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, padding: 20 },

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
    overflow: "hidden",
  },

  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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

  email: {
    fontSize: 14,
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

  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },

  actionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },

  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
})
