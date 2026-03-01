"use client"

// KYC Status Screen - View KYC verification status with detailed feedback
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useAuth } from "../../context/AuthContext"
import RenterService from "../../services/api/renter.service"
import type { Renter } from "../../types/renter.types"

interface KYCStatusScreenProps {
  navigation?: any
}

const KYCStatusScreen: React.FC<KYCStatusScreenProps> = ({ navigation }) => {
  const { user } = useAuth()
  const [renter, setRenter] = useState<Renter | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRenterStatus()
  }, [])

  const loadRenterStatus = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const renterData = await RenterService.getRenter(user.id)
      setRenter(renterData)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load KYC status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReupload = () => {
    if (navigation) {
      navigation.navigate("KYCUpload")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "✅"
      case "REJECTED":
        return "❌"
      default:
        return "⏳"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "#4CAF50"
      case "REJECTED":
        return "#F44336"
      default:
        return "#FF9800"
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "Your KYC has been successfully verified! You can now rent cars."
      case "REJECTED":
        return "Your KYC has been rejected. Please review the reason below and re-upload your documents."
      default:
        return "Your KYC is under review. This usually takes 24-48 hours."
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading KYC status...</Text>
      </View>
    )
  }

  if (!renter) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Profile not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadRenterStatus}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Status Card */}
      <View style={[styles.statusCard, { borderLeftColor: getStatusColor(renter.kycStatus) }]}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusIcon}>{getStatusIcon(renter.kycStatus)}</Text>
          <View style={styles.statusTextContainer}>
            <Text style={styles.statusTitle}>KYC Status: {renter.kycStatus}</Text>
            <Text style={styles.statusSubtitle}>{getStatusMessage(renter.kycStatus)}</Text>
          </View>
        </View>
      </View>

      {/* Rejection Reason (if rejected) */}
      {renter.kycStatus === "REJECTED" && renter.kycRejectionReason && (
        <View style={styles.rejectionCard}>
          <Text style={styles.rejectionTitle}>Rejection Reason</Text>
          <Text style={styles.rejectionText}>{renter.kycRejectionReason}</Text>
        </View>
      )}

      {/* Timeline */}
      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>Verification Timeline</Text>

        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, styles.timelineDotComplete]} />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineLabel}>Documents Uploaded</Text>
            <Text style={styles.timelineDate}>
              {new Date(renter.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <View style={styles.timelineLine} />

        <View style={styles.timelineItem}>
          <View
            style={[
              styles.timelineDot,
              renter.kycStatus !== "PENDING" ? styles.timelineDotComplete : styles.timelineDotPending,
            ]}
          />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineLabel}>Under Review</Text>
            <Text style={styles.timelineDate}>{renter.kycStatus !== "PENDING" ? "Completed" : "In Progress"}</Text>
          </View>
        </View>

        <View style={styles.timelineLine} />

        <View style={styles.timelineItem}>
          <View
            style={[
              styles.timelineDot,
              renter.kycStatus === "VERIFIED" ? styles.timelineDotComplete : styles.timelineDotPending,
            ]}
          />
          <View style={styles.timelineContent}>
            <Text style={styles.timelineLabel}>Verification Complete</Text>
            <Text style={styles.timelineDate}>
              {renter.kycStatus === "VERIFIED"
                ? new Date(renter.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : "Pending"}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {renter.kycStatus === "REJECTED" && (
          <TouchableOpacity style={styles.primaryButton} onPress={handleReupload}>
            <Text style={styles.primaryButtonText}>Re-upload Documents</Text>
          </TouchableOpacity>
        )}

        {renter.kycStatus === "PENDING" && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Your documents are being reviewed. You'll receive a notification once verification is complete.
            </Text>
          </View>
        )}

        {renter.kycStatus === "VERIFIED" && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>You're all set! Start browsing and renting cars in your area.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.secondaryButton} onPress={loadRenterStatus}>
          <Text style={styles.secondaryButtonText}>Refresh Status</Text>
        </TouchableOpacity>
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
    padding: 16,
    paddingBottom: 32,
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
  statusCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 6,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statusIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  rejectionCard: {
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  rejectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D32F2F",
    marginBottom: 8,
  },
  rejectionText: {
    fontSize: 14,
    color: "#C62828",
    lineHeight: 20,
  },
  timelineCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    marginTop: 2,
  },
  timelineDotComplete: {
    backgroundColor: "#4CAF50",
  },
  timelineDotPending: {
    backgroundColor: "#E0E0E0",
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: "#E0E0E0",
    marginLeft: 7,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: "#666",
  },
  actionContainer: {
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#1976D2",
    lineHeight: 20,
  },
  successBox: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  successText: {
    fontSize: 14,
    color: "#2E7D32",
    lineHeight: 20,
  },
})

export default KYCStatusScreen
