import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";
import RenterService from "../../services/api/renter.service";
import type { Renter, RenterKYCDocument } from "../../types/renter.types";

const KYCUploadScreen: React.FC = () => {
  const { user } = useAuth();
  const [renter, setRenter] = useState<Renter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [aadhaarFront, setAadhaarFront] = useState<RenterKYCDocument | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<RenterKYCDocument | null>(null);
  const [selfie, setSelfie] = useState<RenterKYCDocument | null>(null);
  const [drivingLicense, setDrivingLicense] = useState<RenterKYCDocument | null>(null);

  useEffect(() => {
    loadRenterStatus();
  }, []);

  const loadRenterStatus = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const renterData = await RenterService.getRenter(user.id);
      setRenter(renterData);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load KYC status");
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= IMAGE PICKER ================= */
  const showImagePicker = (
    documentType: "AADHAAR_FRONT" | "AADHAAR_BACK" | "SELFIE" | "DRIVING_LICENSE",
    cameraOnly = false
  ) => {
    Alert.alert("Select Image", "Choose image source", [
      {
        text: "Camera",
        onPress: () => pickImage(documentType, true),
      },
      ...(cameraOnly
        ? []
        : [
          {
            text: "Gallery",
            onPress: () => pickImage(documentType, false),
          },
        ]),
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickImage = async (
    documentType: "AADHAAR_FRONT" | "AADHAAR_BACK" | "SELFIE" | "DRIVING_LICENSE",
    useCamera: boolean
  ) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Permission is required to upload documents");
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
        quality: 0.8,
      })
      : await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

    if (result.canceled) return;

    const asset = result.assets[0];

    const document: RenterKYCDocument = {
      type: documentType,
      uri: asset.uri,
      fileName: `${documentType}_${Date.now()}.jpg`,
      fileType: asset.mimeType || "image/jpeg",
    };

    switch (documentType) {
      case "AADHAAR_FRONT":
        setAadhaarFront(document);
        break;
      case "AADHAAR_BACK":
        setAadhaarBack(document);
        break;
      case "SELFIE":
        setSelfie(document);
        break;
      case "DRIVING_LICENSE":
        setDrivingLicense(document);
        break;
    }
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!user?.id) return;

    if (!aadhaarFront || !aadhaarBack || !selfie || !drivingLicense) {
      Alert.alert("Validation Error", "Please upload all required documents");
      return;
    }

    setIsUploading(true);
    try {
      const documents: RenterKYCDocument[] = [
        aadhaarFront,
        aadhaarBack,
        selfie,
        drivingLicense,
      ];

      const response = await RenterService.uploadKYC(user.id, documents);
      Alert.alert("Success", response.message || "KYC uploaded successfully");

      await loadRenterStatus();

      setAadhaarFront(null);
      setAadhaarBack(null);
      setSelfie(null);
      setDrivingLicense(null);
    } catch (error: any) {
      Alert.alert("Upload Failed", error.message || "Failed to upload KYC documents");
    } finally {
      setIsUploading(false);
    }
  };

  const renderDocumentCard = (
    title: string,
    document: RenterKYCDocument | null,
    onPress: () => void
  ) => (
    <View style={styles.documentCard}>
      <Text style={styles.documentTitle}>{title}</Text>

      {document ? (
        <>
          <Image source={{ uri: document.uri }} style={styles.previewImage} />
          <TouchableOpacity style={styles.changeButton} onPress={onPress}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
          <Text style={styles.uploadButtonText}>Upload {title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {renter && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusText}>KYC Status: {renter.kycStatus}</Text>
        </View>
      )}

      {renderDocumentCard("Aadhaar Front", aadhaarFront, () =>
        showImagePicker("AADHAAR_FRONT")
      )}
      {renderDocumentCard("Aadhaar Back", aadhaarBack, () =>
        showImagePicker("AADHAAR_BACK")
      )}
      {renderDocumentCard("Selfie", selfie, () =>
        showImagePicker("SELFIE", true)
      )}
      {renderDocumentCard("Driving License", drivingLicense, () =>
        showImagePicker("DRIVING_LICENSE")
      )}

      <TouchableOpacity
        style={[styles.submitButton, isUploading && styles.disabled]}
        onPress={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit for Verification</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default KYCUploadScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  statusBanner: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: { fontWeight: "600" },
  documentCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  documentTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  previewImage: { width: "100%", height: 200, borderRadius: 8 },
  uploadButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadButtonText: { color: "#fff", fontWeight: "600" },
  changeButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    alignItems: "center",
  },
  changeButtonText: { color: "#007AFF" },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: { color: "#fff", fontWeight: "600" },
  disabled: { opacity: 0.6 },
});
