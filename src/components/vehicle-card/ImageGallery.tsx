import React, { useCallback, useRef, useState } from "react";
import {
    Dimensions,
    GestureResponderEvent,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const IMAGE_WIDTH = screenWidth;

interface ImageGalleryProps {
  images: string[];
  badgeText?: string;
}

const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
  const videoMimes = ["video/"];
  return (
    videoExtensions.some((ext) => url.toLowerCase().includes(ext)) ||
    videoMimes.some((mime) => url.toLowerCase().includes(mime))
  );
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images = [],
  badgeText = "Premium",
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: { dx: number },
      ) => {
        if (Math.abs(gestureState.dx) > 50) {
          if (gestureState.dx > 0) {
            // Swiped right - go to previous image
            goToPreviousImage();
          } else {
            // Swiped left - go to next image
            goToNextImage();
          }
        }
      },
    }),
  ).current;

  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyImageContainer}>
        <Text style={styles.emptyImageText}>No images available</Text>
      </View>
    );
  }

  const goToNextImage = useCallback(() => {
    if (currentImageIndex < images.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * IMAGE_WIDTH,
        animated: true,
      });
    }
  }, [currentImageIndex, images.length]);

  const goToPreviousImage = useCallback(() => {
    if (currentImageIndex > 0) {
      const prevIndex = currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * IMAGE_WIDTH,
        animated: true,
      });
    }
  }, [currentImageIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / IMAGE_WIDTH);
    setCurrentImageIndex(currentIndex);
  };

  const isLastItemVideo =
    images.length > 0 && isVideoUrl(images[images.length - 1]);

  const currentItem = images[currentImageIndex];
  const isCurrentVideo = isVideoUrl(currentItem);

  return (
    <View style={styles.galleryContainer} {...panResponder.panHandlers}>
      {/* Image/Video Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.imageCarousel}
      >
        {images.map((item, index) => {
          const isVideo = isVideoUrl(item);
          return (
            <View key={`${item}-${index}`} style={styles.carouselItem}>
              {isVideo ? (
                <View style={styles.videoContainer}>
                  <View style={styles.videoPlaceholder}>
                    <Text style={styles.videoIcon}>▶</Text>
                    <Text style={styles.videoLabel}>Video</Text>
                  </View>
                </View>
              ) : (
                <Image source={{ uri: item }} style={styles.carouselImage} />
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <TouchableOpacity
            style={[styles.navButton, styles.leftButton]}
            onPress={goToPreviousImage}
            disabled={currentImageIndex === 0}
          >
            <Text style={styles.navButtonText}>❮</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, styles.rightButton]}
            onPress={goToNextImage}
            disabled={currentImageIndex === images.length - 1}
          >
            <Text style={styles.navButtonText}>❯</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Badge */}
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      </View>

      {/* Image Counter */}
      {images.length > 1 && (
        <View style={styles.imageCounterContainer}>
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {currentImageIndex + 1}/{images.length}
            </Text>
          </View>
        </View>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={`dot-${index}`}
              onPress={() => {
                setCurrentImageIndex(index);
                scrollViewRef.current?.scrollTo({
                  x: index * IMAGE_WIDTH,
                  animated: true,
                });
              }}
            >
              <View
                style={[
                  styles.dot,
                  index === currentImageIndex && styles.activeDot,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    position: "relative",
    width: "100%",
    height: 240,
    backgroundColor: "#f1f5f9",
  },
  imageCarousel: {
    width: "100%",
    height: "100%",
  },
  carouselItem: {
    width: IMAGE_WIDTH,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  videoIcon: {
    fontSize: 48,
    color: "#ffffff",
    marginBottom: 8,
  },
  videoLabel: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  emptyImageContainer: {
    width: "100%",
    height: 240,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImageText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    marginTop: -20,
  },
  leftButton: {
    left: 12,
  },
  rightButton: {
    right: 12,
  },
  navButtonText: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "700",
  },
  badgeContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
  },
  badge: {
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
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  imageCounterContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
    zIndex: 10,
  },
  imageCounter: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  imageCounterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    gap: 6,
    zIndex: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeDot: {
    width: 24,
    backgroundColor: "#ffffff",
  },
});
