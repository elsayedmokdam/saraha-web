import * as zod from "zod";
import { dobRule, emailRule, passwordRule, phoneRule, usernameRule } from "./common";

export const signupSchemaValidation = zod
  .object({
    username: usernameRule,
    email: emailRule,
    password: passwordRule,
    confirmPassword: zod.string("Confirm password is required").nonempty("Confirm password is required"),
    phone: phoneRule,
    DOB: dobRule,
    gender: zod.string().optional(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });
