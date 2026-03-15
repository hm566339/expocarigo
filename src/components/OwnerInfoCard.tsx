import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { BookingCard } from "./BookingCard";

interface Owner {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  rating?: number;
}

interface OwnerInfoCardProps {
  owner: Owner | null;
  loading?: boolean;
}

const SkeletonLine: React.FC<{ width?: string }> = ({
  width = "100%",
  ...props
}) => (
  <Animated.View
    style={[styles.skeletonLine, { width, opacity: new Animated.Value(0.5) }]}
  />
);

export const OwnerInfoCard: React.FC<OwnerInfoCardProps> = ({
  owner,
  loading = false,
}) => {
  return (
    <BookingCard animated={false}>
      <Text style={styles.sectionTitle}>Vehicle Owner</Text>

      {loading ? (
        <View style={styles.skeletonContainer}>
          <SkeletonLine />
          <SkeletonLine width="70%" />
        </View>
      ) : (
        <View>
          {owner?.name && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{owner.name}</Text>
            </View>
          )}

          {owner?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{owner.phone}</Text>
            </View>
          )}

          {owner?.email && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{owner.email}</Text>
            </View>
          )}

          {owner?.address && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address</Text>
              <Text style={[styles.value, styles.addressValue]}>
                {owner.address}
              </Text>
            </View>
          )}

          {owner?.rating && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Rating</Text>
              <Text style={styles.ratingValue}>
                ⭐ {owner.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      )}
    </BookingCard>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  skeletonContainer: {
    gap: 12,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  label: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    maxWidth: "60%",
  },
  addressValue: {
    textAlign: "right",
    maxWidth: "60%",
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFB81C",
  },
});
