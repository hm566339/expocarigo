// Renter Navigation - Stack navigator for renter module
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import type React from "react"
import KYCStatusScreen from "../screens/renter/KYCStatusScreen"
import KYCUploadScreen from "../screens/renter/KYCUploadScreen"
import RatingScreen from "../screens/renter/RatingScreen"
import RenterProfileScreen from "../screens/renter/RenterProfileScreen"

const Stack = createNativeStackNavigator()

const RenterNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Stack.Screen name="RenterProfile" component={RenterProfileScreen} options={{ title: "My Profile" }} />
      <Stack.Screen name="KYCUpload" component={KYCUploadScreen} options={{ title: "Upload Documents" }} />
      <Stack.Screen name="KYCStatus" component={KYCStatusScreen} options={{ title: "KYC Status" }} />
      <Stack.Screen name="Rating" component={RatingScreen} options={{ title: "Rate Your Experience" }} />
    </Stack.Navigator>
  )
}

export default RenterNavigator
