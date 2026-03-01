"use client"
import React from "react"
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

export default function HelpAndSupportScreen({ navigation }: any) {
  const { colors } = useTheme()

  const helpOptions = [
    { icon: "phone", title: "24/7 Helpline", subtitle: "1800-XXX-XXXX", action: "tel:1800XXXXXXX" },
    { icon: "email", title: "Email Support", subtitle: "support@carigo.com", action: "mailto:support@carigo.com" },
    { icon: "message-text", title: "Live Chat", subtitle: "Chat with our team", action: "chat" },
    { icon: "frequently-asked-questions", title: "FAQs", subtitle: "Find answers", action: "faq" },
  ]

  const handleAction = (action: string) => {
    if (action.startsWith("tel:") || action.startsWith("mailto:")) {
      Linking.openURL(action)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.emergencyCard, { backgroundColor: "#FEE2E2" }]}>
          <Icon name="alert-circle" size={32} color="#EF4444" />
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Emergency Help</Text>
            <Text style={styles.emergencyText}>For urgent assistance during trips, use the SOS button in the app</Text>
          </View>
        </View>

        {helpOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionCard, { backgroundColor: colors.surface }]}
            onPress={() => handleAction(option.action)}
          >
            <View style={[styles.optionIcon, { backgroundColor: colors.primary + "20" }]}>
              <Icon name={option.icon} size={24} color={colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>{option.title}</Text>
              <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>{option.subtitle}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Help Topics</Text>
          {["How to book a car", "Payment issues", "Cancel or modify booking", "Report damage"].map((topic, index) => (
            <TouchableOpacity key={index} style={[styles.topicCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.topicText, { color: colors.text }]}>{topic}</Text>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  emergencyCard: {
    flexDirection: "row",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    alignItems: "center",
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  emergencyText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },
  optionCard: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 12,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  topicCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  topicText: {
    fontSize: 14,
    fontWeight: "500",
  },
})
