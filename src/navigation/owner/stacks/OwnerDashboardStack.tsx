// src/navigation/owner/stacks/OwnerDashboardStack.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import LiveTrackingScreen from "../../../screens/owner/LiveTrackingScreen";
import OwnerDashboardScreen from "../../../screens/owner/OwnerDashboardScreen";
import TripRequestsScreen from "../../../screens/owner/TripRequestsScreen";

const Stack = createNativeStackNavigator();

export const OwnerDashboardStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
      <Stack.Screen name="TripRequests" component={TripRequestsScreen} />
      <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
    </Stack.Navigator>
  );
};
