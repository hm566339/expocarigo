// src/navigation/owner/tabs/OwnerTabNavigator.tsx

import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { useTheme } from "../../../context/ThemeContext";

import EarningsScreen from "../../../screens/owner/EarningsScreen";
import MyCarsScreen from "../../../screens/owner/MyCarsScreen";
import OwnerTripsScreen from "../../../screens/owner/OwnerTripsScreen";
import ProfileScreen from "../../../shared/ProfileScreen";
import { OwnerDashboardStack } from "../stacks/OwnerDashboardStack";

import type { OwnerTabParamList } from "../owner.types";

const Tab = createBottomTabNavigator<OwnerTabParamList>();

export const OwnerTabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={OwnerDashboardStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="MyCars"
        component={MyCarsScreen}
        options={{
          title: "My Cars",
          tabBarIcon: ({ color, size }) => (
            <Icon name="car" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Trips"
        component={OwnerTripsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="calendar-clock" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="currency-inr" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
