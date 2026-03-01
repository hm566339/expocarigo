import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DetailsRowProps {
  billingMode?: string;
  ratePerHour?: number;
  kycStatus?: string;
}

export const DetailsRow: React.FC<DetailsRowProps> = ({
  billingMode = "Per Day",
  ratePerHour = 0,
  kycStatus = "N/A",
}) => {
  const isApproved = kycStatus === "APPROVED";

  return (
    <View style={styles.detailsRow}>
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Billing</Text>
        <Text style={styles.detailValue}>{billingMode}</Text>
      </View>
      <View style={styles.detailDivider} />
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Rate/Hour</Text>
        <Text style={styles.detailValue}>₹{ratePerHour}</Text>
      </View>
      <View style={styles.detailDivider} />
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>Status</Text>
        <View
          style={[
            styles.statusBadge,
            isApproved ? styles.statusApproved : styles.statusPending,
          ]}
        >
          <Text style={styles.statusText}>{kycStatus}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 0,
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
  },
  detailDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e2e8f0",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusApproved: {
    backgroundColor: "#d1fae5",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1e293b",
  },
});
