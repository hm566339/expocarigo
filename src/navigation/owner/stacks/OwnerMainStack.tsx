// src/navigation/owner/stacks/OwnerMainStack.tsx

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { OwnerTabNavigator } from "../tabs/OwnerTabNavigator";
import { CarOwnerStack } from "./CarOwnerStack";

const Stack = createNativeStackNavigator();

export const OwnerMainStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OwnerTabs" component={OwnerTabNavigator} />
      <Stack.Screen name="CarOwner" component={CarOwnerStack} />
    </Stack.Navigator>
  );
};
