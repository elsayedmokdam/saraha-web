import { signupService } from "./signup.service";
import { loginService } from "./login.service";
import { twoFALoginService } from "./twoFALogin.service";
import { verify2FALoginService } from "./verify2FALogin.service";
import { signupWithGmailService } from "./signupWithGmail.service";
import { confirmEmailService } from "./confirmEmail.service";
import { resendConfirmEmailOTPService } from "./resendConfirmEmailOTP.service";
import { forgotPasswordService } from "./forgotPassword.service";
import { verifyResetPasswordOTPService } from "./verifyResetPasswordOTP.service";
import { resetPasswordService } from "./resetPassword.service";
import { logoutService } from "./logout.service";

export const AuthRepo = {
  signup: signupService,
  login: loginService,
  twoFALogin: twoFALoginService,
  verify2FALogin: verify2FALoginService,
  signupWithGmail: signupWithGmailService,
  confirmEmail: confirmEmailService,
  resendConfirmEmailOTP: resendConfirmEmailOTPService,
  forgotPassword: forgotPasswordService,
  verifyResetPasswordOTP: verifyResetPasswordOTPService,
  resetPassword: resetPasswordService,
  logout: logoutService,
};
