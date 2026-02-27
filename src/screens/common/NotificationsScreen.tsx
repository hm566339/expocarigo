"use client"
import React from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useTheme } from "../../context/ThemeContext"

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useTheme()

  const notifications = [
    {
      id: "1",
      type: "booking",
      title: "New Booking Request",
      message: "Rahul Sharma wants to book your Hyundai Creta",
      time: "2 min ago",
      read: false,
    },
    {
      id: "2",
      type: "trip",
      title: "Trip Started",
      message: "Your trip with Honda City has started",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "payment",
      title: "Payment Received",
      message: "₹2,400 has been credited to your wallet",
      time: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "alert",
      title: "Speed Alert",
      message: "Renter exceeded speed limit during trip",
      time: "5 hours ago",
      read: true,
    },
  ]

  const getIconName = (type: string) => {
    switch (type) {
      case "booking":
        return "calendar-check"
      case "trip":
        return "car"
      case "payment":
        return "currency-inr"
      case "alert":
        return "alert-circle"
      default:
        return "bell"
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <TouchableOpacity>
          <Text style={[styles.markAllRead, { color: colors.primary }]}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              {
                backgroundColor: notification.read ? colors.surface : colors.primary + "10",
              },
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
              <Icon name={getIconName(notification.type)} size={24} color={colors.primary} />
            </View>
            <View style={styles.notificationContent}>
              <Text style={[styles.notificationTitle, { color: colors.text }]}>{notification.title}</Text>
              <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>{notification.message}</Text>
              <Text style={[styles.notificationTime, { color: colors.textTertiary }]}>{notification.time}</Text>
            </View>
            {!notification.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        ))}
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
  markAllRead: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: "row",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    gap: 12,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
})
