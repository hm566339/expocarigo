import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { CardHeader } from "./CardHeader";
import { DetailsRow } from "./DetailsRow";
import { ImageGallery } from "./ImageGallery";
import { LocationSection } from "./LocationSection";
import { MediaIndicators } from "./Medialndicators";

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

  // Extract vehicle data
  const vehicleName = item.name ?? "Unknown Vehicle";
  const pricePerDay =
    item.ratePerDay ?? item.rate_per_day ?? item.pricePerDay ?? 0;
  const images = item.images || item.vehicleImageUrls || [];
  const location =
    item.location?.city || item.location?.address || "Location not available";

  console.log("VehicleCard Rendered:", vehicleName);
  console.log("Images:", images);
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
        {/* Vehicle Image Gallery */}
        <ImageGallery images={images} badgeText="Premium" />

        {/* Card Content */}
        <View style={styles.cardContent}>
          {/* Header with Name and Price */}
          <CardHeader
            vehicleName={vehicleName}
            ownerName={item.ownerName}
            pricePerDay={pricePerDay}
          />

          {/* Location */}
          <LocationSection location={location} />

          {/* Vehicle Details */}
          <DetailsRow
            billingMode={item.billingMode}
            ratePerHour={item.ratePerHour}
            kycStatus={item.kycStatus}
          />

          {/* Gallery and Video Indicators */}
          <MediaIndicators
            photoCount={item.vehicleImageUrls?.length}
            hasVideo={!!item.vehicleVideoUrl}
          />
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
  cardContent: {
    padding: 16,
    gap: 12,
  },
});
