// src/navigation/renter/stacks/RenterMainStack.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { RenterTabNavigator } from "../tabs/RenterTabNavigator";

// import PaymentScreen from "../../../screens/renter/";
import BookingSummaryScreen from "../../../screens/renters/booking/BookingSummaryScreen";
import RateOwnerScreen from "../../../screens/renters/rating/RateOwnerScreen";
import {
  default as ActiveTripScreen,
  default as ExtendTripScreen,
} from "../../../screens/renters/trip/ExtendTripScreen";
import TripEndScreen from "../../../screens/renters/trip/TripEndScreen";

import VehicleRentalDetailScreen from "@/src/screens/renters/VehicleRentalDetailScreen";
import type { RenterStackParamList } from "../renter.types";

const Stack = createNativeStackNavigator<RenterStackParamList>();

export const RenterMainStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RenterTabs" component={RenterTabNavigator} />

      <Stack.Screen name="CarDetail" component={VehicleRentalDetailScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      {/* <Stack.Screen name="PaymentScreen" component={PaymentScreen} /> */}
      <Stack.Screen name="ActiveTrip" component={ActiveTripScreen} />
      <Stack.Screen name="TripEnd" component={TripEndScreen} />
      <Stack.Screen name="ExtendTrip" component={ExtendTripScreen} />
      <Stack.Screen name="RateOwner" component={RateOwnerScreen} />
    </Stack.Navigator>
  );
};
