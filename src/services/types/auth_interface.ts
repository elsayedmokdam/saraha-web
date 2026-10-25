export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  /** Egyptian number: 01[0125]xxxxxxxx (optionally prefixed by +2 / 002) */
  phone: string;
  /** ISO date (YYYY-MM-DD) */
  DOB?: string;
  /** 0 = male, 1 = female (must be a JSON number) */
  gender?: 0 | 1;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface EmailOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload extends EmailOtpPayload {
  newPassword: string;
  confirmPassword: string;
}
