import * as zod from "zod";
import { emailRule, passwordRule } from "./common";

// The API validates the full password format on login too
export const signinSchemaValidation = zod.object({
  email: emailRule,
  password: passwordRule,
});
