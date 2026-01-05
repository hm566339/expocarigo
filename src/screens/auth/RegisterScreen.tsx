/**
 * Register Screen
 * Allows new users to create an account
 */

import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import React, { useState } from "react"
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { CustomButton } from "../../components/CustomButton"
import { CustomInput } from "../../components/CustomInput"
import { useAuth } from "../../context/AuthContext"
import type { UserRole } from "../../types/auth.types"
import { validators } from "../../utils/validation"

type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  OTPVerification: { email: string }
}

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "REANT" as UserRole, // ✅ BACKEND ENUM MATCH
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  /* ---------------- validation ---------------- */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    const nameError = validators.name(formData.name)
    if (nameError) newErrors.name = nameError

    const emailError = validators.email(formData.email)
    if (emailError) newErrors.email = emailError

    const passwordError = validators.password(formData.password)
    if (passwordError) newErrors.password = passwordError

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* ---------------- submit ---------------- */
  const handleRegister = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      // ✅ SUCCESS MESSAGE
      Alert.alert(
        "Success",
        "User registered successfully. Please login.",
        [
          {
            text: "OK",
            onPress: () => navigation.replace("Login"),
          },
        ]
      )
    } catch (error) {
      Alert.alert("Registration Failed", (error as Error).message)
    } finally {
      setLoading(false)
    }
  }


  const handleRoleSelect = (role: UserRole) => {
    setFormData((prev) => ({ ...prev, role }))
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join CARIGO and start sharing cars</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) =>
              setFormData((p) => ({ ...p, name: text }))
            }
            error={errors.name}
          />

          <CustomInput
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) =>
              setFormData((p) => ({ ...p, email: text }))
            }
            keyboardType="email-address"
            error={errors.email}
          />

          <CustomInput
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(text) =>
              setFormData((p) => ({ ...p, password: text }))
            }
            isPassword
            error={errors.password}
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData((p) => ({ ...p, confirmPassword: text }))
            }
            isPassword
            error={errors.confirmPassword}
          />

          {/* -------- Role Selection -------- */}
          <View style={styles.roleContainer}>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === "REANT" && styles.roleButtonActive,
                ]}
                onPress={() => handleRoleSelect("REANT")}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    formData.role === "REANT" && styles.roleButtonTextActive,
                  ]}
                >
                  Rent Cars
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  formData.role === "OWNER" && styles.roleButtonActive,
                ]}
                onPress={() => handleRoleSelect("OWNER")}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    formData.role === "OWNER" && styles.roleButtonTextActive,
                  ]}
                >
                  Share My Car
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <CustomButton
            title="Sign Up"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginLinkText}>
              Already have an account?{" "}
              <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
  },
  form: {
    flex: 1,
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#DDDDDD",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  roleButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
  },
  roleButtonTextActive: {
    color: "#FFFFFF",
  },
  registerButton: {
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
