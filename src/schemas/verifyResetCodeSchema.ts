import * as zod from "zod";
import { otpRule } from "./common";

export const verifyResetCodeSchemaValidation = zod.object({ otp: otpRule });
