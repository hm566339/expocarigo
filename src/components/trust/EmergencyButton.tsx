import React from "react"
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

interface EmergencyButtonProps {
  onPress?: () => void
  style?: object
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onPress, style }) => {
  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      Alert.alert("Emergency Help", "Contacting support team...\n\n24/7 Helpline: 1800-XXX-XXXX", [{ text: "OK" }])
    }
  }

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress} activeOpacity={0.8}>
      <Icon name="phone-alert" size={24} color="#FFFFFF" />
      <Text style={styles.text}>SOS</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    gap: 2,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
})
