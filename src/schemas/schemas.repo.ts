import { confirmEmailSchemaValidation, twoFAOtpSchemaValidation } from "./otpSchema";
import { forgotPasswordSchemaValidation } from "./forgotPasswordSchema";
import { resetPasswordSchemaValidation } from "./resetPasswordSchema";
import { signinSchemaValidation } from "./signinSchema";
import { signupSchemaValidation } from "./signupSchema";
import { updateProfileSchemaValidation } from "./updateProfileSchema";
import { updatePasswordSchemaValidation } from "./updatePasswordSchema";
import { verifyResetCodeSchemaValidation } from "./verifyResetCodeSchema";
import {
  conversationMessageSchemaValidation,
  sendMessageSchemaValidation,
} from "./sendMessageSchema";

export const $SCHEMAS_REPOSITORY = {
  SIGNUP_FORM: signupSchemaValidation,
  SIGNIN_FORM: signinSchemaValidation,
  TWO_FA_OTP_FORM: twoFAOtpSchemaValidation,
  CONFIRM_EMAIL_FORM: confirmEmailSchemaValidation,
  FORGOT_PASSWORD_FORM: forgotPasswordSchemaValidation,
  VERIFY_RESET_CODE_FORM: verifyResetCodeSchemaValidation,
  RESET_PASSWORD_FORM: resetPasswordSchemaValidation,
  UPDATE_PROFILE_FORM: updateProfileSchemaValidation,
  UPDATE_PASSWORD_FORM: updatePasswordSchemaValidation,
  SEND_MESSAGE_FORM: sendMessageSchemaValidation,
  CONVERSATION_MESSAGE_FORM: conversationMessageSchemaValidation,
} as const;
