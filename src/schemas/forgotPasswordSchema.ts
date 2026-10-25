import * as zod from "zod";
import { emailRule } from "./common";

export const forgotPasswordSchemaValidation = zod.object({ email: emailRule });
