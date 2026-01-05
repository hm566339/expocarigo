// Image picker utility for camera and gallery

import { launchCamera, launchImageLibrary, type ImagePickerResponse, type Asset } from "react-native-image-picker"
import { Alert, Platform } from "react-native"
import { request, PERMISSIONS, RESULTS } from "react-native-permissions"

export interface PickedImage {
  uri: string
  type: string
  fileName: string
  fileSize: number
}

/**
 * Request camera permission
 */
const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const permission = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA

    const result = await request(permission)
    return result === RESULTS.GRANTED
  } catch (error) {
    console.error("Camera permission error:", error)
    return false
  }
}

/**
 * Request gallery permission
 */
const requestGalleryPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === "ios") {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
      return result === RESULTS.GRANTED
    } else {
      // Android 13+ uses READ_MEDIA_IMAGES
      if (Platform.Version >= 33) {
        const result = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES)
        return result === RESULTS.GRANTED
      } else {
        const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
        return result === RESULTS.GRANTED
      }
    }
  } catch (error) {
    console.error("Gallery permission error:", error)
    return false
  }
}

/**
 * Pick image from camera
 */
export const pickImageFromCamera = async (): Promise<PickedImage | null> => {
  try {
    const hasPermission = await requestCameraPermission()
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Camera permission is required to take photos.")
      return null
    }

    const result: ImagePickerResponse = await launchCamera({
      mediaType: "photo",
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      saveToPhotos: false,
    })

    if (result.didCancel) {
      return null
    }

    if (result.errorCode) {
      Alert.alert("Error", result.errorMessage || "Failed to capture image")
      return null
    }

    const asset: Asset | undefined = result.assets?.[0]
    if (asset && asset.uri) {
      return {
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        fileName: asset.fileName || `photo_${Date.now()}.jpg`,
        fileSize: asset.fileSize || 0,
      }
    }

    return null
  } catch (error) {
    console.error("Camera error:", error)
    Alert.alert("Error", "Failed to capture image")
    return null
  }
}

/**
 * Pick image from gallery
 */
export const pickImageFromGallery = async (): Promise<PickedImage | null> => {
  try {
    const hasPermission = await requestGalleryPermission()
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Gallery permission is required to select photos.")
      return null
    }

    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1920,
      selectionLimit: 1,
    })

    if (result.didCancel) {
      return null
    }

    if (result.errorCode) {
      Alert.alert("Error", result.errorMessage || "Failed to select image")
      return null
    }

    const asset: Asset | undefined = result.assets?.[0]
    if (asset && asset.uri) {
      return {
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        fileName: asset.fileName || `image_${Date.now()}.jpg`,
        fileSize: asset.fileSize || 0,
      }
    }

    return null
  } catch (error) {
    console.error("Gallery error:", error)
    Alert.alert("Error", "Failed to select image")
    return null
  }
}

/**
 * Show action sheet to choose camera or gallery
 */
export const showImagePickerOptions = (): Promise<"camera" | "gallery" | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      "Select Image",
      "Choose an option to upload image",
      [
        {
          text: "Camera",
          onPress: () => resolve("camera"),
        },
        {
          text: "Gallery",
          onPress: () => resolve("gallery"),
        },
        {
          text: "Cancel",
          onPress: () => resolve(null),
          style: "cancel",
        },
      ],
      { cancelable: true },
    )
  })
}
