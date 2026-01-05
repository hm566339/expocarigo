"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native"
import { useTheme } from "../../context/ThemeContext"
import { mockCarOwners } from "../../data/mockCarOwners"
import type { CarOwner } from "../../types/carOwner"

export const OwnerListScreen = ({ navigation }: any) => {
  const { colors } = useTheme()
  const [owners, setOwners] = useState<CarOwner[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    loadOwners()
  }, [page, searchQuery])

  const loadOwners = () => {
    // Mock API calls:
    // GET /car-owners?page={page}&size={pageSize}
    // GET /car-owners/search?name={searchQuery}

    let filtered = mockCarOwners
    if (searchQuery.trim()) {
      filtered = mockCarOwners.filter((owner) => owner.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setOwners(filtered)
  }

  const renderOwnerRow = ({ item }: { item: CarOwner }) => (
    <TouchableOpacity
      style={[styles.ownerRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate("OwnerDetail", { ownerId: item.id })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>

      <View style={styles.ownerInfo}>
        <Text style={[styles.ownerName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.ownerEmail, { color: colors.textSecondary }]}>{item.email}</Text>
      </View>

      <View style={[styles.ratingBadge, { backgroundColor: colors.success + "20" }]}>
        <Text style={[styles.ratingText, { color: colors.success }]}>★ {item.rating.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Car Owners</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{owners.length} total owners</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name..."
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      <FlatList
        data={owners}
        renderItem={renderOwnerRow}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  ownerEmail: {
    fontSize: 13,
  },
  ratingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "700",
  },
})
