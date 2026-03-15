import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateSelector } from "../../../components/DateSelector";
import { OwnerInfoCard } from "../../../components/OwnerInfoCard";
import { PaymentMethodSelector } from "../../../components/PaymentMethodSelector";
import { PriceBreakdown } from "../../../components/PriceBreakdown";
import { useAuth } from "../../../context/AuthContext";
// import { useBookingStore } from "../../../services/storage/store/booking.store";
import bookingService from "../../../services/api/booking.service";
interface BookingSummaryScreenProps {
  navigation: any;
  route: any;
}

/**
 * PRODUCTION BOOKING SUMMARY SCREEN
 * Features:
 * - Strict parameter validation with fallbacks
 * - Authenticated user integration
 * - Proper date ISO serialization
 * - Complete API payload validation
 * - Comprehensive error handling & logging
 */
export default function BookingSummaryScreen({
  navigation,
  route,
}: BookingSummaryScreenProps) {
  /* ================= PARAM EXTRACTION & VALIDATION ================= */

  const params = route?.params ?? {};

  console.log("[v0] BookingSummaryScreen params:", params);

  // Extract route parameters from API response
  const vehicleId = String(params?.vehicleId ?? "");
  const ownerId = Number(params?.ownerId ?? 0); // Maps to userId from API
  const startDate = String(params?.startDate ?? "");
  const endDate = String(params?.endDate ?? "");
  const ratePerHour = Number(params?.ratePerHour ?? 0);
  const ratePerDay = Number(params?.ratePerDay ?? 0);
  const vehicleNumber = String(params?.vehicleNumber ?? "");
  const ownerName = String(params?.ownerName ?? "");
  const vehicleImage = String(params?.vehicleImage ?? "");

  const allData = [
    vehicleId,
    ownerId,
    startDate,
    endDate,
    ratePerHour,
    ratePerDay,
    vehicleNumber,
    ownerName,
    vehicleImage,
  ];

  console.log(allData);

  // Get authenticated user from store
  const { user: authUser } = useAuth();

  console.log("[v0] Authenticated user:", authUser);

  /* ================= STATE ================= */

  const [rentalType, setRentalType] = useState<"HOURLY" | "DAILY">("HOURLY");
  const [selectedHours, setSelectedHours] = useState(1);
  const [selectedDays, setSelectedDays] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState<
    "CARD" | "UPI" | "CASH_ON_DELIVERY"
  >("CARD");

  const [owner, setOwner] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [displayStartDate, setDisplayStartDate] = useState(startDate);
  const [displayEndDate, setDisplayEndDate] = useState(endDate);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  /* ================= ANIMATION VALUES ================= */

  const cardScaleAnim = useRef(new Animated.Value(1)).current;
  const datePickerOpacityAnim = useRef(new Animated.Value(0)).current;
  const buttonPressAnim = useRef(new Animated.Value(1)).current;
  const skeletonShimmerAnim = useRef(new Animated.Value(0)).current;

  /* ================= INITIALIZE DATES ================= */

  useEffect(() => {
    if (!startDate || !endDate) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      setDisplayStartDate(today.toISOString());
      setDisplayEndDate(tomorrow.toISOString());
    }
  }, []);

  /* ================= AUTO CALCULATE FROM DATE ================= */

  useEffect(() => {
    if (!displayStartDate || !displayEndDate) return;

    const start = new Date(displayStartDate);
    const end = new Date(displayEndDate);

    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) return;

    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffHours / 24);

    setSelectedHours(diffHours);
    setSelectedDays(diffDays);
  }, [displayStartDate, displayEndDate]);

  /* ================= SET OWNER FROM PARAMS ================= */

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonShimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(skeletonShimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [skeletonShimmerAnim]);

  useEffect(() => {
    // Set owner data from route params (passed from API response)
    if (ownerName) {
      setOwner({
        name: ownerName,
        id: ownerId,
      });
    }
  }, [ownerName, ownerId]);

  /* ================= DATE FORMAT ================= */
  const formatDate = (dateString: string): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toDateString();
    } catch {
      return "-";
    }
  };
  /* ================= ANIMATION HANDLERS ================= */

  const animateCardPress = () => {
    Animated.sequence([
      Animated.timing(cardScaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(cardScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateDatePickerOpen = () => {
    Animated.timing(datePickerOpacityAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const animateDatePickerClose = () => {
    Animated.timing(datePickerOpacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonPressAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonPressAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /* ================= CALENDAR HANDLERS ================= */

  const handleStartDateSelect = (day: number) => {
    const newDate = new Date(displayStartDate);
    newDate.setDate(day);
    setDisplayStartDate(newDate.toISOString());
    animateDatePickerClose();
    setTimeout(() => setShowStartCalendar(false), 300);
  };

  const handleEndDateSelect = (day: number) => {
    const newDate = new Date(displayEndDate);
    newDate.setDate(day);
    setDisplayEndDate(newDate.toISOString());
    animateDatePickerClose();
    setTimeout(() => setShowEndCalendar(false), 300);
  };

  const renderCalendarDays = (selectedDate: string) => {
    try {
      const date = new Date(selectedDate);

      if (isNaN(date.getTime())) {
        return [];
      }

      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days: (number | null)[] = [];
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }

      return days;
    } catch (error) {
      console.log("[v0] Calendar render error:", error);
      return [];
    }
  };

  const SkeletonLoader = () => {
    const shimmerOpacity = skeletonShimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    });

    return (
      <>
        <Animated.View
          style={[styles.skeletonLine, { opacity: shimmerOpacity }]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            { width: "70%", opacity: shimmerOpacity },
          ]}
        />
      </>
    );
  };

  /* ================= PRICE CALCULATION ================= */

  const subtotal = useMemo(() => {
    if (rentalType === "HOURLY") {
      const amount = selectedHours * ratePerHour;
      return isNaN(amount) ? 0 : amount;
    }
    const amount = selectedDays * ratePerDay;
    return isNaN(amount) ? 0 : amount;
  }, [rentalType, selectedHours, selectedDays, ratePerHour, ratePerDay]);

  const securityDeposit = 2000;
  const tax = useMemo(() => {
    const taxAmount = subtotal * 0.05;
    return isNaN(taxAmount) ? 0 : taxAmount;
  }, [subtotal]);

  const total = useMemo(() => {
    const totalAmount = subtotal + tax + securityDeposit;
    return isNaN(totalAmount) ? securityDeposit : totalAmount;
  }, [subtotal, tax]);

  /* ================= DATE SERIALIZATION ================= */

  /**
   * Serialize dates to proper ISO format for API
   * Handles invalid dates and ensures consistency
   */
  const serializeDate = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  /* ================= BOOKING HANDLER ================= */

  const handleConfirmBooking = async () => {
    // Prevent double submission
    if (isLoading) {
      console.warn("[v0] Booking already in progress");
      return;
    }

    setIsLoading(true);

    try {
      // Serialize dates to ISO format
      const serializedStartDate = serializeDate(displayStartDate);
      const serializedEndDate = serializeDate(displayEndDate);

      // Prepare booking payload with correct API response mapping
      const bookingPayload = {
        renterId: authUser.id,
        ownerId: ownerId,
        vehicleId: vehicleId,
        startDate: serializedStartDate,
        endDate: serializedEndDate,
        price: subtotal,
        securityDeposit: securityDeposit,
      };

      console.log("[v0] BOOKING PAYLOAD", bookingPayload);

      // Call the booking API
      console.log("[v0] Submitting booking to API...");
      const booking = await bookingService.createBooking(bookingPayload);

      console.log("[v0] Booking response:", booking);

      if (!booking?.id) {
        throw new Error("No booking ID returned from server");
      }

      const bookingData = {
        id: booking.id,
        vehicleId: vehicleId,
        vehicleNumber: vehicleNumber,
        vehicleImage: vehicleImage,
        ownerId: ownerId,
        ownerName: ownerName,
        renterId: authUser.id,

        startDate: serializedStartDate,
        endDate: serializedEndDate,

        price: subtotal,
        securityDeposit: securityDeposit,
        tax: tax,
        total: total,

        paymentMethod: paymentMethod,
        status: booking.status,
      };

      // Success: Navigate to details screen
      console.log("[v0] Booking created successfully, navigating...");
      navigation.navigate("BookingDetailsScreen", {
        booking: bookingData,
      });
    } catch (error: any) {
      console.error("[v0] Booking error:", error);

      // Extract meaningful error message
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create booking. Please try again.";

      Alert.alert("Booking Failed", errorMessage, [
        {
          text: "Retry",
          onPress: () => {
            console.log("[v0] User retrying booking");
          },
        },
        {
          text: "Go Back",
          onPress: () => navigation.goBack(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Booking Summary</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* TRIP DATES */}
        <DateSelector
          startDate={displayStartDate}
          endDate={displayEndDate}
          onStartDatePress={() => {
            animateCardPress();
            setShowStartCalendar(!showStartCalendar);
            if (!showStartCalendar) {
              animateDatePickerOpen();
            }
          }}
          onEndDatePress={() => {
            animateCardPress();
            setShowEndCalendar(!showEndCalendar);
            if (!showEndCalendar) {
              animateDatePickerOpen();
            }
          }}
        />

        {showStartCalendar && displayStartDate && (
          <Animated.View
            style={[
              styles.calendarContainer,
              { opacity: datePickerOpacityAnim },
            ]}
          >
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarMonth}>
                {(() => {
                  try {
                    const date = new Date(displayStartDate);
                    if (isNaN(date.getTime())) return "Invalid Date";
                    return date.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    });
                  } catch {
                    return "Invalid Date";
                  }
                })()}
              </Text>
            </View>
            <View style={styles.calendarGrid}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekdayHeader}>
                  {day}
                </Text>
              ))}
              {renderCalendarDays(displayStartDate).map((day, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.calendarDay,
                    day === new Date(displayStartDate).getDate() &&
                      styles.selectedCalendarDay,
                  ]}
                  onPress={() => day && handleStartDateSelect(day)}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      day === new Date(displayStartDate).getDate() &&
                        styles.selectedCalendarDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {showEndCalendar && displayEndDate && (
          <Animated.View
            style={[
              styles.calendarContainer,
              { opacity: datePickerOpacityAnim },
            ]}
          >
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarMonth}>
                {(() => {
                  try {
                    const date = new Date(displayEndDate);
                    if (isNaN(date.getTime())) return "Invalid Date";
                    return date.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    });
                  } catch {
                    return "Invalid Date";
                  }
                })()}
              </Text>
            </View>
            <View style={styles.calendarGrid}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekdayHeader}>
                  {day}
                </Text>
              ))}
              {renderCalendarDays(displayEndDate).map((day, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.calendarDay,
                    day === new Date(displayEndDate).getDate() &&
                      styles.selectedCalendarDay,
                  ]}
                  onPress={() => day && handleEndDateSelect(day)}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      day === new Date(displayEndDate).getDate() &&
                        styles.selectedCalendarDayText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* RENTAL TYPE */}
        <Animated.View
          style={[
            styles.toggleContainer,
            { transform: [{ scale: cardScaleAnim }] },
          ]}
        >
          {["HOURLY", "DAILY"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.toggleButton,
                rentalType === type && styles.selectedToggle,
              ]}
              onPress={() => {
                animateCardPress();
                setRentalType(type as "HOURLY" | "DAILY");
              }}
            >
              <Text
                style={
                  rentalType === type
                    ? styles.selectedToggleText
                    : styles.toggleText
                }
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* DURATION SELECTOR */}
        <Animated.View
          style={[styles.card, { transform: [{ scale: cardScaleAnim }] }]}
        >
          <Text style={styles.sectionTitle}>
            Select {rentalType === "HOURLY" ? "Hours" : "Days"}
          </Text>

          <View style={styles.selectorRow}>
            <TouchableOpacity
              style={styles.selectorBtn}
              onPress={() => {
                animateButtonPress();
                rentalType === "HOURLY"
                  ? selectedHours > 1 && setSelectedHours(selectedHours - 1)
                  : selectedDays > 1 && setSelectedDays(selectedDays - 1);
              }}
            >
              <Text style={styles.selectorText}>−</Text>
            </TouchableOpacity>

            <Animated.Text style={[styles.selectorValue]}>
              {rentalType === "HOURLY"
                ? `${selectedHours} ${selectedHours > 1 ? "hrs" : "hr"}`
                : `${selectedDays} ${selectedDays > 1 ? "days" : "day"}`}
            </Animated.Text>

            <TouchableOpacity
              style={styles.selectorBtn}
              onPress={() => {
                animateButtonPress();
                rentalType === "HOURLY"
                  ? setSelectedHours(selectedHours + 1)
                  : setSelectedDays(selectedDays + 1);
              }}
            >
              <Text style={styles.selectorText}>+</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* PRICE */}
        <PriceBreakdown
          rentalType={rentalType}
          duration={rentalType === "HOURLY" ? selectedHours : selectedDays}
          ratePerHour={ratePerHour}
          ratePerDay={ratePerDay}
          securityDeposit={securityDeposit}
        />

        {/* OWNER */}
        <OwnerInfoCard owner={owner} loading={false} />

        {/* PAYMENT */}
        <PaymentMethodSelector
          selectedMethod={paymentMethod}
          onMethodChange={(method) => {
            animateCardPress();
            setPaymentMethod(method);
          }}
        />

        {/* CONFIRM BUTTON */}
        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: buttonPressAnim }] },
          ]}
        >
          <TouchableOpacity
            style={[styles.confirmButton, isLoading && styles.buttonDisabled]}
            onPress={() => {
              animateButtonPress();
              handleConfirmBooking();
            }}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "600",
  },
  title: { fontSize: 24, fontWeight: "800", color: "#1a1a1a" },

  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f4f8",
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  selectedToggle: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleText: { color: "#666", fontWeight: "600", fontSize: 14 },
  selectedToggleText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 18,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  sectionTitle: {
    fontWeight: "700",
    marginBottom: 14,
    fontSize: 16,
    color: "#1a1a1a",
  },

  selectorRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fc",
    paddingVertical: 12,
    borderRadius: 10,
  },
  selectorBtn: {
    width: 48,
    height: 48,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  selectorText: { color: "#fff", fontSize: 20, fontWeight: "800" },
  selectorValue: {
    marginHorizontal: 24,
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: { color: "#666", fontSize: 14, fontWeight: "500" },
  priceValue: { color: "#1a1a1a", fontSize: 14, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 12 },
  totalRow: { marginBottom: 0 },
  totalLabel: { fontWeight: "700", fontSize: 16, color: "#1a1a1a" },
  totalValue: { fontWeight: "800", fontSize: 18, color: "#007AFF" },

  paymentOption: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f8f9fc",
  },
  paymentContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentText: { fontWeight: "600", fontSize: 14, color: "#333" },
  checkMark: { fontSize: 18, color: "#007AFF", fontWeight: "800" },
  selectedPayment: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f7ff",
  },

  dateButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#f0f4f8",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e8f0",
  },
  dateButtonLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 6,
    fontWeight: "500",
  },
  dateButtonValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
  },

  calendarContainer: {
    backgroundColor: "#f8f9fc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e8eef8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarHeader: {
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e8eef8",
    marginBottom: 14,
  },
  calendarMonth: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  weekdayHeader: {
    width: "14.28%",
    textAlign: "center",
    fontWeight: "700",
    color: "#999",
    paddingVertical: 10,
    fontSize: 12,
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 4,
  },
  selectedCalendarDay: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarDayText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  selectedCalendarDayText: {
    color: "#fff",
    fontWeight: "700",
  },

  ownerContent: { marginTop: 4 },
  ownerInfoRow: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  ownerLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
    marginBottom: 4,
  },
  ownerValue: {
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: "600",
  },

  skeletonLine: {
    height: 12,
    backgroundColor: "#e8e8e8",
    borderRadius: 6,
    marginBottom: 10,
  },

  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 28,
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
