import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Booking {
  id: number;
  vehicleId: string;
  vehicleNumber: string;
  vehicleImage: string;
  ownerId: number;
  ownerName: string;
  renterId: number;
  startDate: string;
  endDate: string;
  price: number;
  securityDeposit: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: string;
}

interface BookingDetailsScreenProps {
  route: {
    params: {
      booking: Booking;
    };
  };
  navigation: any;
}

const BookingDetailsScreen: React.FC<BookingDetailsScreenProps> = ({
  route,
  navigation,
}) => {
  const { booking } = route.params;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerSlideAnim = useRef(new Animated.Value(-50)).current;

  // Calculate rental duration
  const calculateDuration = () => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }
    return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  };

  // Format date display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format payment method display
  const formatPaymentMethod = (method: string) => {
    return method.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Trigger animations on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, headerSlideAnim]);

  const handlePressIn = (buttonAnim: Animated.Value) => {
    Animated.spring(buttonAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (buttonAnim: Animated.Value) => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const primaryButtonAnim = useRef(new Animated.Value(1)).current;
  const secondaryButtonAnim = useRef(new Animated.Value(1)).current;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Header */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: headerSlideAnim }],
            },
          ]}
        >
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={60} color="#10B981" />
          </View>
          <Text style={styles.headerTitle}>Booking Confirmed</Text>
          <Text style={styles.bookingId}>Booking ID: #{booking.id}</Text>
        </Animated.View>

        {/* Vehicle Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={{ uri: booking.vehicleImage }}
            style={styles.vehicleImage}
          />
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleNumber}>{booking.vehicleNumber}</Text>
            <View style={styles.ownerRow}>
              <Ionicons name="person-circle" size={20} color="#6B7280" />
              <Text style={styles.ownerName}>{booking.ownerName}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Trip Details Section */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Trip Details</Text>

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calendar" size={24} color="#3B82F6" />
              <Text style={styles.detailLabel}>Start Date</Text>
            </View>
            <Text style={styles.detailValue}>
              {formatDate(booking.startDate)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="calendar" size={24} color="#F59E0B" />
              <Text style={styles.detailLabel}>End Date</Text>
            </View>
            <Text style={styles.detailValue}>
              {formatDate(booking.endDate)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailLeft}>
              <Ionicons name="timer" size={24} color="#8B5CF6" />
              <Text style={styles.detailLabel}>Duration</Text>
            </View>
            <Text style={styles.detailValue}>{calculateDuration()}</Text>
          </View>
        </Animated.View>

        {/* Payment Summary Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Payment Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rental Price</Text>
            <Text style={styles.summaryValue}>₹{booking.price.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (5%)</Text>
            <Text style={styles.summaryValue}>₹{booking.tax.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Security Deposit</Text>
            <Text style={styles.summaryValue}>
              ₹{booking.securityDeposit.toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{booking.total.toFixed(2)}</Text>
          </View>
        </Animated.View>

        {/* Payment Method */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.paymentRow}>
            <View style={styles.paymentLeft}>
              <Ionicons name="card" size={24} color="#EC4899" />
              <View>
                <Text style={styles.paymentLabel}>Payment Method</Text>
                <Text style={styles.paymentMethod}>
                  {formatPaymentMethod(booking.paymentMethod)}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Status Badge */}
        <Animated.View
          style={[
            styles.statusContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View
            style={[
              styles.statusBadge,
              booking.status === "PENDING" && styles.statusPending,
              booking.status === "CONFIRMED" && styles.statusConfirmed,
              booking.status === "CANCELLED" && styles.statusCancelled,
            ]}
          >
            <Ionicons
              name={
                booking.status === "PENDING"
                  ? "hourglass"
                  : booking.status === "CONFIRMED"
                    ? "checkmark"
                    : "close"
              }
              size={16}
              color="white"
            />
            <Text style={styles.statusText}>{booking.status}</Text>
          </View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ scale: primaryButtonAnim }],
            },
          ]}
        >
          <Pressable
            style={styles.primaryButton}
            onPressIn={() => handlePressIn(primaryButtonAnim)}
            onPressOut={() => handlePressOut(primaryButtonAnim)}
            onPress={() => navigation.navigate("MyBookings")}
          >
            <Ionicons name="list" size={20} color="white" />
            <Text style={styles.primaryButtonText}>View My Bookings</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ scale: secondaryButtonAnim }],
            },
          ]}
        >
          <Pressable
            style={styles.secondaryButton}
            onPressIn={() => handlePressIn(secondaryButtonAnim)}
            onPressOut={() => handlePressOut(secondaryButtonAnim)}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="home" size={20} color="#3B82F6" />
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  successIcon: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  vehicleImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  vehicleInfo: {
    gap: 8,
  },
  vehicleNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ownerName: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  summaryDivider: {
    height: 2,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10B981",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    alignItems: "center",
  },
  statusPending: {
    backgroundColor: "#F59E0B",
  },
  statusConfirmed: {
    backgroundColor: "#10B981",
  },
  statusCancelled: {
    backgroundColor: "#EF4444",
  },
  statusText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  buttonContainer: {
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  secondaryButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default BookingDetailsScreen;
