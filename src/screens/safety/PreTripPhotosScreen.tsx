"use client"

import { useNavigation, useRoute } from "@react-navigation/native"
import React, { useState } from "react"
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { PreTripPhoto } from "../../types/safety.types"

const { width } = Dimensions.get("window")
const photoSize = (width - 48) / 2

const PHOTO_CATEGORIES = [
  { type: "front", label: "Front View", icon: "🚗" },
  { type: "back", label: "Back View", icon: "🚙" },
  { type: "left", label: "Left Side", icon: "←" },
  { type: "right", label: "Right Side", icon: "→" },
  { type: "dashboard", label: "Dashboard", icon: "📊" },
  { type: "odometer", label: "Odometer", icon: "🔢" },
  { type: "fuel_gauge", label: "Fuel Gauge", icon: "⛽" },
  { type: "interior", label: "Interior", icon: "🪑" },
] as const

const PreTripPhotosScreen: React.FC = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const { bookingId } = route.params as { bookingId: string }

  const [photos, setPhotos] = useState<PreTripPhoto[]>([])

  const handleAddPhoto = (photoType: (typeof PHOTO_CATEGORIES)[number]["type"]) => {
    // In production, use react-native-image-picker
    Alert.alert("Select Photo Source", "Choose how to add the photo", [
      {
        text: "Camera",
        onPress: () => simulatePhotoCapture(photoType),
      },
      {
        text: "Gallery",
        onPress: () => simulatePhotoCapture(photoType),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ])
  }

  const simulatePhotoCapture = (photoType: (typeof PHOTO_CATEGORIES)[number]["type"]) => {
    // Simulate photo capture with placeholder
    const newPhoto: PreTripPhoto = {
      id: Date.now().toString(),
      photoUri: `https://placeholder.com/400x300?text=${photoType}`,
      photoType,
      timestamp: new Date().toISOString(),
    }

    setPhotos((prev) => {
      // Replace existing photo of same type or add new
      const filtered = prev.filter((p) => p.photoType !== photoType)
      return [...filtered, newPhoto]
    })

    Alert.alert("Success", "Photo added successfully!")
  }

  const handleRemovePhoto = (photoId: string) => {
    Alert.alert("Remove Photo", "Are you sure you want to remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          setPhotos((prev) => prev.filter((p) => p.id !== photoId))
        },
      },
    ])
  }

  const handleSubmit = () => {
    if (photos.length < 4) {
      Alert.alert("Incomplete", "Please upload at least 4 photos to continue")
      return
    }

    Alert.alert("Photos Uploaded", "Pre-trip photos saved successfully!", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ])
  }

  const getPhotoForType = (photoType: string) => {
    return photos.find((p) => p.photoType === photoType)
  }

  const completedCount = photos.length
  const totalRequired = 8

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Progress Header */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Pre-Trip Documentation</Text>
          <Text style={styles.progressText}>
            {completedCount} of {totalRequired} photos taken
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(completedCount / totalRequired) * 100}%` }]} />
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>💡</Text>
          <Text style={styles.infoBannerText}>
            Take clear photos from all angles. This helps protect both you and the owner.
          </Text>
        </View>

        {/* Photo Grid */}
        <View style={styles.photoGrid}>
          {PHOTO_CATEGORIES.map((category) => {
            const photo = getPhotoForType(category.type)
            return (
              <View key={category.type} style={styles.photoCard}>
                <TouchableOpacity style={styles.photoButton} onPress={() => handleAddPhoto(category.type)}>
                  {photo ? (
                    <View style={styles.photoPreview}>
                      <Image source={{ uri: photo.photoUri }} style={styles.photoImage} resizeMode="cover" />
                      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemovePhoto(photo.id!)}>
                        <Text style={styles.removeButtonText}>×</Text>
                      </TouchableOpacity>
                      <View style={styles.photoCheckmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Text style={styles.photoIcon}>{category.icon}</Text>
                      <Text style={styles.addPhotoText}>Tap to Add</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text style={styles.photoLabel}>{category.label}</Text>
              </View>
            )
          })}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Photo Tips</Text>
          <Tip text="Ensure good lighting for clear photos" />
          <Tip text="Capture any existing scratches or damage" />
          <Tip text="Get close-up shots of important details" />
          <Tip text="Make sure license plates are visible" />
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, completedCount < 4 && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={completedCount < 4}
        >
          <Text style={styles.submitButtonText}>
            {completedCount < 4 ? `Add ${4 - completedCount} More Photos` : "Complete Documentation"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const Tip: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.tipItem}>
    <Text style={styles.tipIcon}>•</Text>
    <Text style={styles.tipText}>{text}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  progressSection: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2196F3",
    borderRadius: 4,
  },
  infoBanner: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  infoBannerIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: "#1565c0",
    lineHeight: 20,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 16,
  },
  photoCard: {
    width: photoSize,
  },
  photoButton: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 8,
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  photoCheckmark: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#4caf50",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  photoIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  addPhotoText: {
    fontSize: 12,
    color: "#9e9e9e",
    fontWeight: "600",
  },
  photoLabel: {
    fontSize: 13,
    color: "#424242",
    textAlign: "center",
    fontWeight: "500",
  },
  tipsSection: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 16,
    color: "#2196F3",
    marginRight: 8,
    fontWeight: "700",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#757575",
    lineHeight: 20,
  },
  footer: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#bdbdbd",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
})

export default PreTripPhotosScreen
