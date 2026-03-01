import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Button } from "../ui/Button";

export interface SearchHeaderProps {
  city: string;
  onCityChange: (text: string) => void;
  startDate: string;
  endDate: string;
  onStartDatePress: () => void;
  onEndDatePress: () => void;
  onSearch: () => void;
  onMapToggle: () => void;
  isLoading: boolean;
  showMap: boolean;
  hasLocation: boolean;
  error?: string;
  onErrorClose: () => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  city,
  onCityChange,
  startDate,
  endDate,
  onStartDatePress,
  onEndDatePress,
  onSearch,
  onMapToggle,
  isLoading,
  showMap,
  hasLocation,
  error,
  onErrorClose,
}) => {
  return (
    <View style={styles.filtersSection}>
      <Text style={styles.sectionTitle}>Find Your Perfect Ride</Text>

      {/* ERROR BANNER */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={onErrorClose}>
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
            onChangeText={onCityChange}
            editable={!isLoading}
          />
        </View>

        {/* Date Range Display */}
        <View style={styles.dateRangeContainer}>
          <TouchableOpacity
            style={[styles.dateBox, !startDate && styles.dateBoxActive]}
            onPress={onStartDatePress}
            disabled={isLoading}
          >
            <Text style={styles.dateLabel}>Start Date</Text>
            <Text style={[styles.dateValue, !startDate && styles.placeholder]}>
              {startDate || "Select date"}
            </Text>
          </TouchableOpacity>

          <View style={styles.dateArrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>

          <TouchableOpacity
            style={[styles.dateBox, !endDate && styles.dateBoxActive]}
            onPress={onEndDatePress}
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
          onPress={onSearch}
          loading={isLoading}
          disabled={isLoading}
        />

        {/* Toggle Map Button */}
        {hasLocation && (
          <TouchableOpacity
            style={styles.mapToggleButton}
            onPress={onMapToggle}
          >
            <Text style={styles.mapToggleText}>
              {showMap ? "🗺️ Hide Map" : "🗺️ Show Map"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});
