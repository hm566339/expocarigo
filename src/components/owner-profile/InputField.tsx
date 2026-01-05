"use client"

import type React from "react"
import { View, TextInput, Text, StyleSheet } from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface InputFieldProps {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad"
  secureTextEntry?: boolean
  error?: string
  maxLength?: number
  multiline?: boolean
  numberOfLines?: number
  editable?: boolean
  required?: boolean
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  secureTextEntry = false,
  error,
  maxLength,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  required = false,
}) => {
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      </View>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          {
            backgroundColor: editable ? colors.surface : colors.surfaceVariant,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
            opacity: editable ? 1 : 0.6,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        textAlignVertical={multiline ? "top" : "center"}
      />
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 15,
  },
  multiline: {
    minHeight: 100,
    paddingTop: 14,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
})
