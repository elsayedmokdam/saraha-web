"use server";

import $SERVICE_REPOSITORY from "../service.repo";
import { ApiResponse } from "../types/api_interface";
import {
  EmailOtpPayload,
  LoginPayload,
  ResetPasswordPayload,
  SignupPayload,
} from "../types/auth_interface";
import { LogoutAction } from "../types/enums";
import { HttpResult } from "../utils/http";

export async function signupAction(
  payload: SignupPayload,
): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.signup(payload);
}

/** Step 1 of two-step login: validates the credentials and emails the OTP. */
export async function twoFALoginAction(
  payload: LoginPayload,
): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.twoFALogin(payload);
}

export async function confirmEmailAction(
  payload: EmailOtpPayload,
): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.confirmEmail(payload);
}

export async function resendConfirmEmailOtpAction(payload: {
  email: string;
}): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.resendConfirmEmailOTP(payload);
}

export async function forgotPasswordAction(payload: {
  email: string;
}): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.forgotPassword(payload);
}

export async function verifyResetPasswordOtpAction(
  payload: EmailOtpPayload,
): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.verifyResetPasswordOTP(payload);
}

export async function resetPasswordAction(
  payload: ResetPasswordPayload,
): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.resetPassword(payload);
}

/** `action: 0` = this device only, `1` = every device */
export async function logoutAction(
  action: LogoutAction = 0,
): Promise<HttpResult<ApiResponse>> {
  return $SERVICE_REPOSITORY.Auth.logout(action === 1 ? 1 : 0);
}
