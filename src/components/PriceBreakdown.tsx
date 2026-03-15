import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BookingCard } from "./BookingCard";

interface PriceBreakdownProps {
  rentalType: "HOURLY" | "DAILY";
  duration: number;
  ratePerHour: number;
  ratePerDay: number;
  securityDeposit: number;
  taxPercentage?: number;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  rentalType,
  duration,
  ratePerHour,
  ratePerDay,
  securityDeposit,
  taxPercentage = 5,
}) => {
  const rate = rentalType === "HOURLY" ? ratePerHour : ratePerDay;
  const subtotal = duration * rate;
  const tax = (subtotal * taxPercentage) / 100;
  const total = subtotal + tax + securityDeposit;

  const rateLabel =
    rentalType === "HOURLY"
      ? `₹${ratePerHour} × ${duration} hr${duration > 1 ? "s" : ""}`
      : `₹${ratePerDay} × ${duration} day${duration > 1 ? "s" : ""}`;

  return (
    <BookingCard animated={false}>
      <Text style={styles.sectionTitle}>Price Breakdown</Text>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>{rateLabel}</Text>
        <Text style={styles.priceValue}>₹{subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Tax ({taxPercentage}%)</Text>
        <Text style={styles.priceValue}>₹{tax.toFixed(2)}</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Security Deposit</Text>
        <Text style={styles.priceValue}>₹{securityDeposit.toFixed(2)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.priceRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
      </View>
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
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
  totalRow: {
    marginVertical: 12,
    paddingVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#007AFF",
  },
});
