import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ErrorBannerProps {
  message: string
  onDismiss: () => void
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle" size={20} color="#FF3B30" />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity onPress={onDismiss}>
        <Ionicons name="close" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFE5E5",
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  message: {
    flex: 1,
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "500",
  },
})
