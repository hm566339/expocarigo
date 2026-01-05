"use client"

import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"

import { useTheme } from "../../context/ThemeContext"
import { InputField } from "../../components/owner-profile"
import { useAuth } from "../../context/AuthContext"
import CarOwnerService from "../../services/api/car-owner.service"

/* ================= BLOOD GROUP OPTIONS ================= */
const BLOOD_GROUP_OPTIONS = [
  { label: "A+", value: "A_POSITIVE" },
  { label: "A−", value: "A_NEGATIVE" },
  { label: "B+", value: "B_POSITIVE" },
  { label: "B−", value: "B_NEGATIVE" },
  { label: "AB+", value: "AB_POSITIVE" },
  { label: "AB−", value: "AB_NEGATIVE" },
  { label: "O+", value: "O_POSITIVE" },
  { label: "O−", value: "O_NEGATIVE" },
]

export const UpdateCarOwnerProfileScreen = ({ navigation }: any) => {
  const { colors } = useTheme()
  const { user } = useAuth()

  const ownerId = user?.id
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    phone: "",
    address: "",
    aadhaarNumber: "",
    drivingLicenseNumber: "",
    bloodGroup: "", // ENUM VALUE
  })

  /* ---------- FORM VALIDATION ---------- */
  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.bloodGroup.length > 0

  /* ---------- LOAD PROFILE ---------- */
  useEffect(() => {
    if (!ownerId) return

    setLoading(true)
    CarOwnerService
      .getOwner(ownerId.toString())
      .then(owner => {
        setFormData({
          name: owner.name || "",
          email: owner.email || "",
          dob: owner.dob || "",
          phone: owner.phone || "",
          address: owner.address || "",
          aadhaarNumber: owner.aadhaarNumber || "",
          drivingLicenseNumber: owner.drivingLicenseNumber || "",
          bloodGroup: owner.bloodGroup || "",
        })
      })
      .catch(err => console.log("Load owner failed:", err))
      .finally(() => setLoading(false))
  }, [ownerId])

  /* ---------- SAVE PROFILE ---------- */
  const handleSave = async () => {
    if (!ownerId || !isFormValid) return

    setLoading(true)
    try {
      await CarOwnerService.updateProfile(
        ownerId.toString(),
        formData
      )
      navigation.goBack()
    } catch (err) {
      console.log("Update failed:", err)
    } finally {
      setLoading(false)
    }
  }

  /* ---------- AUTH GUARD ---------- */
  if (!ownerId) {
    return (
      <View style={styles.center}>
        <Text>User not authenticated</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Update Profile
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Edit your personal information
          </Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="Full Name"
            value={formData.name}
            onChangeText={text => setFormData({ ...formData, name: text })}
            required
          />

          <InputField
            label="Email"
            value={formData.email}
            onChangeText={text => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            required
          />

          <InputField
            label="Date of Birth"
            value={formData.dob}
            onChangeText={text => setFormData({ ...formData, dob: text })}
            placeholder="YYYY-MM-DD"
          />

          <InputField
            label="Phone"
            value={formData.phone}
            onChangeText={text => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />

          <InputField
            label="Address"
            value={formData.address}
            onChangeText={text => setFormData({ ...formData, address: text })}
            multiline
          />

          <InputField
            label="Aadhaar Number"
            value={formData.aadhaarNumber}
            onChangeText={text =>
              setFormData({ ...formData, aadhaarNumber: text })
            }
            keyboardType="numeric"
          />

          <InputField
            label="Driving License Number"
            value={formData.drivingLicenseNumber}
            onChangeText={text =>
              setFormData({ ...formData, drivingLicenseNumber: text })
            }
          />

          {/* ---------- BLOOD GROUP (ENUM SAFE) ---------- */}
          <Text style={[styles.label, { color: colors.text }]}>
            Blood Group
          </Text>

          <View style={styles.bloodGroupContainer}>
            {BLOOD_GROUP_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.bloodGroupChip,
                  {
                    backgroundColor:
                      formData.bloodGroup === option.value
                        ? colors.primary
                        : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() =>
                  setFormData({ ...formData, bloodGroup: option.value })
                }
              >
                <Text
                  style={{
                    color:
                      formData.bloodGroup === option.value
                        ? "#fff"
                        : colors.text,
                    fontWeight: "600",
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: colors.primary,
              opacity: isFormValid && !loading ? 1 : 0.5,
            },
          ]}
          onPress={handleSave}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 15 },
  form: { marginBottom: 20 },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  bloodGroupContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
    marginBottom: 10,
  },

  bloodGroupChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },

  footer: { padding: 20, borderTopWidth: 1 },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
