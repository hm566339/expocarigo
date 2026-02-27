"use client"

// Renter Profile Screen - View and edit renter profile
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useAuth } from "../../context/AuthContext"
import RenterService from "../../services/api/renter.service"
import type { Renter, UpdateRenterProfileRequest } from "../../types/renter.types"

const RenterProfileScreen: React.FC = () => {
  const { user } = useAuth()
  const [renter, setRenter] = useState<Renter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form fields
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const renterData = await RenterService.getRenter(user.id)
      setRenter(renterData)
      setName(renterData.name)
      setPhone(renterData.phone || "")
      setAddress(renterData.address || "")
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user?.id) return

    if (!name.trim()) {
      Alert.alert("Validation Error", "Name is required")
      return
    }

    if (!phone.trim()) {
      Alert.alert("Validation Error", "Phone number is required")
      return
    }

    setIsSaving(true)
    try {
      const updateData: UpdateRenterProfileRequest = {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim() || undefined,
      }

      const updatedRenter = await RenterService.updateProfile(user.id, updateData)
      setRenter(updatedRenter)
      setIsEditing(false)
      Alert.alert("Success", "Profile updated successfully!")
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "#4CAF50"
      case "REJECTED":
        return "#F44336"
      default:
        return "#FF9800"
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    )
  }

  if (!renter) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {renter.profileImage ? (
            <Image source={{ uri: renter.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{renter.name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{renter.name}</Text>
          <Text style={styles.headerEmail}>{renter.email}</Text>
          <View style={styles.kycBadge}>
            <Text style={[styles.kycText, { color: getKYCStatusColor(renter.kycStatus) }]}>
              KYC: {renter.kycStatus}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{renter.totalRides}</Text>
          <Text style={styles.statLabel}>Total Rides</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{renter.rating ? renter.rating.toFixed(1) : "N/A"} ⭐</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Profile Form */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            editable={isEditing}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone"
            keyboardType="phone-pad"
            editable={isEditing}
          />

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            multiline
            numberOfLines={3}
            editable={isEditing}
          />

          {isEditing && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false)
                  setName(renter.name)
                  setPhone(renter.phone || "")
                  setAddress(renter.address || "")
                }}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton, isSaving && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#fff",
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  kycBadge: {
    alignSelf: "flex-start",
  },
  kycText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  editLink: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: -8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
})

export default RenterProfileScreen
