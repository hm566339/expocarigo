"use client"

// Rating Screen - Allow renters to rate car owners after a ride
import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native"
import { useAuth } from "../../context/AuthContext"
import RenterService from "../../services/api/renter.service"
import type { RenterRatingRequest } from "../../types/renter.types"

interface RatingScreenProps {
  route?: {
    params?: {
      ownerId?: string
      ownerName?: string
    }
  }
  navigation?: any
}

const RatingScreen: React.FC<RatingScreenProps> = ({ route, navigation }) => {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get owner details from navigation params (passed from booking screen)
  const ownerId = route?.params?.ownerId || ""
  const ownerName = route?.params?.ownerName || "Car Owner"

  const handleRatingPress = (value: number) => {
    setRating(value)
  }

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert("Error", "User not logged in")
      return
    }

    if (rating === 0) {
      Alert.alert("Validation Error", "Please select a rating")
      return
    }

    if (!ownerId) {
      Alert.alert("Error", "Owner information not found")
      return
    }

    setIsSubmitting(true)
    try {
      const ratingData: RenterRatingRequest = {
        rating,
        comment: comment.trim() || undefined,
        ownerId,
      }

      const response = await RenterService.addRating(user.id, ratingData)

      Alert.alert("Success", response.message || "Rating submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            if (navigation) {
              navigation.goBack()
            }
          },
        },
      ])

      // Reset form
      setRating(0)
      setComment("")
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to submit rating")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingText = (value: number) => {
    switch (value) {
      case 1:
        return "Poor"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Very Good"
      case 5:
        return "Excellent"
      default:
        return "Select Rating"
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Rate Your Experience</Text>
        <Text style={styles.subtitle}>How was your ride with {ownerName}?</Text>
      </View>

      {/* Star Rating */}
      <View style={styles.ratingContainer}>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleRatingPress(star)} disabled={isSubmitting}>
              <Text style={[styles.star, rating >= star && styles.starSelected]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>{getRatingText(rating)}</Text>
      </View>

      {/* Comment Section */}
      <View style={styles.commentSection}>
        <Text style={styles.label}>Additional Comments (Optional)</Text>
        <TextInput
          style={styles.textArea}
          value={comment}
          onChangeText={setComment}
          placeholder="Share your experience with other renters..."
          multiline
          numberOfLines={5}
          maxLength={500}
          editable={!isSubmitting}
        />
        <Text style={styles.charCount}>{comment.length}/500</Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, (rating === 0 || isSubmitting) && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={rating === 0 || isSubmitting}
      >
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit Rating</Text>}
      </TouchableOpacity>

      {/* Rating Guidelines */}
      <View style={styles.guidelinesContainer}>
        <Text style={styles.guidelinesTitle}>Rating Guidelines</Text>
        <Text style={styles.guidelineItem}>⭐ 1 Star - Very poor experience</Text>
        <Text style={styles.guidelineItem}>⭐⭐ 2 Stars - Below expectations</Text>
        <Text style={styles.guidelineItem}>⭐⭐⭐ 3 Stars - Met expectations</Text>
        <Text style={styles.guidelineItem}>⭐⭐⭐⭐ 4 Stars - Exceeded expectations</Text>
        <Text style={styles.guidelineItem}>⭐⭐⭐⭐⭐ 5 Stars - Outstanding experience</Text>
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
  header: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  ratingContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  star: {
    fontSize: 48,
    color: "#E0E0E0",
    marginHorizontal: 4,
  },
  starSelected: {
    color: "#FFB300",
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  commentSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  guidelinesContainer: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  guidelineItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    lineHeight: 20,
  },
})

export default RatingScreen
