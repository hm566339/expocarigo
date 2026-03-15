import React, { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface VehicleDetailHeaderProps {
  onBackPress: () => void;
  title?: string;
  colors: any;
}

export const VehicleDetailHeader: React.FC<VehicleDetailHeaderProps> = ({
  onBackPress,
  title = "Vehicle Details",
  colors,
}) => {
  const slideInAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.timing(slideInAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [slideInAnim]);

  return (
    <Animated.View
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          transform: [{ translateX: slideInAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={onBackPress} activeOpacity={0.6}>
        <View style={styles.backButtonContainer}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </View>
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>

      <View style={{ width: 24 }} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
