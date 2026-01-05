// "use client"

// import type React from "react"
// import { useState } from "react"
// import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native"
// import { useTheme } from "../../context/ThemeContext"

// interface ImageUploaderProps {
//   title: string
//   imageUri?: string
//   onUpload: () => Promise<void>
//   status: "pending" | "uploaded" | "error"
// }

// export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, imageUri, onUpload, status }) => {
//   const { colors } = useTheme()
//   const [loading, setLoading] = useState(false)

//   const handleUpload = async () => {
//     setLoading(true)
//     try {
//       await onUpload()
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getStatusColor = () => {
//     switch (status) {
//       case "uploaded":
//         return colors.success
//       case "error":
//         return colors.error
//       default:
//         return colors.textSecondary
//     }
//   }

//   const getStatusText = () => {
//     switch (status) {
//       case "uploaded":
//         return "Uploaded"
//       case "error":
//         return "Failed"
//       default:
//         return "Pending"
//     }
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
//       <View style={styles.header}>
//         <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
//         <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + "20" }]}>
//           <Text style={[styles.statusText, { color: getStatusColor() }]}>{getStatusText()}</Text>
//         </View>
//       </View>

//       <View style={[styles.imageContainer, { backgroundColor: colors.background }]}>
//         {imageUri ? (
//           <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
//         ) : (
//           <View style={styles.placeholder}>
//             <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>No image</Text>
//           </View>
//         )}
//       </View>

//       <TouchableOpacity
//         style={[styles.uploadButton, { backgroundColor: colors.primary }]}
//         onPress={handleUpload}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" size="small" />
//         ) : (
//           <Text style={styles.uploadButtonText}>{imageUri ? "Re-upload" : "Upload"}</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   imageContainer: {
//     height: 180,
//     borderRadius: 12,
//     overflow: "hidden",
//     marginBottom: 12,
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   placeholder: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   placeholderText: {
//     fontSize: 14,
//   },
//   uploadButton: {
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   uploadButtonText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "600",
//   },
// })




"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native"
import { useTheme } from "../../context/ThemeContext"

interface ImageUploaderProps {
  title: string
  imageUri?: string
  status: "pending" | "uploaded" | "error"

  /** Image / No-image box click */
  onImagePress: () => void

  /** Upload button click */
  onUpload: () => Promise<void>
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  title,
  imageUri,
  onImagePress,
  onUpload,
  status,
}) => {
  const { colors } = useTheme()
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!imageUri || loading) return

    setLoading(true)
    try {
      await onUpload()
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "uploaded":
        return colors.success
      case "error":
        return colors.error
      default:
        return colors.textSecondary
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "uploaded":
        return "Uploaded"
      case "error":
        return "Failed"
      default:
        return "Pending"
    }
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor() + "20" },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      {/* IMAGE / NO IMAGE BOX (CLICKABLE) */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onImagePress}
        style={[
          styles.imageContainer,
          { backgroundColor: colors.background },
        ]}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text
              style={[
                styles.placeholderText,
                { color: colors.textSecondary },
              ]}
            >
              No image
            </Text>
            <Text
              style={[
                styles.placeholderSubText,
                { color: colors.textSecondary },
              ]}
            >
              Tap to select
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* UPLOAD BUTTON */}
      <TouchableOpacity
        style={[
          styles.uploadButton,
          {
            backgroundColor: imageUri
              ? colors.primary
              : colors.border,
          },
        ]}
        onPress={handleUpload}
        disabled={!imageUri || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.uploadButtonText}>
            {imageUri ? "Upload" : "Select image first"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  imageContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: "500",
  },
  placeholderSubText: {
    fontSize: 12,
    marginTop: 4,
  },
  uploadButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
})
