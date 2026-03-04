import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface VehicleMetaInfoProps {
  createdAt?: string;
  updatedAt?: string;
  colors: any;
  delay?: number;
}

export const VehicleMetaInfo: React.FC<VehicleMetaInfoProps> = ({
  createdAt,
  updatedAt,
  colors,
  delay = 0,
}) => {
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, [fadeInAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.meta,
        {
          opacity: fadeInAnim,
        },
      ]}
    >
      {createdAt && (
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          Created: {new Date(createdAt).toLocaleDateString()}
        </Text>
      )}
      {updatedAt && (
        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
          Updated: {new Date(updatedAt).toLocaleDateString()}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  meta: {
    marginVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
