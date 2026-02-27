/**
 * Auth Navigation Stack
 * Handles navigation for authentication screens
 */

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen"
import { LoginScreen } from "../screens/auth/LoginScreen"
import { OTPVerificationScreen } from "../screens/auth/OTPVerificationScreen"
import { RegisterScreen } from "../screens/auth/RegisterScreen"

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  OTPVerification: { email: string }
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  )
}
