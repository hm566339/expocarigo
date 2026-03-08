"use client"

import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

export default function LiveTrackingScreen({ navigation }: any) {
  const { colors } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Live Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mapPlaceholder}>
        <Icon name="map" size={80} color={colors.textTertiary} />
        <Text style={[styles.mapText, { color: colors.textSecondary }]}>Map View</Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.statusText, { color: colors.text }]}>Trip Active</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="speedometer" size={20} color={colors.primary} />
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Current Speed</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>45 km/h</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="map-marker-distance" size={20} color={colors.primary} />
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Distance Covered</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>127 km</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={20} color={colors.primary} />
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Trip Duration</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>4h 32m</Text>
        </View>

        <TouchableOpacity style={[styles.alertButton, { backgroundColor: colors.error + "10" }]}>
          <Icon name="phone" size={20} color={colors.error} />
          <Text style={[styles.alertText, { color: colors.error }]}>Emergency Contact</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.alertsCard, { backgroundColor: colors.warning + "10", borderColor: colors.warning }]}>
        <Icon name="alert" size={20} color={colors.warning} />
        <Text style={[styles.alertsText, { color: colors.warning }]}>No alerts or violations</Text>
      </View>
    </View>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  mapPlaceholder: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  mapText: {
    fontSize: 16,
    marginTop: 12,
  },
  infoCard: {
    margin: 24,
    padding: 20,
    borderRadius: 16,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  alertButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
    gap: 8,
  },
  alertText: {
    fontSize: 14,
    fontWeight: "600",
  },
  alertsCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  alertsText: {
    fontSize: 13,
    fontWeight: "500",
  },
})
