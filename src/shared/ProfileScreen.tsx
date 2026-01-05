"use client"

import { useNavigation } from "@react-navigation/native"
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

export default function ProfileScreen() {
  const { colors, theme, toggleTheme } = useTheme()
  const { user, logout, updateRole } = useAuth()
  const navigation = useNavigation<any>()

  const isOwner = user?.role === "OWNER"
  const isRenter = user?.role === "REANT"

  /* ================= ROLE BASED MENU ================= */
  const menuItems = [
    {
      icon: "account",
      label: "Profile",
      action: () =>
        navigation.navigate(isOwner ? "CarOwner" : "Renter", {
          screen: isOwner ? "ViewCarOwnerProfile" : "ViewRenterProfile",
        }),
    },
    {
      icon: "account-edit",
      label: "Edit Profile",
      action: () =>
        navigation.navigate(isOwner ? "CarOwner" : "Renter", {
          screen: isOwner ? "UpdateCarOwnerProfile" : "UpdateRenterProfile",
        }),
    },
    {
      icon: "file-document",
      label: "Upload Documents",
      action: () =>
        navigation.navigate(isOwner ? "CarOwner" : "Renter", {
          screen: "KYCUpload",
        }),
    },
    {
      icon: "file-document",
      label: "Download Documents",
      action: () =>
        navigation.navigate(isOwner ? "CarOwner" : "Renter", {
          screen: "DownloadDocument",
        }),
    },
    {
      icon: "history",
      label: isOwner ? "Trip History" : "My Trips",
      action: () =>
        navigation.navigate(isOwner ? "CarOwner" : "Renter", {
          screen: isOwner ? "RatingAndTrips" : "RenterTrips",
        }),
    },

    /* -------- OWNER ONLY -------- */
    ...(isOwner
      ? [
        {
          icon: "wallet",
          label: "Earnings & Wallet",
          action: () =>
            navigation.navigate("CarOwner", {
              screen: "OwnerWallet",
            }),
        },
      ]
      : []),

    /* -------- RENTER ONLY -------- */
    ...(isRenter
      ? [
        {
          icon: "credit-card",
          label: "Payment Methods",
          action: () =>
            navigation.navigate("Renter", {
              screen: "PaymentMethods",
            }),
        },
      ]
      : []),

    {
      icon: "bell",
      label: "Notifications",
      action: () =>
        navigation.navigate(isOwner ? "CarOwner" : "Renter", {
          screen: "Notifications",
        }),
    },
    {
      icon: "help-circle",
      label: "Help & Support",
      action: () =>
        navigation.navigate(isOwner ? "CarOwner" : "Renter", {
          screen: "Support",
        }),
    },
    {
      icon: "file-document-outline",
      label: "Terms & Privacy",
      action: () =>
        navigation.navigate("Common", {
          screen: "TermsAndPolicies",
        }),
    },
  ]

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Profile
        </Text>
      </View>

      {/* ================= USER CARD ================= */}
      <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.name}
          </Text>
          <Text style={[styles.phone, { color: colors.textSecondary }]}>
            {user?.email}
          </Text>
        </View>

        {user?.trustScore !== undefined && (
          <View
            style={[
              styles.trustBadge,
              { backgroundColor: colors.success + "20" },
            ]}
          >
            <Icon name="shield-check" size={16} color={colors.success} />
            <Text style={[styles.trustScore, { color: colors.success }]}>
              {isOwner ? "Owner " : "Renter "}
              {user.trustScore}
            </Text>
          </View>
        )}
      </View>

      {/* ================= ROLE SWITCH ================= */}
      <View style={[styles.roleCard, { backgroundColor: colors.surface }]}>
        <Text
          style={[styles.roleLabel, { color: colors.textSecondary }]}
        >
          Current Role
        </Text>

        <View style={styles.roleSwitcher}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              {
                backgroundColor: isRenter
                  ? colors.primary
                  : colors.surfaceVariant,
              },
            ]}
            onPress={() => updateRole("RENTER")}
          >
            <Icon
              name="car-search"
              size={20}
              color={isRenter ? "#fff" : colors.textSecondary}
            />
            <Text
              style={[
                styles.roleText,
                { color: isRenter ? "#fff" : colors.textSecondary },
              ]}
            >
              Renter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              {
                backgroundColor: isOwner
                  ? colors.primary
                  : colors.surfaceVariant,
              },
            ]}
            onPress={() => updateRole("OWNER")}
          >
            <Icon
              name="car-key"
              size={20}
              color={isOwner ? "#fff" : colors.textSecondary}
            />
            <Text
              style={[
                styles.roleText,
                { color: isOwner ? "#fff" : colors.textSecondary },
              ]}
            >
              Owner
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= MENU ================= */}
      <View style={[styles.menuCard, { backgroundColor: colors.surface }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index !== menuItems.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
            onPress={item.action}
          >
            <Icon
              name={item.icon}
              size={22}
              color={colors.textSecondary}
            />
            <Text style={[styles.menuLabel, { color: colors.text }]}>
              {item.label}
            </Text>
            <Icon
              name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* ================= SETTINGS ================= */}
      <View style={[styles.settingsCard, { backgroundColor: colors.surface }]}>
        <View style={styles.settingItem}>
          <Icon
            name="theme-light-dark"
            size={22}
            color={colors.textSecondary}
          />
          <Text style={[styles.settingLabel, { color: colors.text }]}>
            Dark Mode
          </Text>
          <Switch value={theme === "dark"} onValueChange={toggleTheme} />
        </View>
      </View>

      {/* ================= LOGOUT ================= */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.error + "10" }]}
        onPress={logout}
      >
        <Icon name="logout" size={22} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>
          Logout
        </Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.textTertiary }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  )
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: "700" },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "600", marginBottom: 4 },
  phone: { fontSize: 14 },

  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  trustScore: { fontSize: 14, fontWeight: "700" },

  roleCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  roleSwitcher: { flexDirection: "row", gap: 12 },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  roleText: { fontSize: 14, fontWeight: "600" },

  menuCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  menuLabel: { flex: 1, fontSize: 16 },

  settingsCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  settingLabel: { flex: 1, fontSize: 16 },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  logoutText: { fontSize: 16, fontWeight: "600" },

  version: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 32,
  },
})
