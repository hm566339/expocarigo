import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useEffect, useRef, useState } from "react"
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"

import { useTheme } from "../../../context/ThemeContext"
import RenterService from "../../../services/api/renter.service"

export default function RenterDashboard() {
  const { colors } = useTheme()

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState("")

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    fetchDashboard()
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

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const res = await RenterService.getDashboard()
      setData(res)
    } catch (e) {
      console.log("Renter dashboard error", e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

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

  const {
    renterName,
    kycStatus,
    bookingStats,
    spending,
    averageRating,
    totalBookings,
  } = data

  /* 🔍 SEARCH FILTER */
  const filter = (label: string) =>
    label.toLowerCase().includes(search.toLowerCase())

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchDashboard} />
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
        <Text style={[styles.name, { color: colors.text }]}>
          Hi, {renterName} 👋
        </Text>
        <Text
          style={[
            styles.kyc,
            { color: kycStatus === "COMPLETED" ? colors.success : colors.warning },
          ]}
        >
          KYC: {kycStatus}
        </Text>
      </Animated.View>

      {/* ---------- SEARCH ---------- */}
      <View
        style={[
          styles.searchBox,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <TextInput
          placeholder="Search stats (e.g. completed, rating...)"
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          style={{ color: colors.text }}
        />
      </View>

      {/* ---------- SPENDING ---------- */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.primary,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.cardLabel}>Your Spending</Text>
        <Text style={styles.cardValue}>₹{spending.thisMonth}</Text>

        <View style={styles.cardRow}>
          <MiniStat label="Lifetime" value={`₹${spending.lifetime}`} />
          <MiniStat label="Rating" value={averageRating || "N/A"} />
        </View>
      </Animated.View>

      {/* ---------- MY TRIPS ---------- */}
      <Section title="My Trips" colors={colors} fade={fadeAnim} slide={slideAnim}>
        {filter("total") && <StatBox icon="map-marker-path" label="Total" value={bookingStats.total} colors={colors} />}
        {filter("ongoing") && <StatBox icon="play-circle" label="Ongoing" value={bookingStats.ongoing} colors={colors} />}
        {filter("upcoming") && <StatBox icon="clock-outline" label="Upcoming" value={bookingStats.upcoming} colors={colors} />}
        {filter("completed") && <StatBox icon="check-circle" label="Completed" value={bookingStats.completed} colors={colors} />}
        {filter("cancelled") && <StatBox icon="close-circle" label="Cancelled" value={bookingStats.cancelled} colors={colors} />}
        {filter("disputed") && <StatBox icon="alert-circle" label="Disputed" value={bookingStats.disputed} colors={colors} />}
      </Section>

      {/* ---------- SUMMARY ---------- */}
      <Section title="Summary" colors={colors} fade={fadeAnim} slide={slideAnim}>
        {filter("month") && <StatBox icon="cash" label="This Month" value={`₹${spending.thisMonth}`} colors={colors} />}
        {filter("lifetime") && <StatBox icon="cash-multiple" label="Lifetime Spend" value={`₹${spending.lifetime}`} colors={colors} />}
        {filter("rating") && <StatBox icon="star" label="Rating" value={averageRating || "N/A"} colors={colors} />}
        {filter("booking") && <StatBox icon="clipboard-text" label="Total Bookings" value={totalBookings} colors={colors} />}
      </Section>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

/* ---------- COMPONENTS ---------- */

const Section = ({ title, children, colors, fade, slide }: any) => (
  <Animated.View
    style={{
      paddingHorizontal: 20,
      marginBottom: 24,
      opacity: fade,
      transform: [{ translateY: slide }],
    }}
  >
    <Text style={{ fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: 12 }}>
      {title}
    </Text>

    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {children}
    </View>
  </Animated.View>
)

const StatBox = ({ icon, label, value, colors }: any) => (
  <View style={styles.statBox}>
    <MaterialCommunityIcons name={icon} size={22} color={colors.primary} />
    <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
  </View>
)

const MiniStat = ({ label, value }: any) => (
  <View style={{ alignItems: "center" }}>
    <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>{label}</Text>
    <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>{value}</Text>
  </View>
)

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  name: { fontSize: 26, fontWeight: "800" },
  kyc: { fontSize: 13, marginTop: 4, fontWeight: "600" },

  searchBox: {
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 18,
    padding: 20,
  },
  cardLabel: { color: "rgba(255,255,255,0.85)", fontSize: 13 },
  cardValue: { fontSize: 36, fontWeight: "800", color: "#fff", marginVertical: 12 },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  statBox: {
    width: "33.33%",
    alignItems: "center",
    marginBottom: 16,
  },
  statValue: { fontSize: 18, fontWeight: "800", marginTop: 4 },
  statLabel: { fontSize: 11, marginTop: 2 },
})
