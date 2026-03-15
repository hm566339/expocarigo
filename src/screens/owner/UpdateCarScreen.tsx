import * as ImagePicker from "expo-image-picker"
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

import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { useTheme } from "../../context/ThemeContext"
import VehicleService from "../../services/api/vehicle.service"

export default function UpdateCarScreen({ navigation, route }: any) {
    const { colors } = useTheme()
    const { vehicleId } = route.params

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [vehicle, setVehicle] = useState<any>(null)

    /* ---------- EDITABLE STATES ---------- */
    const [vehicleImages, setVehicleImages] = useState<any[]>([])
    const [vehicleVideo, setVehicleVideo] = useState<any | null>(null)
    const [color, setColor] = useState("")
    const [ratePerDay, setRatePerDay] = useState("")
    const [ratePerHour, setRatePerHour] = useState("")

    /* ---------- FETCH VEHICLE ---------- */
    const fetchVehicle = async () => {
        try {
            const res = await VehicleService.getVehicle(vehicleId)
            setVehicle(res)

            // init editable fields
            setVehicleImages(res.vehicleImageUrls || [])
            setVehicleVideo(res.vehicleVideoUrl || null)
            setColor(res.color || "")
            setRatePerDay(res.ratePerDay ? String(res.ratePerDay) : "")
            setRatePerHour(res.ratePerHour ? String(res.ratePerHour) : "")
        } catch (e) {
            Alert.alert("Error", "Failed to load vehicle")
            navigation.goBack()
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVehicle()
    }, [])

    /* ---------- PERMISSION ---------- */
    const requestPermission = async () => {
        const { granted } =
            await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!granted) {
            Alert.alert("Permission required", "Gallery access is required")
            return false
        }
        return true
    }

    /* ---------- PICK IMAGES ---------- */
    const pickCarImages = async () => {
        if (!(await requestPermission())) return

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.6,
        })

        if (result.canceled) return

        setVehicleImages(
            result.assets.map(a => ({
                uri: a.uri,
                name: a.fileName ?? `vehicle_${Date.now()}.jpg`,
                type: a.mimeType ?? "image/jpeg",
            }))
        )
    }

    /* ---------- PICK VIDEO ---------- */
    const pickVehicleVideo = async () => {
        if (!(await requestPermission())) return

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        })

        if (result.canceled) return

        const a = result.assets[0]
        setVehicleVideo({
            uri: a.uri,
            name: a.fileName ?? `vehicle_video_${Date.now()}.mp4`,
            type: a.mimeType ?? "video/mp4",
        })
    }

    /* ---------- UPDATE ---------- */
    const handleUpdate = async () => {
        try {
            setSaving(true)

            await VehicleService.updateVehicle(vehicle.vehicleId, {
                color,
                ratePerDay: ratePerDay ? Number(ratePerDay) : undefined,
                ratePerHour: ratePerHour ? Number(ratePerHour) : undefined,
                vehicleImages,
                vehicleVideo,
            })

            Alert.alert("Success", "Vehicle updated successfully", [
                { text: "OK", onPress: () => navigation.goBack() },
            ])
        } catch (e) {
            Alert.alert("Error", "Failed to update vehicle")
        } finally {
            setSaving(false)
        }
    }

    /* ---------- LOADER ---------- */
    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    }

    /* ---------- UI ---------- */
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
                    Edit Vehicle
                </Text>

                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* MEDIA (EDITABLE) */}
                <View style={styles.row}>
                    <UploadHalf
                        title="Car Photos"
                        icon="camera"
                        subtitle="Edit"
                        onPress={pickCarImages}
                        colors={colors}
                    />
                    <UploadHalf
                        title="Vehicle Video"
                        icon="video"
                        subtitle="Edit"
                        onPress={pickVehicleVideo}
                        colors={colors}
                    />
                </View>

                {/* ALL DETAILS (READ ONLY) */}
                <Text style={styles.sectionTitle}>Vehicle Information</Text>

                <ReadOnly label="Vehicle Number" value={vehicle.vehicleNumber} />
                <ReadOnly label="Vehicle Type" value={vehicle.vehicleType} />
                <ReadOnly label="Manufacturer" value={vehicle.manufacturer} />
                <ReadOnly label="Model" value={vehicle.model} />
                <ReadOnly label="Year" value={vehicle.manufactureYear} />
                <ReadOnly label="Fuel Type" value={vehicle.fuelType} />
                <ReadOnly label="Owner Name" value={vehicle.ownerName} />
                <ReadOnly label="Owner Address" value={vehicle.ownerAddress} />
                <ReadOnly label="Chassis Number" value={vehicle.chassisNumber} />
                <ReadOnly label="Engine Number" value={vehicle.engineNumber} />
                <ReadOnly label="KYC Status" value={vehicle.kycStatus} />
                <ReadOnly label="Billing Mode" value={vehicle.billingMode} />

                {/* EDITABLE */}
                <Text style={styles.sectionTitle}>Editable Fields</Text>

                <Input label="Color" value={color} onChangeText={setColor} />
                <Input
                    label="Rate Per Day"
                    value={ratePerDay}
                    onChangeText={setRatePerDay}
                    keyboardType="numeric"
                />
                <Input
                    label="Rate Per Hour"
                    value={ratePerHour}
                    onChangeText={setRatePerHour}
                    keyboardType="numeric"
                />

                <View style={styles.buttonContainer}>
                    <Button
                        title="Update Vehicle"
                        onPress={handleUpdate}
                        loading={saving}
                        fullWidth
                    />
                </View>
            </ScrollView>
        </View>
    )
}

/* ---------- SMALL COMPONENTS ---------- */
const ReadOnly = ({ label, value }: any) => (
    <Input label={label} value={String(value ?? "-")} editable={false} />
)

const UploadHalf = ({ title, subtitle, onPress, icon, colors }: any) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.uploadCardHalf, { backgroundColor: colors.surface }]}
    >
        <Icon name={icon} size={34} color={colors.textSecondary} />
        <Text style={[styles.uploadText, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>
            {subtitle}
        </Text>
    </TouchableOpacity>
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

    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    uploadCardHalf: {
        width: "48%",
        alignItems: "center",
        paddingVertical: 28,
        borderRadius: 16,
    },

    uploadText: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 10,
    },

    uploadSubtext: {
        fontSize: 12,
        marginTop: 4,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
        marginTop: 20,
    },

    buttonContainer: {
        marginVertical: 32,
    },
})
