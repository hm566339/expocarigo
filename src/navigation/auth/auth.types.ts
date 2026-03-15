// src/navigation/auth/auth.types.ts

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/* ---------------- Auth Stack Params ---------------- */

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
};

/* ---------------- Screen Props Helpers ---------------- */

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Login"
>;

export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Register"
>;

export type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "ForgotPassword"
>;

export type OTPVerificationScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "OTPVerification"
>;
