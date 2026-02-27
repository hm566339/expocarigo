"use client"

import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { useTheme } from "../../context/ThemeContext"
import CarOwnerService from "../../services/api/car-owner.service"
import type { DashboardData } from "../../types/owner.types"

export default function OwnerDashboard() {
  const { colors } = useTheme()

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(40)).current

  useEffect(() => {
    loadDashboard()
  }, [])

  useEffect(() => {
    if (data) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [data])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const res = await CarOwnerService.getDashboard()
      setData(res)
    } catch (e) {
      console.log("Dashboard error", e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadDashboard()
  }

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
          Loading dashboard…
        </Text>
      </View>
    )
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text style={{ color: colors.textSecondary }}>
          No dashboard data found
        </Text>
      </View>
    )
  }

  const { owner, earnings, bookingStats, vehicleStats, alerts } = data

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* ---------- HEADER ---------- */}
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View>
          <Text style={{ color: colors.textSecondary }}>Welcome 👋</Text>
          <Text style={[styles.name, { color: colors.text }]}>
            {owner.name}
          </Text>
          <Text style={{ color: colors.primary, fontWeight: "600", marginTop: 4 }}>
            KYC: {owner.kycStatus}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.bell, { backgroundColor: colors.primary }]}
        >
          <MaterialCommunityIcons name="bell-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* ---------- EARNINGS ---------- */}
      <Animated.View
        style={[
          styles.earningsCard,
          {
            backgroundColor: colors.primary,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.earningsLabel}>This Month</Text>
        <Text style={styles.earningsAmount}>
          ₹{earnings.thisMonth}
        </Text>

        <View style={styles.earningsRow}>
          <MiniEarning label="Today" value={earnings.today} icon="weather-sunny" />
          <MiniEarning label="Wallet" value={earnings.walletBalance} icon="wallet" />
          <MiniEarning label="Lifetime" value={earnings.lifetime} icon="chart-line" />
        </View>
      </Animated.View>

      {/* ---------- SECTIONS ---------- */}
      <Section title="Trip Analytics" colors={colors} fadeAnim={fadeAnim} slideAnim={slideAnim}>
        <MiniStat icon="map-marker-path" label="Total" value={bookingStats.total} />
        <MiniStat icon="play-circle" label="Ongoing" value={bookingStats.ongoing} />
        <MiniStat icon="check-circle" label="Completed" value={bookingStats.completed} />
        <MiniStat icon="clock-outline" label="Upcoming" value={bookingStats.upcoming} />
        <MiniStat icon="close-circle" label="Cancelled" value={bookingStats.cancelled} />
        <MiniStat icon="alert-circle" label="Disputed" value={bookingStats.disputed} />
      </Section>

      <Section title="Vehicle Fleet" colors={colors} fadeAnim={fadeAnim} slideAnim={slideAnim}>
        <MiniStat icon="car" label="Total" value={vehicleStats.total} />
        <MiniStat icon="car-check" label="Active" value={vehicleStats.active} />
        <MiniStat icon="file-document" label="KYC Pending" value={vehicleStats.pendingKyc} />
        <MiniStat icon="alert-circle" label="Blocked" value={vehicleStats.blocked} />
      </Section>

      <Section title="Alerts Overview" colors={colors} fadeAnim={fadeAnim} slideAnim={slideAnim}>
        <MiniStat icon="shield-alert" label="Insurance" value={alerts.insuranceExpiring} />
        <MiniStat icon="badge-account" label="Vehicle KYC" value={alerts.vehicleKycPending} />
        <MiniStat icon="cash-clock" label="Payouts" value={alerts.payoutPending} />
        <MiniStat icon="alert-octagon" label="Disputes" value={alerts.disputes} />
      </Section>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

/* ---------- COMPONENTS ---------- */

const Section = ({ title, children, colors, fadeAnim, slideAnim }: any) => (
  <Animated.View
    style={{
      paddingHorizontal: 20,
      marginBottom: 24,
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    }}
  >
    <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: 12 }}>
      {title}
    </Text>

    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  </Animated.View>
)

const MiniEarning = ({ label, value, icon }: any) => (
  <View style={styles.earningItem}>
    <MaterialCommunityIcons name={icon} size={18} color="#fff" />
    <Text style={styles.earningValue}>₹{value}</Text>
    <Text style={styles.earningLabel}>{label}</Text>
  </View>
)

const MiniStat = ({ icon, label, value }: any) => {
  const { colors } = useTheme()

  return (
    <View style={styles.miniStat}>
      <View style={[styles.miniIcon, { backgroundColor: colors.primary + "20" }]}>
        <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={[styles.miniValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  )
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: { fontSize: 26, fontWeight: "800" },

  bell: { padding: 10, borderRadius: 12 },

  earningsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 18,
    padding: 20,
  },
  earningsLabel: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
  earningsAmount: { fontSize: 38, fontWeight: "800", color: "#fff", marginVertical: 12 },
  earningsRow: { flexDirection: "row", justifyContent: "space-between" },

  earningItem: { alignItems: "center", flex: 1 },
  earningValue: { color: "#fff", fontWeight: "700", marginTop: 6 },
  earningLabel: { color: "rgba(255,255,255,0.7)", fontSize: 11 },

  miniStat: { width: "33.33%", alignItems: "center", marginBottom: 16 },
  miniIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  miniValue: { fontSize: 18, fontWeight: "800" },
  miniLabel: { fontSize: 11, fontWeight: "600" },
})
