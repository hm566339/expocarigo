import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "../../context/AuthContext";

import { AuthNavigator } from "../../navigation/auth/AuthNavigator";
import { OwnerMainStack } from "../../navigation/owner/stacks/OwnerMainStack";
import { RenterMainStack } from "../../navigation/renter/stacks/RenterMainStack";

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  /* ---------------- Loading State ---------------- */
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ---------------- Role Based Navigation ---------------- */
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : user?.role === "OWNER" ? (
        <Stack.Screen name="OwnerApp" component={OwnerMainStack} />
      ) : user?.role === "REANT" ? (
        <Stack.Screen name="RenterApp" component={RenterMainStack} />
      ) : (
        /* Fallback Safety */
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};
