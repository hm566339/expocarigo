import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/* ============================================================
   SHARED TYPES
============================================================ */

export interface BookingQuote {
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  currency: string;
}

/* ============================================================
   RENTER TAB NAVIGATION
============================================================ */

export type RenterTabParamList = {
  Home: undefined;
  Search: undefined;
  Bookings: undefined;
  Profile: undefined;
};

/* ============================================================
   RENTER STACK NAVIGATION
============================================================ */

export type RenterStackParamList = {
  RenterTabs: undefined;

  CarDetail: {
    vehicleId: string;
  };

  BookingSummary: {
    vehicleId: string;
    startDate: string;
    endDate: string;
    quote: BookingQuote;
  };

  PaymentScreen: {
    bookingId: string;
    totalAmount: number;
  };

  ActiveTrip: {
    bookingId: string;
  };

  TripEnd: {
    bookingId: string;
  };

  ExtendTrip: {
    bookingId: string;
  };

  RateOwner: {
    bookingId: string;
  };
};

/* ============================================================
   PROFILE STACK
============================================================ */

export type RenterProfileStackParamList = {
  RenterProfile: undefined;
  KYCUpload: undefined;
  KYCStatus: undefined;
  Rating: undefined;
};

/* ============================================================
   SCREEN PROP HELPERS
============================================================ */

export type RenterTabScreenProps<T extends keyof RenterTabParamList> =
  BottomTabScreenProps<RenterTabParamList, T>;

export type RenterStackScreenProps<T extends keyof RenterStackParamList> =
  NativeStackScreenProps<RenterStackParamList, T>;
