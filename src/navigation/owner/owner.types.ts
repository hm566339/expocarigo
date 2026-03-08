// src/navigation/owner/owner.types.ts

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/* ---------------- Owner Tab Params ---------------- */

export type OwnerTabParamList = {
  Dashboard: undefined;
  MyCars: undefined;
  Trips: undefined;
  Earnings: undefined;
  Profile: undefined;
};

/* ---------------- Owner Stack Params ---------------- */

export type OwnerStackParamList = {
  OwnerTabs: undefined;
  CarOwner: undefined;
};

/* ---------------- Dashboard Stack Params ---------------- */

export type OwnerDashboardStackParamList = {
  OwnerDashboard: undefined;
  TripRequests: undefined;
  LiveTracking: undefined;
};

/* ---------------- Screen Prop Helpers ---------------- */

export type OwnerTabScreenProps<T extends keyof OwnerTabParamList> =
  BottomTabScreenProps<OwnerTabParamList, T>;

export type OwnerStackScreenProps<T extends keyof OwnerStackParamList> =
  NativeStackScreenProps<OwnerStackParamList, T>;
