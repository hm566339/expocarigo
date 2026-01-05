"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

export default function OwnerDashboardScreen({ navigation }: any) {
  const { colors } = useTheme()

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[styles.name, { color: colors.text }]}>Rahul!</Text>
        </View>
        <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.surface }]}>
          <Icon name="bell-outline" size={24} color={colors.text} />
          <View style={[styles.badge, { backgroundColor: colors.error }]} />
        </TouchableOpacity>
      </View>

      <View style={[styles.earningsCard, { backgroundColor: colors.primary }]}>
        <View style={styles.earningsHeader}>
          <View>
            <Text style={styles.earningsLabel}>This Month's Earnings</Text>
            <Text style={styles.earningsAmount}>₹24,500</Text>
          </View>
          <View style={[styles.trendBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Icon name="trending-up" size={16} color="#FFFFFF" />
            <Text style={styles.trendText}>+12%</Text>
          </View>
        </View>
        <View style={styles.earningsStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Active Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Trips</Text>
          <TouchableOpacity onPress={() => navigation.navigate("TripRequests")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.tripCard, { backgroundColor: colors.surface }]}>
          <View style={styles.tripHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tripCar, { color: colors.text }]}>Maruti Swift VXI</Text>
              <Text style={[styles.tripRenter, { color: colors.textSecondary }]}>Rented by: Priya Singh</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.success + "20" }]}>
              <Text style={[styles.statusText, { color: colors.success }]}>Active</Text>
            </View>
          </View>
          <View style={styles.tripDetails}>
            <View style={styles.tripDetail}>
              <Icon name="calendar" size={14} color={colors.textSecondary} />
              <Text style={[styles.tripDetailText, { color: colors.textSecondary }]}>15-17 Jan 2025</Text>
            </View>
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => navigation.navigate("LiveTracking", { tripId: "trip_1" })}
            >
              <Icon name="map-marker-path" size={16} color={colors.primary} />
              <Text style={[styles.trackText, { color: colors.primary }]}>Track</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tripCard, { backgroundColor: colors.surface }]}>
          <View style={styles.tripHeader}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.tripCar, { color: colors.text }]}>Hyundai i20 Sportz</Text>
              <Text style={[styles.tripRenter, { color: colors.textSecondary }]}>Rented by: Amit Kumar</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: colors.warning + "20" }]}>
              <Text style={[styles.statusText, { color: colors.warning }]}>Pending</Text>
            </View>
          </View>
          <View style={styles.tripDetails}>
            <View style={styles.tripDetail}>
              <Icon name="calendar" size={14} color={colors.textSecondary} />
              <Text style={[styles.tripDetailText, { color: colors.textSecondary }]}>18-20 Jan 2025</Text>
            </View>
            <TouchableOpacity style={styles.trackButton}>
              <Text style={[styles.trackText, { color: colors.primary }]}>Review</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[styles.alertCard, { backgroundColor: colors.warning + "10", borderColor: colors.warning }]}>
        <Icon name="alert" size={24} color={colors.warning} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.alertTitle, { color: colors.warning }]}>Action Required</Text>
          <Text style={[styles.alertText, { color: colors.warning }]}>Swift VXI insurance expires in 15 days</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate("My Cars", { screen: "AddCar" })}
        >
          <Icon name="car-plus" size={32} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.text }]}>Add New Car</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.surface }]}>
          <Icon name="chart-line" size={32} color={colors.secondary} />
          <Text style={[styles.actionText, { color: colors.text }]}>View Analytics</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  earningsCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
  },
  earningsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  earningsLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 8,
  },
  earningsAmount: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  trendText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  earningsStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  tripCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tripCar: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  tripRenter: {
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  tripDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tripDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tripDetailText: {
    fontSize: 12,
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trackText: {
    fontSize: 13,
    fontWeight: "600",
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  alertText: {
    fontSize: 12,
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
})
