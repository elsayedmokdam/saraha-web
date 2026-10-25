import * as zod from "zod";
import { dobRule, emailRule, phoneRule, usernameRule } from "./common";

// PUT /user/update-data (the API requires username, email and phone every time)
export const updateProfileSchemaValidation = zod.object({
  username: usernameRule,
  email: emailRule,
  phone: phoneRule,
  DOB: dobRule,
  gender: zod.string().optional(),
});
