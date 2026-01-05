"use client"

import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button } from "../../../components/ui/Button"
import ErrorBanner from "../../../components/ui/ErrorBanner"
import type { NavigationProp } from "../../../navigation/types"
import { useAuthStore } from "../../../services/storage/store/auth.store"
import { useProfileStore } from "../../../services/storage/store/profile.store"

interface KYCUploadScreenProps {
  navigation: NavigationProp<"Main">
}

interface KYCDocument {
  type: "AADHAAR_FRONT" | "AADHAAR_BACK" | "SELFIE" | "DRIVING_LICENSE"
  label: string
  uri: string | null
  uploaded: boolean
}

export default function KYCUploadScreen({ navigation }: KYCUploadScreenProps) {
  const { user } = useAuthStore()
  const { uploadAadhaarFront, uploadAadhaarBack, uploadSelfie, uploadDrivingLicense, isLoading, error, clearError } =
    useProfileStore()

  const [documents, setDocuments] = useState<KYCDocument[]>([
    { type: "AADHAAR_FRONT", label: "Aadhaar Front Side", uri: null, uploaded: false },
    { type: "AADHAAR_BACK", label: "Aadhaar Back Side", uri: null, uploaded: false },
    { type: "SELFIE", label: "Selfie", uri: null, uploaded: false },
    { type: "DRIVING_LICENSE", label: "Driving License", uri: null, uploaded: false },
  ])

  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      const newDocuments = [...documents]
      newDocuments[index].uri = result.assets[0].uri
      setDocuments(newDocuments)
    }
  }

  const handleUploadDocument = async (index: number) => {
    const doc = documents[index]
    if (!doc.uri || !user) return

    try {
      if (doc.type === "AADHAAR_FRONT") {
        await uploadAadhaarFront(doc.uri, user.id)
      } else if (doc.type === "AADHAAR_BACK") {
        await uploadAadhaarBack(doc.uri, user.id)
      } else if (doc.type === "SELFIE") {
        await uploadSelfie(doc.uri, user.id)
      } else if (doc.type === "DRIVING_LICENSE") {
        await uploadDrivingLicense(doc.uri, user.id)
      }

      const newDocuments = [...documents]
      newDocuments[index].uploaded = true
      setDocuments(newDocuments)
    } catch (err: any) {
      console.log("Upload error:", err)
    }
  }

  const allUploaded = documents.every((doc) => doc.uploaded)

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Complete KYC</Text>
        <Text style={styles.subtitle}>Upload required documents to activate your account</Text>
      </View>

      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>
          Progress: {documents.filter((d) => d.uploaded).length}/{documents.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(documents.filter((d) => d.uploaded).length / documents.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {documents.map((doc, index) => (
        <View key={doc.type} style={styles.documentCard}>
          <View style={styles.documentHeader}>
            <Text style={styles.documentLabel}>{doc.label}</Text>
            {doc.uploaded && <Text style={styles.uploadedBadge}>✓ Uploaded</Text>}
          </View>

          {doc.uri && <Image source={{ uri: doc.uri }} style={styles.previewImage} />}

          <View style={styles.documentActions}>
            <TouchableOpacity style={styles.selectButton} onPress={() => pickImage(index)}>
              <Text style={styles.selectButtonText}>{doc.uri ? "Change Image" : "Select Image"}</Text>
            </TouchableOpacity>

            {doc.uri && !doc.uploaded && (
              <Button title="Upload" onPress={() => handleUploadDocument(index)} loading={isLoading} size="medium" />
            )}
          </View>
        </View>
      ))}

      {allUploaded && (
        <View style={styles.actionSection}>
          <Button title="Verify KYC" onPress={() => navigation.navigate("Profile")} loading={isLoading} />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    marginLeft: 20,
    marginTop: 20,
    width: 60,
  },
  backButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E5EA",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#34C759",
  },
  documentCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  documentLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  uploadedBadge: {
    fontSize: 12,
    color: "#34C759",
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  documentActions: {
    flexDirection: "row",
    gap: 8,
  },
  selectButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})
