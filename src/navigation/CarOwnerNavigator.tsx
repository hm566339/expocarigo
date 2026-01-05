"use client"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { BankDetailsScreen } from "../screens/car-owner/BankDetailsScreen"
import { CreateCarOwnerScreen } from "../screens/car-owner/CreateCarOwnerScreen"
import DownloadDocumant from "../screens/car-owner/DownloadDocumant"
import KYCUploadScreen from "../screens/car-owner/KYCUploadScreen"
import { OwnerDetailScreen } from "../screens/car-owner/OwnerDetailScreen"
import { OwnerListScreen } from "../screens/car-owner/OwnerListScreen"
import { OwnerWalletScreen } from "../screens/car-owner/OwnerWalletScreen"
import { RatingAndTripsScreen } from "../screens/car-owner/RatingAndTripsScreen"
import { UpdateCarOwnerProfileScreen } from "../screens/car-owner/UpdateCarOwnerProfileScreen"
import { ViewCarOwnerProfileScreen } from "../screens/car-owner/ViewCarOwnerProfileScreen"
import { HelpAndSupportScreen, NotificationsScreen, SettingsScreen, TermsAndPoliciesScreen } from "../screens/common"

const Stack = createNativeStackNavigator()

export const CarOwnerNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2196F3",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "700",
        },
      }}
    >
      <Stack.Screen name="OwnerList" component={OwnerListScreen} options={{ title: "Car Owners" }} />

      <Stack.Screen name="CreateCarOwner" component={CreateCarOwnerScreen} options={{ title: "Create Owner" }} />

      <Stack.Screen
        name="ViewCarOwnerProfile"
        component={ViewCarOwnerProfileScreen}
        options={{ title: "Owner Profile" }}
      />

      <Stack.Screen
        name="UpdateCarOwnerProfile"
        component={UpdateCarOwnerProfileScreen}
        options={{ title: "Edit Profile" }}
      />

      <Stack.Screen
        name="DownloadDocument"
        component={DownloadDocumant}
        options={{ title: "Download Document" }}
      />

      <Stack.Screen name="KYCUpload" component={KYCUploadScreen} options={{ title: "KYC Documents" }} />

      <Stack.Screen name="OwnerWallet" component={OwnerWalletScreen} options={{ title: "Wallet" }} />

      <Stack.Screen name="BankDetails" component={BankDetailsScreen} options={{ title: "Bank Details" }} />

      <Stack.Screen name="RatingAndTrips" component={RatingAndTripsScreen} options={{ title: "Rating & Trips" }} />

      <Stack.Screen name="OwnerDetail" component={OwnerDetailScreen} options={{ title: "Owner Details" }} />

      <Stack.Screen name="help&support" component={HelpAndSupportScreen} options={{ title: "Owner Details" }} />

      <Stack.Screen name="notificationsScreen" component={NotificationsScreen} options={{ title: "Owner Details" }} />

      <Stack.Screen name="settingsScreen" component={SettingsScreen} options={{ title: "Owner Details" }} />

      <Stack.Screen name="termsAndPoliciesScreen" component={TermsAndPoliciesScreen} options={{ title: "Owner Details" }} />


    </Stack.Navigator>
  )
}
// NotificationsScreen