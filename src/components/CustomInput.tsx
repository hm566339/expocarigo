"use client"

/**
 * Reusable Input Component with validation
 */

import type React from "react"
import { useState } from "react"
import { View, TextInput, Text, StyleSheet, TouchableOpacity, type TextInputProps } from "react-native"

interface CustomInputProps extends TextInputProps {
  label?: string
  error?: string
  isPassword?: boolean
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, error, isPassword = false, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholderTextColor="#999999"
          secureTextEntry={isPassword && !isPasswordVisible}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Text style={styles.eyeIconText}>{isPasswordVisible ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 8,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333333",
    backgroundColor: "#FFFFFF",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeIconText: {
    fontSize: 20,
  },
})
