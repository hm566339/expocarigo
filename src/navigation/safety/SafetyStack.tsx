// src/navigation/safety/SafetyStack.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import EmergencySOSScreen from "../../screens/safety/EmergencySOSScreen";
import LiveTrackingScreen from "../../screens/safety/LiveTrackingScreen";
import PreTripPhotosScreen from "../../screens/safety/PreTripPhotosScreen";
import TrustScoreScreen from "../../screens/safety/TrustScoreScreen";

const Stack = createNativeStackNavigator();

export const SafetyStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#e0e0e0",
        },
        headerTintColor: "#212121",
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="LiveTracking"
        component={LiveTrackingScreen}
        options={{ title: "Live GPS Tracking" }}
      />
      <Stack.Screen
        name="EmergencySOS"
        component={EmergencySOSScreen}
        options={{ title: "Emergency SOS" }}
      />
      <Stack.Screen
        name="TrustScore"
        component={TrustScoreScreen}
        options={{ title: "Trust Score" }}
      />
      <Stack.Screen
        name="PreTripPhotos"
        component={PreTripPhotosScreen}
        options={{ title: "Pre-Trip Photos" }}
      />
    </Stack.Navigator>
  );
};
