import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Button } from "../../../components/ui/Button";
import { VehicleCard } from "../../../components/Vehicle.Card";
import { useVehicleStore } from "../../../services/storage/store/vehicle.store";

interface CalendarDate {
  date: string;
  selected?: boolean;
  inRange?: boolean;
}

interface SearchScreenProps {
  navigation: any;
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const { vehicles, fetchVehicles, isLoading, error, clearError } =
    useVehicleStore();

  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickingStartDate, setPickingStartDate] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMap, setShowMap] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  /* ---------- ANIMATIONS ---------- */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  /* ---------- GET USER LOCATION ---------- */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied");
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (err) {
        console.error("Error getting location:", err);
      }
    })();
  }, []);

  /* ---------- DATE FORMATTING ---------- */
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  /* ---------- CALENDAR GENERATION ---------- */
  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = (): CalendarDate[] => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: CalendarDate[] = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: "" });
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ date: dateStr });
    }

    return days;
  };

  /* ---------- DATE SELECTION ---------- */
  const handleDateSelect = (dateStr: string): void => {
    if (!dateStr) return;

    const displayDate = formatDate(new Date(dateStr));

    if (pickingStartDate) {
      setStartDate(displayDate);
      setPickingStartDate(false);
    } else {
      setEndDate(displayDate);
      setShowDatePicker(false);
    }
  };

  /* ---------- SEARCH ---------- */
  const handleSearch = async (): Promise<void> => {
    clearError();

    if (!city.trim()) {
      console.warn("Please enter a city");
      return;
    }

    console.log("[v0] Searching vehicles for city:", city);
    await fetchVehicles({
      city: city.trim(),
      startDate,
      endDate,
    });
  };

  /* ---------- MONTH NAVIGATION ---------- */
  const goToPreviousMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const goToNextMonth = (): void => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  /* ---------- VEHICLE CARD RENDER ---------- */
  const renderVehicle = ({ item, index }: any) => (
    <VehicleCard
      item={item}
      index={index}
      onPress={() => {
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
        navigation.navigate("CarDetail", { vehicleId: item.vehicleId });
      }}
    />
  );

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      {/* ---------- SEARCH HEADER ---------- */}
      <Animated.View
        style={[
          styles.filtersSection,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim,
              },
            ],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Find Your Perfect Ride</Text>

        {/* ERROR MESSAGE */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.errorClose}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.filters}>
          {/* City Input */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>City / Keyword</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter city or vehicle type"
              placeholderTextColor="#94a3b8"
              value={city}
              onChangeText={setCity}
              editable={!isLoading}
            />
          </View>

          {/* Date Range Display */}
          <View style={styles.dateRangeContainer}>
            <TouchableOpacity
              style={[styles.dateBox, pickingStartDate && styles.dateBoxActive]}
              onPress={() => {
                setPickingStartDate(true);
                setShowDatePicker(true);
              }}
              disabled={isLoading}
            >
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text
                style={[styles.dateValue, !startDate && styles.placeholder]}
              >
                {startDate || "Select date"}
              </Text>
            </TouchableOpacity>

            <View style={styles.dateArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.dateBox,
                !pickingStartDate && showDatePicker && styles.dateBoxActive,
              ]}
              onPress={() => {
                setPickingStartDate(false);
                setShowDatePicker(true);
              }}
              disabled={isLoading}
            >
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={[styles.dateValue, !endDate && styles.placeholder]}>
                {endDate || "Select date"}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            title={isLoading ? "Searching..." : "Search Vehicles"}
            onPress={handleSearch}
            loading={isLoading}
            disabled={isLoading}
          />

          {/* Toggle Map Button */}
          {location && (
            <TouchableOpacity
              style={styles.mapToggleButton}
              onPress={() => setShowMap(!showMap)}
            >
              <Text style={styles.mapToggleText}>
                {showMap ? "🗺️ Hide Map" : "🗺️ Show Map"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* ---------- CALENDAR MODAL ---------- */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModal}>
            {/* Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={goToPreviousMonth}>
                <Text style={styles.navButton}>←</Text>
              </TouchableOpacity>
              <Text style={styles.monthTitle}>{monthName}</Text>
              <TouchableOpacity onPress={goToNextMonth}>
                <Text style={styles.navButton}>→</Text>
              </TouchableOpacity>
            </View>

            {/* Weekday Headers */}
            <View style={styles.weekdayRow}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekdayText}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((dayObj, index) => (
                <TouchableOpacity
                  key={`day-${currentMonth.getFullYear()}-${currentMonth.getMonth()}-${index}`}
                  style={[
                    styles.dayCell,
                    !dayObj.date && styles.emptyCellDay,
                    dayObj.date && styles.validDay,
                  ]}
                  onPress={() => handleDateSelect(dayObj.date)}
                  disabled={!dayObj.date}
                >
                  {dayObj.date && (
                    <Text style={styles.dayText}>
                      {new Date(dayObj.date).getDate()}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ---------- MAP ---------- */}
      {location && showMap && (
        <Animated.View
          style={[
            styles.mapContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: scaleAnim,
                },
              ],
            },
          ]}
        >
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You"
              pinColor="#2563eb"
            />

            {vehicles.map((v: any) =>
              v.location?.latitude && v.location?.longitude ? (
                <Marker
                  key={v.id}
                  coordinate={{
                    latitude: v.location.latitude,
                    longitude: v.location.longitude,
                  }}
                  title={v.name}
                  description={`₹${v.pricePerDay}/day`}
                  pinColor="#f59e0b"
                />
              ) : null,
            )}
          </MapView>
        </Animated.View>
      )}

      {/* ---------- LOADING STATE ---------- */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Finding vehicles...</Text>
        </View>
      )}

      {/* ---------- VEHICLE LIST ---------- */}
      <FlatList
        data={vehicles}
        keyExtractor={(item, index) => `vehicle-${item.vehicleId}-${index}`}
        renderItem={renderVehicle}
        contentContainerStyle={styles.listContent}
        scrollEnabled={!isLoading}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {city
                  ? "No vehicles found"
                  : "Search for vehicles to get started"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  filtersSection: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  errorText: {
    fontSize: 13,
    color: "#991b1b",
    fontWeight: "500",
    flex: 1,
  },
  errorClose: {
    fontSize: 16,
    color: "#991b1b",
    fontWeight: "700",
    paddingLeft: 8,
  },
  filters: {
    gap: 12,
  },
  filterRow: {
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputField: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    fontSize: 15,
    fontWeight: "500",
    color: "#1e293b",
  },
  placeholder: {
    color: "#94a3b8",
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateBox: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
  },
  dateBoxActive: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  dateArrow: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
  },
  mapToggleButton: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  mapToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  calendarModal: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 24,
    maxHeight: "80%",
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  navButton: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2563eb",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    flex: 1,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  dayCell: {
    width: "13.33%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
  },
  validDay: {
    backgroundColor: "#f1f5f9",
  },
  emptyCellDay: {
    backgroundColor: "transparent",
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  closeButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  mapContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  map: {
    height: 240,
  },

  listContent: {
    paddingBottom: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(248, 250, 252, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
