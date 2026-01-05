import { Video } from "expo-av"
import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import { useTheme } from "../../context/ThemeContext"
import VehicleService from "../../services/api/vehicle.service"

export default function VehicleDetailScreen({ route, navigation }: any) {
    const { vehicleId } = route.params
    const { colors } = useTheme()

    const [loading, setLoading] = useState(true)
    const [vehicle, setVehicle] = useState<any>(null)

    const handleDelete = () => {
        Alert.alert(
            "Delete Vehicle",
            "Are you sure you want to delete this vehicle?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await VehicleService.deleteVehicle(vehicle.vehicleId)
                            Alert.alert("Success", "Vehicle deleted")
                            navigation.goBack()
                        } catch (e) {
                            Alert.alert("Error", "Failed to delete vehicle")
                        }
                    },
                },
            ]
        )
    }

    /* ---------- FETCH VEHICLE ---------- */
    const fetchVehicle = async () => {
        try {
            setLoading(true)
            const res = await VehicleService.getVehicle(vehicleId)
            setVehicle(res)
        } catch (e) {
            Alert.alert("Error", "Failed to load vehicle details")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVehicle()
    }, [])

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    if (!vehicle) return null

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* HEADER */}
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: colors.surface,
                        borderBottomColor: colors.border,
                    },
                ]}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: colors.text }]}>
                    Vehicle Details
                </Text>

                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ---------- IMAGES ---------- */}
                {vehicle.vehicleImageUrls?.length > 0 && (
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                    >
                        {vehicle.vehicleImageUrls.map((url: string, index: number) => (
                            <Image
                                key={index}
                                source={{ uri: url }}
                                style={styles.vehicleImage}
                            />
                        ))}
                    </ScrollView>
                )}

                {/* ---------- VIDEO ---------- */}
                {vehicle.vehicleVideoUrl && (
                    <View style={styles.videoContainer}>
                        <Video
                            source={{ uri: vehicle.vehicleVideoUrl }}
                            useNativeControls
                            resizeMode="contain"
                            style={styles.video}
                        />
                    </View>
                )}

                {/* ---------- DETAILS ---------- */}
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <Detail label="Vehicle Number" value={vehicle.vehicleNumber} />
                    <Detail label="Type" value={vehicle.vehicleType} />
                    <Detail label="Manufacturer" value={vehicle.manufacturer} />
                    <Detail label="Model" value={vehicle.model} />
                    <Detail label="Year" value={vehicle.manufactureYear} />
                    <Detail label="Fuel Type" value={vehicle.fuelType} />
                    <Detail label="Color" value={vehicle.color} />
                    <Detail label="KYC Status" value={vehicle.kycStatus} />
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <Detail label="Owner Name" value={vehicle.ownerName} />
                    <Detail label="Owner Address" value={vehicle.ownerAddress} />
                    <Detail label="Chassis Number" value={vehicle.chassisNumber} />
                    <Detail label="Engine Number" value={vehicle.engineNumber} />
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <Detail label="Rate / Day" value={`₹ ${vehicle.ratePerDay}`} />
                    <Detail label="Rate / Hour" value={`₹ ${vehicle.ratePerHour}`} />
                    <Detail label="Billing Mode" value={vehicle.billingMode} />
                </View>
                {/* ---------- ACTION BUTTONS ---------- */}

                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={[styles.editBtn, { borderColor: colors.primary }]}
                        onPress={() =>
                            navigation.navigate("EditVehicle", {
                                vehicle: {
                                    ...vehicle,
                                    id: vehicle.vehicleId, // 🔴 IMPORTANT
                                },
                            })
                        }
                    >
                        <Icon name="pencil" size={18} color={colors.primary} />
                        <Text style={[styles.actionText, { color: colors.primary }]}>
                            Edit Vehicle
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.deleteBtn, { borderColor: colors.error }]}
                        onPress={() => handleDelete()}
                    >
                        <Icon name="delete" size={18} color={colors.error} />
                        <Text style={[styles.actionText, { color: colors.error }]}>
                            Delete Vehicle
                        </Text>
                    </TouchableOpacity>
                </View>


                {/* ---------- META ---------- */}
                <View style={styles.meta}>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                        Created: {new Date(vehicle.createdAt).toLocaleString()}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                        Updated: {new Date(vehicle.updatedAt).toLocaleString()}
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}

/* ---------- SMALL COMPONENT ---------- */
const Detail = ({ label, value }: any) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value ?? "-"}</Text>
    </View>
)

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
    container: { flex: 1 },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
    },

    vehicleImage: {
        width: 360,
        height: 240,
        resizeMode: "cover",
    },

    videoContainer: {
        marginTop: 16,
        paddingHorizontal: 16,
    },

    video: {
        height: 220,
        borderRadius: 12,
    },

    card: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 16,
    },

    detailRow: {
        marginBottom: 12,
    },

    detailLabel: {
        fontSize: 12,
        color: "#888",
    },

    detailValue: {
        fontSize: 15,
        fontWeight: "600",
    },

    meta: {
        marginVertical: 24,
        alignItems: "center",
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        paddingTop: 16,
        marginBottom: 32,
    },

    editBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        paddingVertical: 14,
        borderRadius: 12,
        marginRight: 8,
    },

    deleteBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        paddingVertical: 14,
        borderRadius: 12,
        marginLeft: 8,
    },

    actionText: {
        marginLeft: 8,
        fontWeight: "600",
    },

})
