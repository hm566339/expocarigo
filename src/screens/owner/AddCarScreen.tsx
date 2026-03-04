"use client"

import * as ImagePicker from "expo-image-picker"
import { useEffect, useRef, useState } from "react"
import { Alert, Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import React from "react"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import VehicleService from "../../services/api/vehicle.service"
import type { BillingMode } from "../../types/vehicle.types"

export default function AddCarScreen({ navigation }: any) {
  const { colors } = useTheme()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [vehicleNumber, setVehicleNumber] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [ratePerDay, setRatePerDay] = useState("")
  const [ratePerHour, setRatePerHour] = useState("")
  const billingMode: BillingMode = "PER_DAY"

  const [rcFrontImage, setRcFrontImage] = useState<any>(null)
  const [rcBackImage, setRcBackImage] = useState<any>(null)
  const [vehicleImages, setVehicleImages] = useState<any[]>([])
  const [vehicleVideo, setVehicleVideo] = useState<any>(null)
  const [location, setLocation] = useState<any>(null)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const [cardAnimations] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ])

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()

    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 200 + index * 120,
        useNativeDriver: true,
      }).start()
    })
  }, [])

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!granted) {
      Alert.alert("Permission required")
      return false
    }
    return true
  }

  const pickImage = async (cb: any, options: any) => {
    if (!(await requestPermission())) return
    const res = await ImagePicker.launchImageLibraryAsync(options)
    if (!res.canceled) cb(res.assets)
  }

  const handleSubmit = async () => {
    if (!user?.id) {
      return Alert.alert("Error", "User not logged in")
    }

    if (!vehicleNumber.trim()) {
      return Alert.alert("Error", "Vehicle number is required")
    }

    // 🔥 DUMMY LOCATION (FOR NOW)
    const finalLocation = location ?? {
      latitude: 28.6139,
      longitude: 77.209,
      address: "Connaught Place, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      postalCode: "110001",
    }

    console.log("========== ADD CAR DEBUG ==========")
    console.log("USER ID =>", user.id)
    console.log("Vehicle Number =>", vehicleNumber)
    console.log("Owner Name =>", ownerName)
    console.log("Billing Mode =>", billingMode)
    console.log("Rate Per Day =>", Number(ratePerDay))
    console.log("Rate Per Hour =>", Number(ratePerHour))
    console.log("Location =>", finalLocation)
    console.log("RC Front Image =>", rcFrontImage)
    console.log("RC Back Image =>", rcBackImage)
    console.log("Vehicle Images =>", vehicleImages)
    console.log("Vehicle Video =>", vehicleVideo)
    console.log("===================================")

    try {
      setLoading(true)

      console.log("api call")
      await VehicleService.createVehicle(user.id.toString(), {
        vehicleNumber,
        ownerName,
        billingMode,
        ratePerDay: Number(ratePerDay),
        ratePerHour: Number(ratePerHour),
        location: finalLocation, // ✅ always present
        rcFrontImage,
        rcBackImage,
        vehicleImages,
        vehicleVideo,
      })
      Alert.alert("Success", "Vehicle added successfully")
      console.log("ho gaya")
      navigation.goBack()

    } catch (e) {
      console.error(e)
      Alert.alert("Error", "Failed to add vehicle")
    } finally {
      setLoading(false)
    }
  }


  return (
    // <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Add Your Vehicle</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Complete all details to list your car</Text>
      </Animated.View>

      {/* MEDIA SECTION */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 28 }]}>Vehicle Media</Text>
        <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
          Upload high-quality images and video
        </Text>
      </Animated.View>

      {/* MEDIA GRID */}
      <Animated.View
        style={[
          styles.uploadGrid,
          {
            opacity: Animated.divide(
              Animated.add(
                Animated.add(cardAnimations[0], cardAnimations[1]),
                Animated.add(cardAnimations[2], cardAnimations[3]),
              ),
              4,
            ),
          },
        ]}
      >
        <UploadMini
          title="RC Front"
          icon="file-image"
          file={rcFrontImage}
          colors={colors}
          animValue={cardAnimations[0]}
          onPress={() =>
            pickImage((a: any) => setRcFrontImage({ uri: a[0].uri }), {
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            })
          }
        />
        <UploadMini
          title="RC Back"
          icon="file-image"
          file={rcBackImage}
          colors={colors}
          animValue={cardAnimations[1]}
          onPress={() =>
            pickImage((a: any) => setRcBackImage({ uri: a[0].uri }), {
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            })
          }
        />
        <UploadMini
          title="Photos"
          icon="camera"
          file={vehicleImages[0]}
          colors={colors}
          animValue={cardAnimations[2]}
          onPress={() =>
            pickImage((a: any) => setVehicleImages(a), {
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsMultipleSelection: true,
            })
          }
        />
        <UploadMini
          title="Video"
          icon="video"
          file={vehicleVideo}
          colors={colors}
          animValue={cardAnimations[3]}
          onPress={() =>
            pickImage((a: any) => setVehicleVideo({ uri: a[0].uri }), {
              mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            })
          }
        />
      </Animated.View>

      {/* DETAILS SECTION */}
      {/* <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 32 }]}>Vehicle Details</Text> */}
      <View style={styles.inputContainer}>
        <Input label="Vehicle Number" value={vehicleNumber} onChangeText={setVehicleNumber} placeholder="ABC 1234 XY" />
        <Input label="Owner Name" value={ownerName} onChangeText={setOwnerName} placeholder="John Doe" />
        <View style={styles.rateRow}>
          <View style={styles.rateInput}>
            <Input
              label="Daily Rate"
              value={ratePerDay}
              onChangeText={setRatePerDay}
              keyboardType="numeric"
              placeholder="500"
            />
          </View>
          <View style={styles.rateInput}>
            <Input
              label="Hourly Rate"
              value={ratePerHour}
              onChangeText={setRatePerHour}
              keyboardType="numeric"
              placeholder="100"
            />
          </View>
        </View>
      </View>

      {/* LOCATION */}
      <TouchableOpacity
        style={[styles.locationBtn, { backgroundColor: colors.surface }]}
        onPress={() =>
          navigation.navigate("PickLocation", {
            location,
            onSelect: (loc: any) => setLocation(loc),
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.locationContent}>
          <Icon name="map-marker" size={20} color={colors.primary || "#3B82F6"} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.locationLabel, { color: colors.textSecondary }]}>Location</Text>
            <Text style={[styles.locationText, { color: colors.text }]}>
              {location ? "Location Set" : "Tap to set location"}
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      {/* SUBMIT BUTTON */}
      <Button title="Add Car" onPress={handleSubmit} loading={loading} fullWidth style={styles.submitBtn} />
    </ScrollView>
  )
}

/* ---------- ENHANCED UPLOAD CARD ---------- */
const UploadMini = ({ title, icon, onPress, file, colors, animValue }: any) => {
  const [scaleAnim] = useState(new Animated.Value(1))
  const rotateAnim = useRef(new Animated.Value(0)).current

  const handlePress = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.92,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: file ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
    onPress()
  }

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "5deg"],
  })

  return (
    <Animated.View
      style={[
        styles.uploadMiniContainer,
        {
          opacity: animValue,
          transform: [
            {
              scale: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.85, 1],
              }),
            },
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        style={[
          styles.uploadMini,
          {
            backgroundColor: file ? colors.primary + "08" : colors.surface,
            borderColor: file ? colors.primary || "#3B82F6" : colors.border || "#E5E7EB",
            borderWidth: 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconWrapper,
            {
              transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
            },
          ]}
        >
          {file ? (
            <View style={styles.previewWrapper}>
              <Image source={{ uri: file.uri }} style={styles.miniPreview} />
              <View style={styles.checkmarkOverlay}>
                <Icon name="check-circle" size={24} color={colors.primary || "#3B82F6"} />
              </View>
            </View>
          ) : (
            <Icon name={icon} size={36} color={colors.primary || "#3B82F6"} />
          )}
        </Animated.View>
        <Text style={[styles.miniText, { color: colors.text }]}>{title}</Text>
        <Text
          style={[
            styles.miniSubtext,
            {
              color: file ? colors.primary || "#3B82F6" : colors.textSecondary,
              fontWeight: file ? "600" : "400",
            },
          ]}
        >
          {file ? "Done" : "Tap"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // paddingVertical: 24,
    paddingTop: 40

  },

  header: {
    marginBottom: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.3,
  },

  sectionDescription: {
    fontSize: 13,
    fontWeight: "400",
    marginBottom: 16,
    lineHeight: 18,
  },

  uploadGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 8,
  },

  uploadMiniContainer: {
    width: "48%",
    marginBottom: 8,
  },

  uploadMini: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  iconWrapper: {
    marginBottom: 10,
  },

  previewWrapper: {
    position: "relative",
  },

  miniPreview: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },

  checkmarkOverlay: {
    position: "absolute",
    right: -6,
    bottom: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  miniText: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
    letterSpacing: -0.2,
  },

  miniSubtext: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 4,
  },

  inputContainer: {
    gap: 12,
    marginBottom: 16,
  },

  rateRow: {
    flexDirection: "row",
    gap: 12,
  },

  rateInput: {
    flex: 1,
  },

  locationBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },

  locationContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  locationText: {
    fontSize: 15,
    fontWeight: "600",
  },

  submitBtn: {
    marginBottom: 24,
    marginTop: 16,
  },
  scrollContent: {
    paddingBottom: 70,
  },

})
