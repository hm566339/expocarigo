import React, { useEffect, useRef } from "react";
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface VehicleCardProps {
  item: any;
  index: number;
  onPress: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  item,
  index,
  onPress,
}) => {
  const cardAnimValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardAnimValue, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [index, cardAnimValue]);

  const vehicleName = item.name ?? "Unknown Vehicle";
  const pricePerDay =
    item.ratePerDay ?? item.rate_per_day ?? item.pricePerDay ?? 0;
  const imageUrl = item.images?.[0] || null;
  const location =
    item.location?.city || item.location?.address || "Location not available";

  console.log("VehicleCard Rendered:", vehicleName);
  console.log("Image URL:", imageUrl);
  console.log("Location:", location);
  console.log("Price Per Day:", pricePerDay);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: cardAnimValue,
          transform: [
            {
              translateY: cardAnimValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            {
              scale: cardAnimValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {/* Vehicle Image */}
        {imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.vehicleImage} />
            <View style={styles.imageBadgeContainer}>
              <View style={styles.imageBadge}>
                <Text style={styles.imageBadgeText}>Premium</Text>
              </View>
            </View>
          </View>
        )}

        {/* Card Content */}
        <View style={styles.cardContent}>
          {/* Header with Name and Price */}
          <View style={styles.cardHeader}>
            <View style={styles.vehicleInfoSection}>
              <Text style={styles.vehicleNumber}>{vehicleName}</Text>
              <Text style={styles.ownerName}>
                by {item.ownerName || "Owner"}
              </Text>
            </View>
            <View style={styles.priceSection}>
              <Text style={styles.price}>₹{pricePerDay.toLocaleString()}</Text>
              <Text style={styles.priceLabel}>/day</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationSection}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location} numberOfLines={1}>
              {location}
            </Text>
          </View>

          {/* Vehicle Details */}
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Billing</Text>
              <Text style={styles.detailValue}>
                {item.billingMode || "Per Day"}
              </Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rate/Hour</Text>
              <Text style={styles.detailValue}>₹{item.ratePerHour || 0}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  item.kycStatus === "APPROVED"
                    ? styles.statusApproved
                    : styles.statusPending,
                ]}
              >
                <Text style={styles.statusText}>{item.kycStatus || "N/A"}</Text>
              </View>
            </View>
          </View>

          {/* Gallery Indicator */}
          {item.vehicleImageUrls && item.vehicleImageUrls.length > 1 && (
            <View style={styles.galleryIndicator}>
              <Text style={styles.galleryText}>
                📸 {item.vehicleImageUrls.length} photos
              </Text>
            </View>
          )}

          {/* Video Indicator */}
          {item.vehicleVideoUrl && (
            <View style={styles.videoIndicator}>
              <Text style={styles.videoText}>▶ Video available</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#1e293b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    backgroundColor: "#f1f5f9",
  },
  vehicleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageBadgeContainer: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  imageBadge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  imageBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardContent: {
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  vehicleInfoSection: {
    flex: 1,
    gap: 4,
  },
  vehicleNumber: {
    fontWeight: "700",
    fontSize: 16,
    color: "#1e293b",
  },
  ownerName: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  priceSection: {
    alignItems: "flex-end",
  },
  price: {
    fontWeight: "700",
    fontSize: 18,
    color: "#2563eb",
  },
  priceLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  locationSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationIcon: {
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    flex: 1,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 0,
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
  },
  detailDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e2e8f0",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusApproved: {
    backgroundColor: "#d1fae5",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1e293b",
  },
  galleryIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  galleryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563eb",
  },
  videoIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  videoText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#92400e",
  },
});
