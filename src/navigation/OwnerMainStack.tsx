import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { CarOwnerNavigator } from "./CarOwnerNavigator";
import { OwnerTabNavigator } from "./OwnerNavigator";

const Stack = createNativeStackNavigator();

export const OwnerMainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Bottom Tabs */}
            <Stack.Screen
                name="OwnerTabs"
                component={OwnerTabNavigator}
            />

            {/* Car Owner Flow */}
            <Stack.Screen
                name="CarOwner"
                component={CarOwnerNavigator}
            />
        </Stack.Navigator>
    );
};
