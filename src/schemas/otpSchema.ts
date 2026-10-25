import * as zod from "zod";
import { emailRule, otpRule } from "./common";

/** Two-step login: only the code (the email is already known) */
export const twoFAOtpSchemaValidation = zod.object({ otp: otpRule });

/** Confirm email: email + code */
export const confirmEmailSchemaValidation = zod.object({
  email: emailRule,
  otp: otpRule,
});
