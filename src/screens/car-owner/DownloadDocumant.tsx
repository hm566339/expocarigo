"use client"

import * as FileSystem from "expo-file-system/legacy"
import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import CarOwnerService from "../../services/api/car-owner.service"
import VehicleService from "../../services/api/vehicle.service"

export default function DownloadDocument() {
    const { user } = useAuth()
    const { colors } = useTheme()

    const userId = user?.id?.toString()

    const [owner, setOwner] = useState<any>(null)
    const [vehicles, setVehicles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    /* ✅ API CALLS ON PAGE LOAD */
    useEffect(() => {
        if (!userId) return
        loadData()
    }, [userId])

    const loadData = async () => {
        try {
            setLoading(true)

            // ✅ PARALLEL API CALLS
            const [ownerRes, vehiclesRes] = await Promise.all([
                CarOwnerService.getOwner(userId),
                VehicleService.getVehiclesByUser(userId),
            ])

            setOwner(ownerRes)
            setVehicles(Array.isArray(vehiclesRes) ? vehiclesRes : [])
        } catch (err) {
            console.log("Load error:", err)
            Alert.alert("Error", "Failed to load documents")
        } finally {
            setLoading(false)
        }
    }

    /* ⬇️ DOWNLOAD FROM URL (LEGACY API – STABLE) */
    const downloadFromUrl = async (url: string) => {
        try {
            const fileName = url.split("/").pop() || "file"
            const fileUri = FileSystem.documentDirectory + fileName

            const downloadResumable =
                FileSystem.createDownloadResumable(url, fileUri)

            const result = await downloadResumable.downloadAsync()

            Alert.alert("Downloaded", `Saved at:\n${result?.uri}`)
        } catch (err) {
            console.log("Download error:", err)
            Alert.alert("Error", "Download failed")
        }
    }

    /* ---------- LOADING ---------- */
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 10, color: colors.text }}>
                    Loading documents...
                </Text>
            </View>
        )
    }

    const firstVehicle = vehicles[0]

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <Text style={[styles.title, { color: colors.text }]}>
                Download Documents
            </Text>

            {/* 🔹 OWNER DOCUMENTS */}
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <Text style={styles.cardTitle}>Owner Documents</Text>

                {owner?.aadhaarFrontUrl && (
                    <DownloadButton
                        label="Download Aadhaar Front"
                        onPress={() => downloadFromUrl(owner.aadhaarFrontUrl)}
                    />
                )}

                {owner?.aadhaarBackUrl && (
                    <DownloadButton
                        label="Download Aadhaar Back"
                        onPress={() => downloadFromUrl(owner.aadhaarBackUrl)}
                    />
                )}

                {owner?.selfieUrl && (
                    <DownloadButton
                        label="Download Selfie"
                        onPress={() => downloadFromUrl(owner.selfieUrl)}
                    />
                )}
            </View>

            {/* 🔹 VEHICLE DOCUMENTS */}
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <Text style={styles.cardTitle}>Vehicle Documents</Text>

                {firstVehicle?.vehicleVideoUrl && (
                    <DownloadButton
                        label="Download Vehicle Video"
                        onPress={() =>
                            downloadFromUrl(firstVehicle.vehicleVideoUrl)
                        }
                    />
                )}

                {Array.isArray(firstVehicle?.vehicleImageUrls) &&
                    firstVehicle.vehicleImageUrls.map(
                        (url: string, index: number) => (
                            <DownloadButton
                                key={index}
                                label={`Download Vehicle Image ${index + 1}`}
                                onPress={() => downloadFromUrl(url)}
                            />
                        )
                    )}
            </View>
        </ScrollView>
    )
}

/* 🔹 REUSABLE BUTTON */
const DownloadButton = ({
    label,
    onPress,
}: {
    label: string
    onPress: () => void
}) => (
    <TouchableOpacity style={styles.downloadBtn} onPress={onPress}>
        <Icon name="download" size={18} color="#fff" />
        <Text style={styles.downloadText}>{label}</Text>
    </TouchableOpacity>
)

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 16,
    },
    card: {
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },
    downloadBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007AFF",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        gap: 8,
    },
    downloadText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
})
