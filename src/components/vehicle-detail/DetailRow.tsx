import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface DetailRowProps {
  label: string;
  value: string | number | null;
  colors: any;
  delay?: number;
}

export const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  colors,
  delay = 0,
}) => {
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideInAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideInAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeInAnim, slideInAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.detailRow,
        {
          opacity: fadeInAnim,
          transform: [{ translateY: slideInAnim }],
        },
      ]}
    >
      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: colors.text }]}>
        {value ?? "-"}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  detailRow: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "700",
  },
});
