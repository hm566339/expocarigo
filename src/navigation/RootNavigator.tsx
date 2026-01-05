import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { ActivityIndicator, View } from "react-native"

import { useAuth } from "../context/AuthContext"
import { AuthNavigator } from "./AuthNavigator"
import MainNavigator from "./MainNavigator"
import { OwnerMainStack } from "./OwnerMainStack"

const Stack = createNativeStackNavigator()

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : user?.role === "OWNER" ? (
        <Stack.Screen name="OwnerApp" component={OwnerMainStack} />
      ) : user?.role === "REANT" ? (
        <Stack.Screen name="RenterApp" component={MainNavigator} />
      ) : (
        // fallback safety
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  )
}
