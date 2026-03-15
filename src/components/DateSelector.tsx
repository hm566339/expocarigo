import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BookingCard } from "./BookingCard";

interface DateSelectorProps {
  startDate: string;
  endDate: string;
  onStartDatePress: () => void;
  onEndDatePress: () => void;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toDateString();
  } catch {
    return "-";
  }
};

export const DateSelector: React.FC<DateSelectorProps> = ({
  startDate,
  endDate,
  onStartDatePress,
  onEndDatePress,
}) => {
  return (
    <BookingCard>
      <Text style={styles.sectionTitle}>Trip Dates</Text>

      <TouchableOpacity style={styles.dateButton} onPress={onStartDatePress}>
        <Text style={styles.dateButtonLabel}>Start Date</Text>
        <Text style={styles.dateButtonValue}>{formatDate(startDate)}</Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>

      <View style={styles.dateArrow}>
        <Text style={styles.arrowText}>→</Text>
      </View>

      <TouchableOpacity style={styles.dateButton} onPress={onEndDatePress}>
        <Text style={styles.dateButtonLabel}>End Date</Text>
        <Text style={styles.dateButtonValue}>{formatDate(endDate)}</Text>
        <Text style={styles.calendarIcon}>📅</Text>
      </TouchableOpacity>
    </BookingCard>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  dateButton: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateButtonLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    flex: 1,
  },
  dateButtonValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1.5,
  },
  calendarIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  dateArrow: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  arrowText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "600",
  },
});
