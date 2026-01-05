"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

export default function TermsAndPoliciesScreen({ navigation }: any) {
  const { colors } = useTheme()
  const [activeTab, setActiveTab] = useState("terms")

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Terms & Policies</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "terms" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab("terms")}
        >
          <Text style={[styles.tabText, { color: activeTab === "terms" ? colors.primary : colors.textSecondary }]}>
            Terms of Service
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "privacy" && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          onPress={() => setActiveTab("privacy")}
        >
          <Text style={[styles.tabText, { color: activeTab === "privacy" ? colors.primary : colors.textSecondary }]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === "terms" ? (
          <View style={styles.textContent}>
            <Text style={[styles.contentTitle, { color: colors.text }]}>Terms of Service</Text>
            <Text style={[styles.contentText, { color: colors.textSecondary }]}>
              Welcome to CARIGO. By using our peer-to-peer car sharing platform, you agree to these terms and
              conditions.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>1. Acceptance of Terms</Text>
              {"\n"}
              By accessing and using CARIGO, you accept and agree to be bound by the terms and provision of this
              agreement.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>2. User Responsibilities</Text>
              {"\n"}
              Users must provide accurate information, maintain the security of their account, and comply with all
              applicable laws and regulations.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>3. Vehicle Usage</Text>
              {"\n"}
              Renters must treat vehicles with care, follow all traffic laws, and return vehicles in the same condition
              as received.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>4. Insurance and Liability</Text>
              {"\n"}
              All trips are covered by our comprehensive insurance policy. Users must report any accidents or damages
              immediately.
            </Text>
          </View>
        ) : (
          <View style={styles.textContent}>
            <Text style={[styles.contentTitle, { color: colors.text }]}>Privacy Policy</Text>
            <Text style={[styles.contentText, { color: colors.textSecondary }]}>
              CARIGO is committed to protecting your privacy and personal information.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>1. Information Collection</Text>
              {"\n"}
              We collect personal information including name, contact details, KYC documents, and location data to
              provide our services.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>2. Information Usage</Text>
              {"\n"}
              Your information is used to facilitate bookings, verify identities, process payments, and improve our
              services.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>3. Data Security</Text>
              {"\n"}
              We implement industry-standard security measures to protect your personal information from unauthorized
              access.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>4. Data Sharing</Text>
              {"\n"}
              We do not sell your personal information. Data is only shared with other users as necessary for trip
              completion and with service providers.
            </Text>
          </View>
        )}
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
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  textContent: {
    padding: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
  },
})
