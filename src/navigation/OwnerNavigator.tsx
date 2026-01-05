import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useTheme } from "../context/ThemeContext";

/* ---------------- Dashboard ---------------- */
import LiveTrackingScreen from "../screens/owner/LiveTrackingScreen";
import OwnerDashboardScreen from "../screens/owner/OwnerDashboardScreen";
import TripRequestsScreen from "../screens/owner/TripRequestsScreen";

/* ---------------- Cars ---------------- */
import AddCarScreen from "../screens/owner/AddCarScreen";
import MyCarsScreen from "../screens/owner/MyCarsScreen";
// import EditVehicleScreen from "../screens/vehicle/EditVehicleScreen";
import VehicleDetailScreen from "../screens/owner/VehicleDetailScreen";

/* ---------------- Other Tabs ---------------- */
import EarningsScreen from "../screens/owner/EarningsScreen";
import OwnerTripsScreen from "../screens/owner/OwnerTripsScreen";
import UpdateCarScreen from "../screens/owner/UpdateCarScreen";
import ProfileScreen from "../shared/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

/* ---------------- Dashboard Stack ---------------- */
const DashboardStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="OwnerDashboard" component={OwnerDashboardScreen} />
        <Stack.Screen name="TripRequests" component={TripRequestsScreen} />
        <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
    </Stack.Navigator>
);

/* ---------------- Cars Stack ---------------- */
const CarsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MyCarsMain" component={MyCarsScreen} />
        <Stack.Screen name="AddCar" component={AddCarScreen} />
        <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
        <Stack.Screen name="EditVehicle" component={UpdateCarScreen} />
    </Stack.Navigator>
);

/* ---------------- Owner Tabs ---------------- */
export const OwnerTabNavigator = () => {
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
                component={DashboardStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="view-dashboard" size={size} color={color} />
                    ),
                }}
            />

            <Tab.Screen
                name="My Cars"
                component={CarsStack}
                options={{
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
