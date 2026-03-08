import React from "react";
import { Animated, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

export interface Vehicle {
  id: string;
  vehicleId: string;
  name: string;
  pricePerDay: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface MapSectionProps {
  location: LocationCoords | null;
  vehicles: Vehicle[];
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
}

export const MapSection: React.FC<MapSectionProps> = ({
  location,
  vehicles,
  fadeAnim,
  scaleAnim,
}) => {
  if (!location) return null;

  return (
    <Animated.View
      style={[
        styles.mapContainer,
        {
          opacity: fadeAnim,
          transform: [
            {
              scale: scaleAnim,
            },
          ],
        },
      ]}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        }}
      >
        {/* User Location Marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You"
          pinColor="#2563eb"
        />

        {/* Vehicle Markers */}
        {vehicles.map((v) =>
          v.location?.latitude && v.location?.longitude ? (
            <Marker
              key={v.id}
              coordinate={{
                latitude: v.location.latitude,
                longitude: v.location.longitude,
              }}
              title={v.name}
              description={`₹${v.pricePerDay}/day`}
              pinColor="#f59e0b"
            />
          ) : null,
        )}
      </MapView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  map: {
    height: 240,
  },
});
