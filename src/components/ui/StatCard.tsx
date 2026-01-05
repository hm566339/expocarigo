import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

export const StatCard = ({
    value,
    label,
}: {
    value: string
    label: string
}) => (
    <View style={styles.statCard}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
)

export const ActionCard = ({
    title,
    onPress,
}: {
    title: string
    onPress?: () => void
}) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDesc}>
            Tap to manage {title}
        </Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
    },
    statValue: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#007AFF",
    },
    statLabel: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },
    actionCard: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#007AFF",
    },
    actionDesc: {
        fontSize: 13,
        color: "#666",
        marginTop: 4,
    },
})
