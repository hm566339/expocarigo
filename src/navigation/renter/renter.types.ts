// src/navigation/renter/renter.types.ts

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/* ---------------- Renter Tabs ---------------- */

export type RenterTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Profile: undefined;
};

/* ---------------- Renter Main Stack ---------------- */

export type RenterStackParamList = {
  RenterTabs: undefined;
  CarDetail: { vehicleId: string };
  BookingSummary: {
    vehicleId: string;
    startDate: string;
    endDate: string;
  };
  PaymentScreen: { bookingId: string; totalAmount: number };
  ActiveTrip: { bookingId: string };
  TripEnd: { bookingId: string };
  ExtendTrip: { bookingId: string };
  RateOwner: { bookingId: string };
};

/* ---------------- Renter Profile Stack ---------------- */

export type RenterProfileStackParamList = {
  RenterProfile: undefined;
  KYCUpload: undefined;
  KYCStatus: undefined;
  Rating: undefined;
};

/* ---------------- Screen Props Helpers ---------------- */

export type RenterTabScreenProps<T extends keyof RenterTabParamList> =
  BottomTabScreenProps<RenterTabParamList, T>;

export type RenterStackScreenProps<T extends keyof RenterStackParamList> =
  NativeStackScreenProps<RenterStackParamList, T>;
