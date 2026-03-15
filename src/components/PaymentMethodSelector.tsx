import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BookingCard } from "./BookingCard";

type PaymentMethod = "CARD" | "UPI" | "CASH_ON_DELIVERY";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const PAYMENT_METHODS: Array<{
  id: PaymentMethod;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: "CARD",
    label: "Credit/Debit Card",
    icon: "💳",
    description: "Visa, Mastercard, Rupay",
  },
  {
    id: "UPI",
    label: "UPI Payment",
    icon: "📱",
    description: "Google Pay, PhonePe, Paytm",
  },
  {
    id: "CASH_ON_DELIVERY",
    label: "Pay Later",
    icon: "💵",
    description: "Pay when you pick up",
  },
];

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  return (
    <BookingCard animated={false}>
      <Text style={styles.sectionTitle}>Payment Method</Text>

      <View style={styles.methodsContainer}>
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodOption,
              selectedMethod === method.id && styles.selectedMethod,
            ]}
            onPress={() => onMethodChange(method.id)}
            activeOpacity={0.7}
          >
            <View style={styles.methodContent}>
              <Text style={styles.methodIcon}>{method.icon}</Text>
              <View style={styles.methodTextContainer}>
                <Text
                  style={[
                    styles.methodLabel,
                    selectedMethod === method.id && styles.selectedText,
                  ]}
                >
                  {method.label}
                </Text>
                <Text style={styles.methodDescription}>
                  {method.description}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.radioButton,
                selectedMethod === method.id && styles.radioButtonSelected,
              ]}
            >
              {selectedMethod === method.id && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}
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
  methodsContainer: {
    gap: 10,
  },
  methodOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedMethod: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f7ff",
  },
  methodContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  methodIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  selectedText: {
    color: "#007AFF",
  },
  methodDescription: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#007AFF",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
});
