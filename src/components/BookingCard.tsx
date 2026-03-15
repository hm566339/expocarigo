import React, { useRef } from "react";
import {
    Animated,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

interface BookingCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  animated?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  children,
  onPress,
  style,
  animated = true,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!animated) return;
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!animated) return;
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Animated.View
      style={[
        styles.card,
        animated && { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <Component
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </Component>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
});
