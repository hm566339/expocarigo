/**
 * OTP Verification Screen
 * Handles OTP verification and password reset
 */

import type { RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useEffect, useRef, useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
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

type OTPVerificationScreenProps = {
  navigation: NativeStackNavigationProp<
    AuthStackParamList,
    "OTPVerification"
  >
  route: RouteProp<AuthStackParamList, "OTPVerification">
}

export const OTPVerificationScreen: React.FC<
  OTPVerificationScreenProps
> = ({ navigation, route }) => {
  const { verifyOTP, sendOTP } = useAuth()
  const { email } = route.params

  const [otp, setOTP] = useState<string[]>(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)

  const otpRefs = useRef<Array<TextInput | null>>([])

  /* ---------- RESEND TIMER ---------- */
  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setTimeout(
      () => setResendTimer((prev) => prev - 1),
      1000
    )
    return () => clearTimeout(timer)
  }, [resendTimer])

  /* ---------- OTP CHANGE ---------- */
  const handleOTPChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return // allow only 1 digit

    const updatedOTP = [...otp]
    updatedOTP[index] = text
    setOTP(updatedOTP)

    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }))
    }

    if (text && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  /* ---------- BACKSPACE ---------- */
  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  /* ---------- VALIDATION ---------- */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const otpValue = otp.join("")
    const otpError = validators.otp(otpValue)
    if (otpError) newErrors.otp = otpError

    const passwordError = validators.password(newPassword)
    if (passwordError) newErrors.password = passwordError

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ---------- RESET PASSWORD ---------- */
  const handleResetPassword = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await verifyOTP({
        email,
        otp: otp.join(""),
        newPassword,
      })

      Alert.alert("Success", "Password reset successful", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ])
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "OTP verification failed"
      )
    } finally {
      setLoading(false)
    }
  }

  /* ---------- RESEND OTP ---------- */
  const handleResendOTP = async () => {
    try {
      await sendOTP(email)
      setResendTimer(60)
      Alert.alert("Success", "OTP sent to your email")
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to resend OTP"
      )
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.icon}>✉️</Text>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to{"\n"}
            <Text style={styles.email}>{email}</Text>
          </Text>
        </View>

        {/* OTP INPUT */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => (otpRefs.current[index] = el)}
              style={[
                styles.otpInput,
                errors.otp && styles.otpInputError,
              ]}
              value={digit}
              onChangeText={(text) =>
                handleOTPChange(text, index)
              }
              onKeyPress={({ nativeEvent }) =>
                handleOTPKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {errors.otp && (
          <Text style={styles.errorText}>{errors.otp}</Text>
        )}

        {/* RESEND */}
        <View style={styles.resendContainer}>
          {resendTimer > 0 ? (
            <Text style={styles.resendTimer}>
              Resend code in {resendTimer}s
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={loading}
            >
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* PASSWORD */}
        <CustomInput
          label="New Password"
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          isPassword
          error={errors.password}
        />

        <CustomInput
          label="Confirm Password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          isPassword
          error={errors.confirmPassword}
        />

        <CustomButton
          title="Reset Password"
          onPress={handleResetPassword}
          loading={loading}
          style={styles.submitButton}
        />
      </View>
    </KeyboardAvoidingView>
  )
}


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
    marginBottom: 40,
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
  email: {
    fontWeight: "600",
    color: "#007AFF",
  },
  form: {
    width: "100%",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  otpInput: {
    width: 50,
    height: 56,
    borderWidth: 1.5,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
  },
  otpInputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  resendTimer: {
    fontSize: 14,
    color: "#999999",
  },
  resendText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 8,
  },
})
