// src/navigation/types/root-navigation.types.ts

import type { NavigatorScreenParams } from "@react-navigation/native";

import type { AuthStackParamList } from "../auth/auth.types";
import type { OwnerStackParamList } from "../owner/owner.types";
import type { RenterStackParamList } from "../renter/renter.types";

/* ---------------- Root Stack ---------------- */

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  OwnerApp: NavigatorScreenParams<OwnerStackParamList>;
  RenterApp: NavigatorScreenParams<RenterStackParamList>;
};
