import * as zod from "zod";
import { passwordRule } from "./common";

// PATCH /user/update-password
export const updatePasswordSchemaValidation = zod
  .object({
    currentPassword: passwordRule,
    newPassword: passwordRule,
    confirmPassword: zod
      .string("Confirm password is required")
      .nonempty("Confirm password is required"),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(({ currentPassword, newPassword }) => currentPassword !== newPassword, {
    error: "The new password must be different from the current one",
    path: ["newPassword"],
  });
