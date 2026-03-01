import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface CalendarDate {
  date: string;
  selected?: boolean;
  inRange?: boolean;
}

export interface CalendarPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  isSelectingStartDate?: boolean;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  visible,
  onClose,
  onSelectDate,
  isSelectingStartDate = true,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const handleDateSelect = (dateStr: string): void => {
    if (!dateStr) return;
    onSelectDate(dateStr);
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
});
