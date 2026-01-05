import * as FileSystem from "expo-file-system"
import * as ImagePicker from "expo-image-picker"
import React, { useEffect, useState } from "react"
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"

import { ImageUploader } from "../../components/owner-profile"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import CarOwnerService from "../../services/api/car-owner.service"

/* ================= TYPES ================= */
type DocKey =
  | "aadhaarFront"
  | "aadhaarBack"
  | "selfie"
  | "drivingLicense"

type DocState = {
  uri: string
  status: "pending" | "uploaded" | "error"
  file?: {
    uri: string
    type: string
    name: string
  }
}

/* ================= FIX content:// URI ================= */
const normalizeUri = async (uri: string) => {
  if (uri.startsWith("file://")) return uri

  const fileName = uri.split("/").pop()!
  const newPath = FileSystem.cacheDirectory + fileName

  await FileSystem.copyAsync({
    from: uri,
    to: newPath,
  })

  return newPath
}

const KYCUploadScreen = () => {
  const { colors } = useTheme()
  const { user } = useAuth()
  const ownerId = user?.id?.toString()

  const [documents, setDocuments] = useState<Record<DocKey, DocState>>({
    aadhaarFront: { uri: "", status: "pending" },
    aadhaarBack: { uri: "", status: "pending" },
    selfie: { uri: "", status: "pending" },
    drivingLicense: { uri: "", status: "pending" },
  })

  /* ================= LOAD EXISTING KYC URLS ================= */
  useEffect(() => {
    if (!ownerId) return

    const loadKycImages = async () => {
      const updates: Partial<Record<DocKey, DocState>> = {}

      try {
        const url = await CarOwnerService.getAadhaarFront(ownerId)
        if (url) updates.aadhaarFront = { uri: url, status: "uploaded" }
      } catch { }

      try {
        const url = await CarOwnerService.getAadhaarBack(ownerId)
        if (url) updates.aadhaarBack = { uri: url, status: "uploaded" }
      } catch { }

      try {
        const url = await CarOwnerService.getSelfie(ownerId)
        if (url) updates.selfie = { uri: url, status: "uploaded" }
      } catch { }

      try {
        const url = await CarOwnerService.getDrivingLicense(ownerId)
        if (url) updates.drivingLicense = { uri: url, status: "uploaded" }
      } catch { }

      setDocuments(prev => ({ ...prev, ...updates }))
    }

    loadKycImages()
  }, [ownerId])

  /* ================= PICK IMAGE (CAMERA / GALLERY) ================= */
  const pickImage = async (
    docType: DocKey,
    source: "camera" | "gallery"
  ) => {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
      Alert.alert("Permission required")
      return
    }

    const isSelfie = docType === "selfie"

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
          quality: 0.8,
          cameraType: isSelfie
            ? ImagePicker.CameraType.front
            : ImagePicker.CameraType.back,
        })
        : await ImagePicker.launchImageLibraryAsync({
          quality: 0.8,
        })

    if (result.canceled) return

    const asset = result.assets[0]
    const fixedUri = await normalizeUri(asset.uri)

    setDocuments(prev => ({
      ...prev,
      [docType]: {
        uri: fixedUri,
        file: {
          uri: fixedUri,
          type: asset.mimeType ?? "image/jpeg",
          name: `${docType}.jpg`,
        },
        status: "pending",
      },
    }))
  }

  /* ================= CAMERA / GALLERY CHOOSER ================= */
  const chooseImageSource = (docType: DocKey) => {
    Alert.alert(
      "Upload Document",
      "Choose an option",
      [
        { text: "Camera", onPress: () => pickImage(docType, "camera") },
        { text: "Gallery", onPress: () => pickImage(docType, "gallery") },
        { text: "Cancel", style: "cancel" },
      ]
    )
  }

  /* ================= UPLOAD ================= */
  const uploadImage = async (docType: DocKey) => {
    if (!ownerId) return

    const doc = documents[docType]
    if (!doc.file) return

    try {
      switch (docType) {
        case "aadhaarFront":
          await CarOwnerService.uploadAadhaarFront(ownerId, doc.file)
          break
        case "aadhaarBack":
          await CarOwnerService.uploadAadhaarBack(ownerId, doc.file)
          break
        case "selfie":
          await CarOwnerService.uploadSelfie(ownerId, doc.file)
          break
        case "drivingLicense":
          await CarOwnerService.uploadDrivingLicense(ownerId, doc.file)
          break
      }

      const freshUrl =
        docType === "aadhaarFront"
          ? await CarOwnerService.getAadhaarFront(ownerId)
          : docType === "aadhaarBack"
            ? await CarOwnerService.getAadhaarBack(ownerId)
            : docType === "selfie"
              ? await CarOwnerService.getSelfie(ownerId)
              : await CarOwnerService.getDrivingLicense(ownerId)

      setDocuments(prev => ({
        ...prev,
        [docType]: { uri: freshUrl, status: "uploaded" },
      }))
    } catch {
      setDocuments(prev => ({
        ...prev,
        [docType]: { ...prev[docType], status: "error" },
      }))
    }
  }

  if (!ownerId) {
    return (
      <View style={styles.center}>
        <Text>User not authenticated</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <ImageUploader
          title="Aadhaar Card - Front"
          imageUri={documents.aadhaarFront.uri}
          status={documents.aadhaarFront.status}
          onImagePress={() => chooseImageSource("aadhaarFront")}
          onUpload={() => uploadImage("aadhaarFront")}
        />

        <ImageUploader
          title="Aadhaar Card - Back"
          imageUri={documents.aadhaarBack.uri}
          status={documents.aadhaarBack.status}
          onImagePress={() => chooseImageSource("aadhaarBack")}
          onUpload={() => uploadImage("aadhaarBack")}
        />

        <ImageUploader
          title="Selfie"
          imageUri={documents.selfie.uri}
          status={documents.selfie.status}
          onImagePress={() => chooseImageSource("selfie")}
          onUpload={() => uploadImage("selfie")}
        />

        <ImageUploader
          title="Pan card"
          imageUri={documents.drivingLicense.uri}
          status={documents.drivingLicense.status}
          onImagePress={() => chooseImageSource("drivingLicense")}
          onUpload={() => uploadImage("drivingLicense")}
        />
      </ScrollView>
    </View>
  )
}

export default KYCUploadScreen

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { padding: 20 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
