"use client"
import React from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { NavigationProp } from "../../../navigation/types"
import { useAuthStore } from "../../../services/storage/store/auth.store"

interface ProfileScreenProps {
  navigation: NavigationProp<"Main">
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigation.navigate("Auth" as any)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      {user && (
        <>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name?.charAt(0) || "U"}</Text>
            </View>

            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text style={styles.infoValue}>{user.role}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>KYC Status</Text>
              <View style={[styles.kycBadge, styles[`kyc_${user.kycStatus}`]]}>
                <Text style={styles.kycBadgeText}>{user.kycStatus}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Account Type</Text>
              <Text style={styles.infoValue}>Renter</Text>
            </View>
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Edit Profile</Text>
            </TouchableOpacity>

            {user.kycStatus !== "VERIFIED" && (
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Complete KYC</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 24,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  userPhone: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  infoSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  kycBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  kyc_PENDING: {
    backgroundColor: "#FFF3CD",
  },
  kyc_SUBMITTED: {
    backgroundColor: "#D1EDFF",
  },
  kyc_VERIFIED: {
    backgroundColor: "#D1E7DD",
  },
  kyc_REJECTED: {
    backgroundColor: "#F8D7DA",
  },
  kycBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  logoutButton: {
    borderColor: "#FF3B30",
    backgroundColor: "#FF3B30",
  },
  logoutButtonText: {
    color: "#fff",
  },
})
