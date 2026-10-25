import * as zod from "zod";

// These rules mirror the API's `generalValidationFields` so users get the error before the request is sent.
export const emailRule = zod
  .string("Email is required")
  .nonempty("Email is required")
  .email("Please enter a valid email");

export const passwordRule = zod
  .string("Password is required")
  .nonempty("Password is required")
  .min(6, "Password must be at least 6 characters")
  .max(20, "Password must not exceed 20 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,20}$/,
    "Password must contain an uppercase letter, a lowercase letter, a number and one of @$!%*?&#",
  );

export const otpRule = zod
  .string("Code is required")
  .regex(/^[0-9]{6}$/, "Enter the 6-digit code");

export const phoneRule = zod
  .string("Phone number is required")
  .nonempty("Phone number is required")
  .regex(
    /^(\+2|002)?01[0125][0-9]{8}$/,
    "Please enter a valid Egyptian phone number",
  );

export const objectIdRule = zod
  .string("Id is required")
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid id format");

export const messageContentRule = zod
  .string()
  .max(50000, "Content must not exceed 50000 characters");

// The API splits it into firstName / lastName (each 3-25 chars) and needs at least one space
export const usernameRule = zod
  .string("Name is required")
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(20, "Name must not exceed 20 characters")
  .regex(
    /^\S{3,}\s\S{3,}$/,
    "Enter your first and last name separated by one space (3+ letters each)",
  );

export const dobRule = zod
  .string()
  .optional()
  .refine(
    (v) => !v || (!Number.isNaN(Date.parse(v)) && new Date(v) < new Date()),
    "Date of birth must be in the past",
  );
