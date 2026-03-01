import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { DetailRow } from "./DetailRow";

interface VehicleDetailsCardProps {
  title: string;
  details: { label: string; value: string | number | null }[];
  colors: any;
  delay?: number;
}

export const VehicleDetailsCard: React.FC<VehicleDetailsCardProps> = ({
  title,
  details,
  colors,
  delay = 0,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeInAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          opacity: fadeInAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {title && (
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      )}

      {details.map((detail, index) => (
        <DetailRow
          key={`${title}-${index}`}
          label={detail.label}
          value={detail.value}
          colors={colors}
          delay={delay + (index + 1) * 50}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
});
