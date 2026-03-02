// src/navigation/renter/tabs/RenterTabNavigator.tsx

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import BookingsScreen from "../../../screens/renters/bookings/BookingsScreen";
import HomeScreen from "../../../screens/renters/home/HomeScreen";
import SearchScreen from "../../../screens/renters/search/SearchScreen";
import { RenterProfileStack } from "../stacks/RenterProfileStack";

import type { RenterTabParamList } from "../renter.types";

const Tab = createBottomTabNavigator<RenterTabParamList>();

export const RenterTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#888",
        tabBarIcon: ({ color, size }) => {
          let iconName: any = "home";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Search") iconName = "search";
          else if (route.name === "Bookings") iconName = "calendar";
          else if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Profile" component={RenterProfileStack} />
    </Tab.Navigator>
  );
};
