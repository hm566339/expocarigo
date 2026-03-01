import { Video } from "expo-av";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface VehicleMediaSectionProps {
  images?: string[];
  videoUrl?: string;
  colors: any;
}

export const VehicleMediaSection: React.FC<VehicleMediaSectionProps> = ({
  images = [],
  videoUrl,
  colors,
}) => {
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeInAnim, slideUpAnim]);

  if (images.length === 0 && !videoUrl) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeInAnim,
          transform: [{ translateY: slideUpAnim }],
        },
      ]}
    >
      {/* Images Carousel */}
      {images.length > 0 && (
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
          >
            {images.map((url, index) => (
              <Image
                key={`img-${index}`}
                source={{ uri: url }}
                style={[styles.image, { width: screenWidth }]}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Video Section */}
      {videoUrl && (
        <View
          style={[styles.videoContainer, { backgroundColor: colors.surface }]}
        >
          <Video
            source={{ uri: videoUrl }}
            useNativeControls
            resizeMode="contain"
            style={styles.video}
            rate={1.0}
            progressUpdateIntervalMillis={500}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  carouselContainer: {
    width: "100%",
    height: 240,
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    height: 240,
    resizeMode: "cover",
  },
  videoContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  video: {
    height: 220,
  },
});
