import * as zod from "zod";
import { passwordRule } from "./common";

export const resetPasswordSchemaValidation = zod
  .object({
    newPassword: passwordRule,
    confirmPassword: zod.string("Confirm password is required").nonempty("Confirm password is required"),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });
