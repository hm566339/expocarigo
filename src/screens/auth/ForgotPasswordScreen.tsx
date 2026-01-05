"use client"

import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { CustomButton } from "../../components/CustomButton"
import { CustomInput } from "../../components/CustomInput"
import { useAuth } from "../../context/AuthContext"
import { validators } from "../../utils/validation"

type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  OTPVerification: { email: string }
}

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<
    AuthStackParamList,
    "ForgotPassword"
  >
}

export const ForgotPasswordScreen: React.FC<
  ForgotPasswordScreenProps
> = ({ navigation }) => {
  const { sendOTP } = useAuth()

  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  /* ---------------- SEND OTP ---------------- */
  const handleSendOTP = async () => {
    console.log("📨 Send OTP clicked")

    // Validate email
    const emailError = validators.email(email)
    if (emailError) {
      console.log("❌ Email validation failed:", emailError)
      setError(emailError)
      return
    }

    if (loading) {
      console.log("⏳ Already sending OTP, skipping")
      return
    }

    const trimmedEmail = email.trim()
    console.log("📧 Sending OTP to:", trimmedEmail)

    setError("")
    setLoading(true)

    try {
      console.log("🚀 Calling sendOTP API...")
      const res = await sendOTP(trimmedEmail)
      console.log("✅ OTP API success response:", res)

      Alert.alert(
        "OTP Sent",
        "A verification code has been sent to your email.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("OTPVerification", {
                email: trimmedEmail,
              }),
          },
        ]
      )
    } catch (err: any) {
      console.log("❌ OTP API error:", err)

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send OTP"

      Alert.alert("Error", message)
    } finally {
      console.log("🔁 OTP flow finished")
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        {/* BACK */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your registered email and we’ll send you a verification
            code to reset your password.
          </Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          <CustomInput
            label="Email Address"
            placeholder="Enter your registered email"
            value={email}
            onChangeText={(text) => {
              console.log("✏️ Email input changed:", text)
              setEmail(text)
              setError("")
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />

          <CustomButton
            title="Send Verification Code"
            onPress={handleSendOTP}
            loading={loading}
            disabled={loading}
            style={styles.sendButton}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginLinkText}>
              Remember your password?{" "}
              <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    width: "100%",
  },
  sendButton: {
    marginTop: 8,
  },
  loginLink: {
    marginTop: 24,
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 14,
    color: "#666666",
  },
  loginLinkBold: {
    color: "#007AFF",
    fontWeight: "600",
  },
})
