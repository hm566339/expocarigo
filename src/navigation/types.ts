import type { RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { QuoteResponse } from "../types/index"

export type RootStackParamList = {
  Auth: undefined
  Main: undefined
  Splash: undefined
}

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  VerifyOTP: { email: string }
}

export type MainStackParamList = {
  HomeTabs: undefined
  CarDetail: { vehicleId: string }
  BookingSummary: { vehicleId: string; startDate: string; endDate: string; quote: QuoteResponse }
  PaymentScreen: { bookingId: string; totalAmount: number }
  ActiveTrip: { bookingId: string }
  TripEnd: { bookingId: string }
  ExtendTrip: { bookingId: string }
  RateOwner: { bookingId: string }
}

export type HomeTabsParamList = {
  Home: undefined
  Search: undefined
  Bookings: undefined
  Profile: undefined
}

export type NavigationProp<T extends keyof RootStackParamList | MainStackParamList> = NativeStackNavigationProp<
  RootStackParamList & MainStackParamList,
  T extends keyof MainStackParamList ? T : keyof RootStackParamList
>

export type RoutePropType<T extends keyof RootStackParamList | MainStackParamList> = RouteProp<
  RootStackParamList & MainStackParamList,
  T extends keyof MainStackParamList ? T : keyof RootStackParamList
>
