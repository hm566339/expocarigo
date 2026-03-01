import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface VehicleActionsSectionProps {
  onEdit: () => void;
  onDelete: () => void;
  colors: any;
  delay?: number;
}

export const VehicleActionsSection: React.FC<VehicleActionsSectionProps> = ({
  onEdit,
  onDelete,
  colors,
  delay = 0,
}) => {
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideUpAnim, {
        toValue: 0,
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
  }, [slideUpAnim, fadeInAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.actionRow,
        {
          opacity: fadeInAnim,
          transform: [{ translateY: slideUpAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.editBtn,
          { borderColor: colors.primary },
        ]}
        onPress={onEdit}
        activeOpacity={0.7}
      >
        <Icon name="pencil" size={20} color={colors.primary} />
        <Text style={[styles.actionText, { color: colors.primary }]}>
          Edit Vehicle
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.actionButton,
          styles.deleteBtn,
          { borderColor: colors.error },
        ]}
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <Icon name="delete-outline" size={20} color={colors.error} />
        <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    paddingTop: 16,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 8,
  },
  editBtn: {
    backgroundColor: "rgba(37, 99, 235, 0.05)",
  },
  deleteBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.05)",
  },
  actionText: {
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
