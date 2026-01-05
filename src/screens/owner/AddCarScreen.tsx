import * as ImagePicker from "expo-image-picker"
import React, { useState } from "react"
import {
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
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import VehicleService from "../../services/api/vehicle.service"
import { BillingMode } from "../../types/vehicle.types"

export default function AddCarScreen({ navigation }: any) {
  const { colors } = useTheme()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)

  /* ---------- MEDIA STATES ---------- */
  const [rcFrontImage, setRcFrontImage] = useState<any | null>(null)
  const [rcBackImage, setRcBackImage] = useState<any | null>(null)
  const [vehicleImages, setVehicleImages] = useState<any[]>([])
  const [vehicleVideo, setVehicleVideo] = useState<any | null>(null)

  /* ---------- FORM STATES ---------- */
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [vehicleType] = useState("CAR")
  const [manufacturer, setManufacturer] = useState("")
  const [model, setModel] = useState("")
  const [manufactureYear, setManufactureYear] = useState("")
  const [fuelType] = useState("Petrol")
  const [color, setColor] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [ownerAddress, setOwnerAddress] = useState("")
  const [chassisNumber, setChassisNumber] = useState("")
  const [engineNumber, setEngineNumber] = useState("")
  const [ratePerDay, setRatePerDay] = useState("")
  const [ratePerHour, setRatePerHour] = useState("")
  const [billingMode] = useState<BillingMode>("PER_DAY")

  /* ---------- PERMISSION ---------- */
  const requestPermission = async () => {
    const { granted } =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!granted)
      Alert.alert("Permission required", "Gallery access is required")
    return granted
  }

  /* ---------- RC IMAGE PICKER ---------- */
  const pickRcImage = async (type: "FRONT" | "BACK") => {
    if (!(await requestPermission())) return

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    })

    if (result.canceled) return

    const a = result.assets[0]
    const image = {
      uri: a.uri,
      name: a.fileName ?? `rc_${type}_${Date.now()}.jpg`,
      type: a.mimeType ?? "image/jpeg",
    }

    type === "FRONT" ? setRcFrontImage(image) : setRcBackImage(image)
  }

  /* ---------- VEHICLE IMAGES ---------- */
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

  /* ---------- VEHICLE VIDEO ---------- */
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

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!user?.id)
      return Alert.alert("Error", "User not logged in")

    if (!vehicleNumber || !chassisNumber || !engineNumber)
      return Alert.alert("Error", "Required fields missing")

    try {
      setLoading(true)

      await VehicleService.createVehicle(user.id.toString(), {
        vehicleNumber,
        vehicleType,
        manufacturer: manufacturer || undefined,
        model: model || undefined,
        manufactureYear: manufactureYear
          ? Number(manufactureYear)
          : undefined,
        fuelType,
        color: color || undefined,
        ownerName: ownerName || undefined,
        ownerAddress: ownerAddress || undefined,
        chassisNumber,
        engineNumber,
        ratePerDay: ratePerDay ? Number(ratePerDay) : undefined,
        ratePerHour: ratePerHour ? Number(ratePerHour) : undefined,
        billingMode,
        rcFrontImage,
        rcBackImage,
        vehicleImages,
        vehicleVideo,
      })

      Alert.alert("Success", "Vehicle added successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch (e) {
      console.log(e)
      Alert.alert("Error", "Failed to add vehicle")
    } finally {
      setLoading(false)
    }
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
          Add New Car
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* ---------- RC ROW ---------- */}
        <View style={styles.row}>
          <UploadHalf
            title="RC Front"
            icon="file-image"
            onPress={() => pickRcImage("FRONT")}
            subtitle={rcFrontImage ? "Selected" : "Upload"}
            colors={colors}
          />
          <UploadHalf
            title="RC Back"
            icon="file-image"
            onPress={() => pickRcImage("BACK")}
            subtitle={rcBackImage ? "Selected" : "Upload"}
            colors={colors}
          />
        </View>

        {/* ---------- MEDIA ROW ---------- */}
        <View style={styles.row}>
          <UploadHalf
            title="Car Photos"
            icon="camera"
            onPress={pickCarImages}
            subtitle={
              vehicleImages.length
                ? `${vehicleImages.length} selected`
                : "Upload"
            }
            colors={colors}
          />
          <UploadHalf
            title="Vehicle Video"
            icon="video"
            onPress={pickVehicleVideo}
            subtitle={vehicleVideo ? "Selected" : "Upload"}
            colors={colors}
          />
        </View>

        {/* ---------- FORM ---------- */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Basic Details
        </Text>


        <Input
          label="Vehicle Number"
          value={vehicleNumber}
          onChangeText={setVehicleNumber}
          placeholder="e.g. UP 09 AB 1234"
        />

        <Input
          label="Manufacturer"
          value={manufacturer}
          onChangeText={setManufacturer}
          placeholder="e.g. Maruti, Hyundai, Tata"
        />

        <Input
          label="Model"
          value={model}
          onChangeText={setModel}
          placeholder="e.g. Swift, Creta, Nexon"
        />

        <Input
          label="Year"
          value={manufactureYear}
          onChangeText={setManufactureYear}
          keyboardType="numeric"
          placeholder="e.g. 2022"
        />

        <Input
          label="Color"
          value={color}
          onChangeText={setColor}
          placeholder="e.g. White, Black"
        />

        <Input
          label="Owner Name"
          value={ownerName}
          onChangeText={setOwnerName}
          placeholder="e.g. Mohit Sharma"
        />

        <Input
          label="Owner Address"
          value={ownerAddress}
          onChangeText={setOwnerAddress}
          placeholder="e.g. Noida, Sector 62"
        />

        <Input
          label="Chassis Number"
          value={chassisNumber}
          onChangeText={setChassisNumber}
          placeholder="e.g. MA3EWBH1S00XXXXXX"
        />

        <Input
          label="Engine Number"
          value={engineNumber}
          onChangeText={setEngineNumber}
          placeholder="e.g. K12MN1234567"
        />

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Pricing
        </Text>

        <Input
          label="Rate Per Day"
          value={ratePerDay}
          onChangeText={setRatePerDay}
          keyboardType="numeric"
          placeholder="e.g. 2500"
        />

        <Input
          label="Rate Per Hour"
          value={ratePerHour}
          onChangeText={setRatePerHour}
          keyboardType="numeric"
          placeholder="e.g. 150"
        />

        <View style={styles.buttonContainer}>
          <Button title="Add Car" onPress={handleSubmit} loading={loading} fullWidth />
        </View>
      </ScrollView>
    </View>
  )
}

/* ---------- SMALL COMPONENT ---------- */
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
    marginTop: 8,
  },

  buttonContainer: {
    marginVertical: 32,
  },
})
