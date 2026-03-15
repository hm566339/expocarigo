"use client"

import React, { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button } from "../../../components/ui/Button"
import InputField from "../../../components/ui/InputField"
import type { NavigationProp, RoutePropType } from "../../../navigation/types"
import { useBookingStore } from "../../../services/storage/store/booking.store"

interface RateOwnerScreenProps {
  navigation: NavigationProp<"Main">
  route: RoutePropType<"Main">
}

export default function RateOwnerScreen({ navigation, route }: RateOwnerScreenProps) {
  const { bookingId } = route.params
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const { isLoading } = useBookingStore()

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    // Mock submit review
    alert("Thank you for your review!")
    navigation.navigate("HomeTabs")
  }

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, rating >= star && styles.starActive]}>{rating >= star ? "★" : "☆"}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rate Your Experience</Text>
        <Text style={styles.subtitle}>Help us improve by sharing your feedback</Text>
      </View>

      <View style={styles.ratingCard}>
        <Text style={styles.cardTitle}>How would you rate the vehicle?</Text>
        {renderStars()}

        <InputField
          label="Comments (Optional)"
          placeholder="Tell us about your experience..."
          value={comment}
          onChangeText={setComment}
        />
      </View>

      <View style={styles.actionSection}>
        <Button title="Submit Review" onPress={handleSubmitReview} loading={isLoading} />
      </View>
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
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  ratingCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  star: {
    fontSize: 40,
    marginHorizontal: 8,
    color: "#ccc",
  },
  starActive: {
    color: "#FF9500",
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})
