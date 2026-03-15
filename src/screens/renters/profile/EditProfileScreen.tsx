"use client"

import React, { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Button } from "../../../components/ui/Button"
import ErrorBanner from "../../../components/ui/ErrorBanner"
import InputField from "../../../components/ui/InputField"
import type { NavigationProp } from "../../../navigation/types"
import { useAuthStore } from "../../../services/storage/store/auth.store"
import { useProfileStore } from "../../../services/storage/store/profile.store"

interface EditProfileScreenProps {
  navigation: NavigationProp<"Main">
}

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const { user } = useAuthStore()
  const { updateProfile, isLoading, error, clearError } = useProfileStore()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")

  useEffect(() => {
    if (user) {
      setFirstName(user.name?.split(" ")[0] || "")
      setLastName(user.name?.split(" ").slice(1).join(" ") || "")
      setPhone(user.phone || "")
    }
  }, [user])

  const handleSave = async () => {
    if (!firstName || !lastName || !phone) {
      alert("Please fill in all fields")
      return
    }

    try {
      await updateProfile({
        name: `${firstName} ${lastName}`,
        phone,
      })
      alert("Profile updated successfully")
      navigation.goBack()
    } catch (err: any) {
      console.log("Update error:", err)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      <View style={styles.formCard}>
        <InputField label="First Name" placeholder="John" value={firstName} onChangeText={setFirstName} />

        <InputField label="Last Name" placeholder="Doe" value={lastName} onChangeText={setLastName} />

        <InputField
          label="Phone Number"
          placeholder="+91 XXXXX XXXXX"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.actionSection}>
        <Button title="Save Changes" onPress={handleSave} loading={isLoading} />
      </View>
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
  formCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})
